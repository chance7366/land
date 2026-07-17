from PIL import Image

def profile():
    img = Image.open("public/images/hero-calligraphy-gemini.png").convert("RGBA")
    width, height = img.size
    
    colored_pixels = 0
    white_pixels = 0
    bg_pixels = 0
    other = 0
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            # Check if it has color (e.g. red stamp)
            max_diff = max(abs(r-g), abs(g-b), abs(r-b))
            if max_diff > 25:
                colored_pixels += 1
            elif r > 180 and g > 180 and b > 180:
                white_pixels += 1
            elif r < 110 and g < 110 and b < 110:
                bg_pixels += 1
            else:
                other += 1
                
    print(f"Total: {width*height}, Colored: {colored_pixels}, White: {white_pixels}, Background: {bg_pixels}, Other: {other}")

if __name__ == "__main__":
    profile()
