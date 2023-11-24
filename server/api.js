const { isInteger } = require('mathjs');
const {ImageGenerator, FillTool} = require('./backend');

const imageGenerator = new ImageGenerator();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000; //8000;

app.listen(PORT, 
    () => console.log('API loaded on http://localhost:' + PORT)
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.use(express.json({limit: "100mb", extended: true}));

app.post("/api/process_image", (req, res) => {
    let original_pixel_data = req.body.image;
    let width = req.body.width;
    let height = req.body.height;
    // let new_chunk = Number(req.body.new_chunk);
    // let new_stride = Number(req.body.new_stride);

    // imageGenerator.chunk_size = new_chunk;
    // imageGenerator.stride = new_stride;
    imageGenerator.performPreprocessing(original_pixel_data, width, height);
    imageGenerator.performShrinking(width, height);
    
    let output = {pixel_data: imageGenerator.pixel_data, color_scheme:Array.from(imageGenerator.colorScheme)};
    res.status(200).send(JSON.stringify(output));

});

app.post("/api/fill", (req, res) => {
    const {image_data, source, target_color, width, height} = req.body;
    console.log(source, target_color, width, height);
    const filler = new FillTool(image_data, source, target_color, width, height);
    const filled_img = filler.get_filled_pixel();
    res.json(filled_img);

});