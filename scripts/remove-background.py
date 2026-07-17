import numpy as np
from PIL import Image

def remove_background():
    # Load original image
    src_img = Image.open("public/images/hero-calligraphy-gemini.png")
    img_gray = src_img.convert("L")
    width, height = img_gray.size
    pixels = np.array(img_gray, dtype=np.float32)
    
    # 1. Fine optimization of parameters using grid search around ox=0.5, oy=8.5
    y_indices, x_coordinates = np.indices((height, width))
    
    def wave_1d(t):
        return np.clip((4.25 - np.abs((t % 17) - 4.25)) / 0.5 + 0.5, 0.0, 1.0)
    
    best_error = float('inf')
    best_ox = 0.5
    best_oy = 8.5
    best_low = 49.0
    best_high = 87.0
    
    # We will search finer offsets and also optimize low/high bounds
    bg_mask = pixels < 115
    
    # Let's search around our best estimates
    for ox in np.arange(0.0, 1.0, 0.1):
        for oy in np.arange(8.0, 9.0, 0.1):
            wx = wave_1d(x_coordinates - ox)
            wy = wave_1d(y_indices - oy)
            w2d = wx * wy + (1.0 - wx) * (1.0 - wy)
            
            # Let's solve for low and high analytically for this ox, oy!
            # Since pixels[bg_mask] = low + (high - low) * w2d[bg_mask], this is a simple linear regression:
            # y = a * x + b where y is pixels, x is w2d, b is low, a is (high - low).
            X = w2d[bg_mask]
            Y = pixels[bg_mask]
            
            # Solve least squares:
            A = np.vstack([X, np.ones_like(X)]).T
            a, b = np.linalg.lstsq(A, Y, rcond=None)[0]
            
            low = b
            high = a + b
            
            reconstructed = low + (high - low) * w2d
            error = np.mean((pixels[bg_mask] - reconstructed[bg_mask]) ** 2)
            
            if error < best_error:
                best_error = error
                best_ox = ox
                best_oy = oy
                best_low = low
                best_high = high
                
    print(f"Optimized Parameters:")
    print(f"  ox: {best_ox:.4f}")
    print(f"  oy: {best_oy:.4f}")
    print(f"  low: {best_low:.4f}")
    print(f"  high: {best_high:.4f}")
    print(f"  Background MSE: {best_error:.4f}")
    
    # Reconstruct the final perfect background map
    wx = wave_1d(x_coordinates - best_ox)
    wy = wave_1d(y_indices - best_oy)
    bg = best_low + (best_high - best_low) * (wx * wy + (1.0 - wx) * (1.0 - wy))
    
    # 2. Compute transparency alpha
    # Alpha = (img - bg) / (255 - bg)
    # Clip alpha to [0, 1]
    # Let's add a small offset or factor to make the text pop even better if needed.
    # We can do alpha = np.clip((pixels - bg) / (255.0 - bg), 0.0, 1.0)
    # To avoid divide by zero, 255.0 - bg is safe since bg <= best_high (~87)
    alpha = (pixels - bg) / (255.0 - bg)
    
    # Let's apply a slight curve to alpha to clean up any remaining background noise or bleeding.
    # If alpha is extremely small (noise), we can clamp it to 0.
    # To protect anti-aliasing, we can use a soft threshold:
    alpha_clean = np.where(alpha < 0.05, 0.0, alpha)
    # Boost slightly bright pixels so the text is solid white
    alpha_clean = np.clip(alpha_clean * 1.05, 0.0, 1.0)
    
    # Create final transparent RGBA image
    # RGB channels are pure white (255, 255, 255)
    rgba_img = np.zeros((height, width, 4), dtype=np.uint8)
    rgba_img[:, :, 0] = 255
    rgba_img[:, :, 1] = 255
    rgba_img[:, :, 2] = 255
    rgba_img[:, :, 3] = (alpha_clean * 255.0).astype(np.uint8)
    
    out = Image.fromarray(rgba_img, "RGBA")
    out.save("public/images/hero-calligraphy-gemini-transparent.png", "PNG")
    print("Saved public/images/hero-calligraphy-gemini-transparent.png successfully!")

if __name__ == "__main__":
    remove_background()
