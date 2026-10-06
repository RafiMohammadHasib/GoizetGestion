import os
from PIL import Image

for f in sorted(os.listdir('scratch')):
    if f.startswith('extracted_'):
        path = os.path.join('scratch', f)
        im = Image.open(path)
        print(f"{f}: size={im.size}, mode={im.mode}")
