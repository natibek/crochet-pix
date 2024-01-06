import { useState, useEffect, createContext, useContext } from 'react';
import { IsProcessedContext, ImageContext, ColorContext } from './App';
import { api_url } from './App';

async function process_image_api_call(requestData, width, height){
    /*
    Makes Post Api call to process input image.
  
    Input: 
        requestData -> canvas context (Image data)
        width -> canvas width (Image width)
        height -> canvas height (Image height)
  
    Output:
        Updates processed_image_data if api call is successful
    */
    let requestOptions =  {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          },
      body: JSON.stringify({
          image:(requestData), 
          width: (width), 
          height:(height),
      })
    };
  
    try {
        const response = await fetch(api_url + "/process_image", requestOptions);
  
        if (!response.ok){
          throw new Error("Error with POST");
        }
  
        const processed_image_data = await response.json();
        return processed_image_data;
  
    }
    catch(error) {
      throw error;
    }
  }
  

export default function UploadButton(){
    /*
      Upload Button component.
      Includes API call and image upload 
    */
    const img_context = useContext(ImageContext);
    const is_processed_context = useContext(IsProcessedContext);
    const color_context = useContext(ColorContext);
    const [raw_img, set_raw_image] = useState([]);
  
    const image_upload = (event) => {
      let file = event.target.files[0];
      
      if (file){
        const file_reader = new FileReader();
  
        file_reader.readAsDataURL(file);
        file_reader.onload = () => {
  
          const image = new Image();
          image.src = file_reader.result;
  
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            
            const canvas_context = canvas.getContext("2d", { willReadFrequently: true });
            canvas_context.drawImage(image, 0, 0);
            
            let request_data = canvas_context.getImageData(0,0,canvas.width, canvas.height).data;
  
            if (request_data){
              set_raw_image({img: request_data, width: image.width, height: image.height});          
            }
          };
        };
      };
  
    };
  
    useEffect(() => {
      // Use the updated state values here to make api call
      if (raw_img.img){
        is_processed_context.set_is_processed("Processing");
        try {
          process_image_api_call(
            raw_img.img, 
            raw_img.width, 
            raw_img.height,
          ).then(data => {
            let {pixel_data, color_scheme} = data;
            img_context.set_processed_pixel_data(pixel_data);
            color_context.set_color(color_scheme);
            is_processed_context.set_is_processed("Yes");
          });
          
        } catch (error) {
          is_processed_context.set_is_processed("No");
        }      
  
      }
    }, [raw_img]);
  
    return (
      <div className='upload'>
        <label htmlFor='image_input' className='btn bg-light-grey'> Upload Image </label>
        <input type="file" style={{display: 'none'}} id = "image_input" accept='image/*' onChange={image_upload}/>
      </div>
    );
  }
  