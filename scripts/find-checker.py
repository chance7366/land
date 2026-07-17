from PIL import Image

def find_checkerboard():
    img = Image.open("public/images/hero-calligraphy-gemini.png").convert("L")
    width, height = img.size
    
    # Let's print out the first 64 pixel values of row 10 and col 10
    row_pixels = [img.getpixel((x, 10)) for x in range(min(128, width))]
    col_pixels = [img.getpixel((10, y)) for y in range(min(128, height))]
    
    print("Row 10 pixels (first 128):")
    print(row_pixels)
    print("\nCol 10 pixels (first 128):")
    print(col_pixels)

if __name__ == "__main__":
    find_checkerboard()
