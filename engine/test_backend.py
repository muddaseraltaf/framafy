import os
import requests

# Test script for FastAPI backend
url = "http://localhost:8000/api/generate"

# Create a dummy image
from PIL import Image
img = Image.new('RGB', (800, 1200), color=(100, 100, 100))
img.save("dummy.jpg")

with open("dummy.jpg", "rb") as f:
    files = {"image": ("dummy.jpg", f, "image/jpeg")}
    data = {"grid_size": "medium", "title": "Test Title", "subtitle": "Test Subtitle"}
    
    response = requests.post(url, files=files, data=data)
    print("Status:", response.status_code)
    try:
        print("Response:", response.json())
    except:
        print("Response Text:", response.text)
