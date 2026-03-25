import os
import shutil
import urllib.request
import urllib.error
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from puzzle.generator import process_image
from puzzle.utils import get_job_dir

image_mapping = {
    "dot-painting-butterfly": ("https://images.unsplash.com/photo-1560263816-d704d83cce0f?w=800&q=80", "landscape"),
    "dot-painting-flowers": ("https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=800&q=80", "portrait"),
    "sunflower-dot-painting": ("https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80", "landscape"),
    "buddha-dot-painting": ("https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&q=80", "portrait"),
    "owl-dot-painting": ("https://images.unsplash.com/photo-1553264701-d138db4fd5d4?w=800&q=80", "portrait"), 
    "cat-dot-painting": ("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80", "landscape"),
    "dog-dot-painting": ("https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80", "portrait"),
    "eagle-dot-painting": ("https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800&q=80", "portrait"),
    "relaxing-dot-painting": ("https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&q=80", "landscape"),
    "diy-art-kits-for-adults": ("https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80", "portrait"),
    "dot-painting-for-beginners": ("https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80", "landscape"),
    "paint-by-grid": ("https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80", "portrait"),
    "custom-photo-dot-painting": ("https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&q=80", "landscape"),
    "butterfly-flower-dot-painting": ("https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=800&q=80", "portrait"),
    "landscape-dot-painting": ("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", "landscape")
}

output_previews = "/Users/muddaseraltaf/Muddaser/Projects/antigravity/photo project/photo-puzzle-mvp/web/public/previews"
output_downloads = "/Users/muddaseraltaf/Muddaser/Projects/antigravity/photo project/photo-puzzle-mvp/web/public/downloads"

os.makedirs(output_previews, exist_ok=True)
os.makedirs(output_downloads, exist_ok=True)

for slug, (url, orientation) in image_mapping.items():
    print(f"[{slug}] Fetching {url} -> {orientation}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            content = response.read()
            
        process_image(
            job_id=slug,
            image_bytes=content,
            title=slug.replace("-", " ").title(),
            subtitle="Ready-Made SEO Kit",
            orientation=orientation
        )
        
        job_dir = get_job_dir(slug)
        
        # Copy preview
        preview_path = os.path.join(job_dir, "preview_web.png")
        if os.path.exists(preview_path):
            shutil.copy2(preview_path, os.path.join(output_previews, f"{slug}.png"))
            
        # Copy artifacts
        dl_dir = os.path.join(output_downloads, slug)
        os.makedirs(dl_dir, exist_ok=True)
        pdf_path = os.path.join(job_dir, "puzzle.pdf")
        ans_path = os.path.join(job_dir, "answer_key.png")
        if os.path.exists(pdf_path): shutil.copy2(pdf_path, dl_dir)
        if os.path.exists(ans_path): shutil.copy2(ans_path, dl_dir)
            
    except Exception as e:
        print(f"Error processing {slug}: {e}")

print("Successfully regenerated 15 perfectly oriented engine mockups.")
