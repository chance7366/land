import os
from PIL import Image

def analyze():
    img_path = "public/images/hero-calligraphy-gemini.png"
    if not os.path.exists(img_path):
        print("Image not found")
        return
    
    img = Image.open(img_path)
    print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
    
    # Check a 20x20 region at the top-left corner
    pixels = img.convert("RGBA")
    width, height = img.size
    
    colors = {}
    for y in range(min(50, height)):
        row = []
        for x in range(min(50, width)):
            r, g, b, a = pixels.getpixel((x, y))
            color = (r, g, b)
            colors[color] = colors.get(color, 0) + 1
            
    sorted_colors = sorted(colors.items(), key=lambda x: x[1], reverse=True)
    print("Most common colors in top-left 50x50:")
    for col, count in sorted_colors[:15]:
        print(f"Color {col}: {count} pixels")

if __name__ == "__main__":
    analyze()
