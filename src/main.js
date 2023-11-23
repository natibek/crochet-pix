const apiUrl = "http://localhost:5173/api"
let processed_image_data = 0; //stores the process pixel data

async function process_image_api_call(requestData, width, height){
    /*
    Makes Post Api call to process input image.

    Input: 
        resquestData -> canvas context (Image data)
        width -> canvas width (Image width)
        height -> canvas height (Image height)

    Output:
        Updates processed_image_data if api call is successful
    */
    try {
        let requestOptions =  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                image:(requestData), 
                width: (width), height:(height), 
                new_stride:stride_slider.value, 
                new_chunk:chunk_size_slider.value
            })
        };
        last_chunk = chunk_size_slider.value;
        last_stride = stride_slider.value;
        let response = await fetch(apiUrl + "/process_image", requestOptions);

        if (!response.ok){
            throw new Error("Error Encoutered with API response");
        }

        processed_image_data = await response.json();

    }catch(error) {
        console.error(error);
    }
}

function draw_processed_image(){
    /*
    Draws image using pixel output data from the processing.
    */
    console.log("Drawing...");
    const pixel_size = 15;
    let finalImage = document.getElementById("display_canvas");
    height = processed_image_data.length;
    width = processed_image_data[0].length;

    finalImage.width = width*pixel_size;
    finalImage.height = height*pixel_size;
    let finalContext = finalImage.getContext('2d');
    
    for(let y = 0; y< height ; y++){
        for(let x = 0; x< width; x++){
            let red = Math.floor(processed_image_data[y][x].r);
            let green = Math.floor(processed_image_data[y][x].g);
            let blue = Math.floor(processed_image_data[y][x].b);
            finalContext.fillStyle =  'rgb(' + red + ', ' + green + ', ' + blue + ')';
            finalContext.fillRect(x*pixel_size, y*pixel_size, pixel_size, pixel_size);
        }
    }
}

const imageInput = document.getElementById('imageInput');
const chunk_size_slider = document.getElementById('chunk_size');
const stride_slider = document.getElementById('stride');
const regenerate_button = document.getElementsByClassName('regenerate')[0];
let display_width = null;
let display_height = null;
let last_stride = null;
let last_chunk = null;
let file = null;
let image_pixel_data = null;

regenerate_button.addEventListener('click', () =>{
    if (file && image_pixel_data){
        if (last_stride != stride_slider.value || last_chunk != chunk_size_slider.value){
            console.log("Regenerating");
            (async function(){
                await process_image_api_call(image_pixel_data, display_width, display_height);
                if (process_image_api_call != null){
                    draw_processed_image();
                }
            })();
        } else {
            console.log("Same");
        } 
    } else{
        console.log("No file");
    }
});

imageInput.addEventListener('input', () => {
    file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result;

            image.onload = () => {
                const canvas = document.createElement('canvas');
                display_width = canvas.width = image.width;
                display_height = canvas.height = image.height;
                
                const context = canvas.getContext("2d", { willReadFrequently: true });
                context.drawImage(image, 0, 0);
                
                let requestData = context.getImageData(0,0,canvas.width, canvas.height).data;
                image_pixel_data = requestData;
                (async function(){
                    await process_image_api_call(requestData, canvas.width, canvas.height);
                    if (process_image_api_call != null){
                        draw_processed_image();
                    }
                })();                
            }
        }
    }

});
