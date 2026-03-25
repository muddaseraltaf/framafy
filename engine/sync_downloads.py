import os
import shutil

src_dir = "/Users/muddaseraltaf/Muddaser/Projects/antigravity/photo project/photo-puzzle-mvp/engine/outputs"
dest_dir = "/Users/muddaseraltaf/Muddaser/Projects/antigravity/photo project/photo-puzzle-mvp/web/public/downloads"
previews_dir = "/Users/muddaseraltaf/Muddaser/Projects/antigravity/photo project/photo-puzzle-mvp/web/public/previews"

slugs = [
    "dot-painting-butterfly", "dot-painting-flowers", "sunflower-dot-painting",
    "buddha-dot-painting", "owl-dot-painting", "cat-dot-painting",
    "dog-dot-painting", "eagle-dot-painting", "relaxing-dot-painting",
    "diy-art-kits-for-adults", "dot-painting-for-beginners", "paint-by-grid",
    "custom-photo-dot-painting", "butterfly-flower-dot-painting", "landscape-dot-painting"
]

os.makedirs(previews_dir, exist_ok=True)

for slug in slugs:
    src_path = os.path.join(src_dir, slug)
    dest_path = os.path.join(dest_dir, slug)
    
    if os.path.exists(src_path):
        os.makedirs(dest_path, exist_ok=True)
        
        pdf_src = os.path.join(src_path, "puzzle.pdf")
        if os.path.exists(pdf_src):
            shutil.copy2(pdf_src, dest_path)
            
        ans_src = os.path.join(src_path, "answer_key.png")
        if os.path.exists(ans_src):
            shutil.copy2(ans_src, dest_path)
            
        preview_src = os.path.join(src_path, "preview_web.png")
        if os.path.exists(preview_src):
            shutil.copy2(preview_src, os.path.join(previews_dir, f"{slug}.png"))
            
        print(f"Synced {slug} artifacts & previews to web frontend/")
    else:
        print(f"Directory missing for {slug}")

print("Static download sync complete.")
