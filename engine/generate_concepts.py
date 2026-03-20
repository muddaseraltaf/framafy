import cv2
import numpy as np
from PIL import Image, ImageDraw
import urllib.request
import math
import os

def download_sample_image():
    url = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        arr = np.asarray(bytearray(resp.read()), dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
    
    # Resize and crop to 800x1000
    h, w = img.shape
    new_w = w
    new_h = int(w * 1.25)
    img = img[0:new_h, 0:new_w]
    return cv2.resize(img, (800, 1000))

def generate_halftone(gray_img):
    h, w = gray_img.shape
    cell_size = 12
    out_img = Image.new("L", (w, h), color=255)
    draw = ImageDraw.Draw(out_img)
    
    for y in range(0, h, cell_size):
        for x in range(0, w, cell_size):
            block = gray_img[y:y+cell_size, x:x+cell_size]
            mean_val = np.mean(block)
            
            # Map 0 (black) -> max_radius, 255 (white) -> 0
            # A little gamma correction for better visuals
            darkness = 1.0 - (mean_val / 255.0)
            radius = math.pow(darkness, 1.2) * (cell_size / 2.0 * 1.1)
            
            if radius > 1:
                cx, cy = x + cell_size//2, y + cell_size//2
                draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=0)
                
    out_img.save("concept_halftone_dotz.png")


def generate_squiggles(gray_img):
    h, w = gray_img.shape
    out_img = Image.new("L", (w, h), color=255)
    draw = ImageDraw.Draw(out_img)
    
    line_spacing = 15
    for y in range(line_spacing, h - line_spacing, line_spacing):
        points = []
        for x in range(0, w, 2):
            # Sample darkness
            val = gray_img[y, x]
            darkness = 1.0 - (val / 255.0)
            
            # Sine wave amplitude and frequency depend on darkness
            amp = darkness * (line_spacing * 0.8)
            freq = 0.1 + (darkness * 0.4)
            
            y_offset = math.sin(x * freq) * amp
            points.append((x, y + y_offset))
            
            # Draw point-by-point to vary thickness
            thickness = max(1, int(darkness * 4))
            if len(points) > 1:
                draw.line([points[-2], points[-1]], fill=0, width=thickness)
                
    out_img.save("concept_squiggles.png")


def generate_hatching(gray_img):
    h, w = gray_img.shape
    cell_size = 10
    out_img = Image.new("L", (w, h), color=255)
    draw = ImageDraw.Draw(out_img)
    
    for y in range(0, h, cell_size):
        for x in range(0, w, cell_size):
            block = gray_img[y:y+cell_size, x:x+cell_size]
            mean_val = np.mean(block)
            darkness = 1.0 - (mean_val / 255.0)
            
            cx, cy = x + cell_size//2, y + cell_size//2
            r = cell_size // 2 - 1
            
            if darkness > 0.8:
                draw.line([(cx-r, cy-r), (cx+r, cy+r)], fill=0, width=2)
                draw.line([(cx-r, cy+r), (cx+r, cy-r)], fill=0, width=2)
                draw.line([(cx, cy-r), (cx, cy+r)], fill=0, width=2)
            elif darkness > 0.6:
                draw.line([(cx-r, cy-r), (cx+r, cy+r)], fill=0, width=2)
                draw.line([(cx-r, cy+r), (cx+r, cy-r)], fill=0, width=2)
            elif darkness > 0.3:
                draw.line([(cx-r, cy+r), (cx+r, cy-r)], fill=0, width=2)
            elif darkness > 0.1:
                draw.line([(cx-r, cy+r), (cx+r, cy-r)], fill=0, width=1)

    out_img.save("concept_hatching.png")


if __name__ == "__main__":
    print("Downloading sample portrait...")
    gray = download_sample_image()
    print("Generating Halftone Dotz concept...")
    generate_halftone(gray)
    print("Generating Squiggles concept...")
    generate_squiggles(gray)
    print("Generating Hatching concept...")
    generate_hatching(gray)
    print("Done. Saved 3 concept images.")
