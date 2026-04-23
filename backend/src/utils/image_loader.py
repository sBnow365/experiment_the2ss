from PIL import Image

def load_image(image_path: str) -> Image.Image:
    return Image.open(image_path)
