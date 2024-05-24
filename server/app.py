from flask import Flask, request, jsonify
from flask_cors import CORS
from ImageProcessing2_0 import ImageProcessor
import time
import gc, psutil

app = Flask(__name__)
# CORS(app , resources={r"/api/*": {"origins": ["https://www.crochet-pattern-generator.onrender.com", "https://crochet-pattern-generator.onrender.com", "http://localhost:3000"]}})
CORS(app)

# CORS(app)

@app.route('/api/process_image', methods = ["POST"])
def process_image():
    req = request.get_json()
    pixel_data = list(req['image'].values())
    width = int(req['width'])
    height = int(req['height'])

    start = time.time()
    imageProcesser = ImageProcessor(pixel_data, width, height)

    pixelated, colorScheme = imageProcesser.process()

    print(width,height, 'input')

    processing_time = time.time() - start

    output = {"pixel_data": pixelated,
              "color_scheme": colorScheme
              }
    
    print(pixelated)
    print(len(pixelated), len(pixelated[0]))
    memory_usage_before = psutil.Process().memory_info().rss / 1024 / 1024
    
    del imageProcesser
    gc.collect()
    memory_usage_after = psutil.Process().memory_info().rss / 1024 / 1024
    with open('log2_0.txt', 'a') as file:
        file.write(f"\n({width},{height}) -> {processing_time} \n")
        file.write(f"Memory before: {memory_usage_before} \n")
        file.write(f"Memory after : {memory_usage_after} \n")

    return jsonify(output)