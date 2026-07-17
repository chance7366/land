import numpy as np
from PIL import Image

def optimize_checkerboard():
    img = Image.open("public/images/hero-calligraphy-gemini.png").convert("L")
    width, height = img.size
    pixels = np.array(img, dtype=np.float32)
    
    # Identify background pixels (guaranteed to be background since they are < 110)
    bg_mask = pixels < 110
    bg_pixels = pixels[bg_mask]
    
    # We want to model the background as:
    # bg_val = val_low + (val_high - val_low) * f((x - ox)/8.5, (y - oy)/8.5)
    # Let's test different offsets and find the best fit!
    
    best_error = float('inf')
    best_ox = 0
    best_oy = 0
    best_low = 49.0
    best_high = 87.0
    
    # Create x and y coordinate grids
    y_indices, x_coordinates = np.indices((height, width))
    
    # Since the period is 17, testing ox in [0, 17) and oy in [0, 17) is sufficient
    for ox in np.arange(0, 17, 0.5):
        for oy in np.arange(0, 17, 0.5):
            # Calculate checkerboard wave in x and y
            # A square wave can be approximated or computed exactly.
            # Since the transitions are linear (triangular or trapezoidal),
            # let's model the 1D wave as a trapezoidal wave with period 17.
            # Wave goes from 0 to 1.
            
            # Period in x and y is 17.
            phase_x = (x_coordinates - ox) % 17
            phase_y = (y_indices - oy) % 17
            
            # A trapezoidal wave with block size 8 and 0.5 pixel transition at each end
            # transition is 1 pixel wide.
            # Let's write a helper to compute the trapezoid
            # If phase < 0.5: transition from 1 to 0 (or similar)
            # We can simplify:
            # high is when phase is in [0.5, 8.5]
            # low is when phase is in [9.0, 17.0]
            # transitions are in [0, 0.5], [8.5, 9.0] etc.
            
            # For simplicity, let's use a continuous sine-like or exact trapezoid wave:
            # Let's define the 1D wave w(t) with period 17:
            # w(t) is 1 for t in [0.5, 8.0]
            # w(t) transitions from 1 to 0 for t in [8.0, 9.0]
            # w(t) is 0 for t in [9.0, 16.5]
            # w(t) transitions from 0 to 1 for t in [16.5, 17.5]
            
            # Let's define a function that does this:
            def wave_1d(t):
                # Using numpy piecewise or clip
                # w(t) = clip((8.5 - abs((t - 4.25) % 17 - 4.25)) / 1.0, 0, 1)
                # Let's test this formula:
                # If t = 4.25: abs(0) = 0 => (8.5 - 0)/1 = 8.5 -> clipped to 1. Correct.
                # If t = 0: abs(4.25) = 4.25 => (8.5 - 4.25)/1 = 4.25 -> clipped to 1. Correct.
                # If t = 8.5: abs(4.25) = 4.25 => (8.5 - 4.25) = 4.25 -> clipped to 1.
                # Wait, we want the transition to be at the block boundaries.
                # Let's try:
                # d = abs(t - 4.25)
                # If we want a block of 8 pixels high, 8 pixels low, and 1 pixel transition (total 17):
                # w(t) = clip((4.25 - abs(t % 17 - 4.25)) / 0.5 + 0.5, 0, 1)
                # Let's trace t from 0 to 17:
                # t=0: abs(-4.25)=4.25 => (4.25 - 4.25)/0.5 + 0.5 = 0.5 (Transition middle). Correct!
                # t=1: abs(-3.25)=3.25 => (4.25 - 3.25)/0.5 + 0.5 = 2.5 -> clipped to 1. Correct!
                # t=4.25: abs(0)=0 => (4.25)/0.5 + 0.5 = 9.0 -> clipped to 1. Correct!
                # t=7.5: abs(3.25)=3.25 => (4.25 - 3.25)/0.5 + 0.5 = 2.5 -> clipped to 1. Correct!
                # t=8.0: abs(3.75)=3.75 => (4.25 - 3.75)/0.5 + 0.5 = 1.5 -> clipped to 1. Correct!
                # t=8.5: abs(4.25)=4.25 => (4.25 - 4.25)/0.5 + 0.5 = 0.5 (Transition middle). Correct!
                # t=9.0: abs(4.75)=4.25 (since mod 17: wait, 9.0 % 17 - 4.25 = 4.75) => abs(4.75) = 4.75 => (4.25 - 4.75)/0.5 + 0.5 = -0.5 -> clipped to 0. Correct!
                # This formula is incredibly elegant and exact!
                return np.clip((4.25 - np.abs((t % 17) - 4.25)) / 0.5 + 0.5, 0.0, 1.0)
            
            # Let's test the 2D checkerboard wave.
            # In a checkerboard, if wx and wy are the 1D waves for x and y:
            # The 2D wave is wx * wy + (1 - wx) * (1 - wy)
            # Let's verify:
            # If wx=1, wy=1 => 1*1 + 0*0 = 1 (High)
            # If wx=0, wy=0 => 0*0 + 1*1 = 1 (High)
            # If wx=1, wy=0 => 1*0 + 0*1 = 0 (Low)
            # If wx=0, wy=1 => 0*1 + 1*0 = 0 (Low)
            # If wx=0.5, wy=0.5 => 0.25 + 0.25 = 0.5 (Transition middle)
            # This is mathematically perfect!
            
            wx = wave_1d(x_coordinates - ox)
            wy = wave_1d(y_indices - oy)
            w2d = wx * wy + (1.0 - wx) * (1.0 - wy)
            
            # Reconstructed background values
            reconstructed = best_low + (best_high - best_low) * w2d
            
            # Calculate error only on background pixels
            error = np.mean((pixels[bg_mask] - reconstructed[bg_mask]) ** 2)
            if error < best_error:
                best_error = error
                best_ox = ox
                best_oy = oy
                
    print(f"Best offset: ox={best_ox}, oy={best_oy}, MSE={best_error}")

if __name__ == "__main__":
    optimize_checkerboard()
