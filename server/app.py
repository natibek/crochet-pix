from flask import Flask, request, jsonify
from flask_cors import CORS
from ImageProcessing import ImageProcessor

imageProcesser = ImageProcessor()

app = Flask(__name__)
CORS(app , resources={r"/api/*": {"origins": ["https://www.crochet-pattern-generator.onrender.com", "https://crochet-pattern-generator.onrender.com", "http://localhost:3000"]}})

# CORS(app)

@app.route('/api/process_image', methods = ["POST"])
def process_image():
    req = request.get_json()
    original_pixel_data = list(req['image'].values())
    width = int(req['width'])
    height = int(req['height'])

    imageProcesser.preprocess(original_pixel_data, width, height)
    imageProcesser.shrink(width, height)

    output = {"pixel_data": imageProcesser.pixel_data,
              "color_scheme": imageProcesser.colorScheme
              }
    
    return jsonify(output)