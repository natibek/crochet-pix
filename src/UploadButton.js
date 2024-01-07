import { useState, useEffect, createContext, useContext } from 'react';
import { IsProcessedContext, ImageContext, ColorContext } from './App';
import { api_url } from './App';
import { Modal } from 'react-bootstrap';
import ReactCrop from 'react-image-crop'

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
    const [ raw_img, set_raw_img ] = useState({img: null, width: null, height: null});
    const [ crop, set_crop ] = useState(false);
    const [ cropTool, setCropTool ] = useState();
    const [ img, set_img ] = useState();

    const image_upload = (event) => {
      let file = event.target.files[0];
      
      if (file){
        const file_reader = new FileReader();
  
        file_reader.readAsDataURL(file);
        file_reader.onload = () => {
  
          const image = new Image();
          image.src = file_reader.result;
  
          image.onload = () => {
            set_img(image);
            set_crop(true);
            
            setTimeout(() => {
              const image_element = document.getElementById('crop_image');
              image_element.src = image.src;
              setCropTool(null);
            }, 0);
            
          };
        };
      }
  
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
    
    const submitCrop = () => {    
      const image_element = document.getElementById('crop_image');
      set_crop(false);

      const aspectRatio =  img.width / image_element.width;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const crop_width = cropTool.width * aspectRatio;
      const crop_height = cropTool.height * aspectRatio;
      
      const canvas_context = canvas.getContext("2d", { willReadFrequently: true });
      canvas_context.drawImage(img, 0, 0);
      
      const request_data = canvas_context.getImageData(cropTool.x, cropTool.y, crop_width, crop_height).data;
      
      set_raw_img({img: request_data, width: crop_width, height: crop_height})
    };


    return (
      <>
      <div className='upload'>
        <label htmlFor='image_input' className='btn bg-light-grey'> Upload Image </label>
        <input type="file" style={{display: 'none'}} id = "image_input" accept='image/*' onChange={image_upload}/>
      </div>

      <Modal show = {crop} onHide={ ()=> { set_crop( !crop ) } } centered className='position-absolute start-50 top-50 translate-middle'>
        <Modal.Header closeButton >
          Crop Image
        </Modal.Header>
        
        <Modal.Body > 
          <div id="crop_field" className='flex-row-center border border-2' style={{minWidth: "300px", maxWidth: "700px"}}> 
            <ReactCrop crop={ cropTool } onChange={c => setCropTool(c)}>
              <img id = "crop_image"/>
            </ReactCrop>
          </div>
        </Modal.Body>

        <Modal.Footer className='flex-row-center'>

          {
            cropTool !== null ? 
            <button onClick={submitCrop} className='btn bg-light-grey'>
              Submit
            </button>
            :
            <></>
          }
          
        </Modal.Footer>
      </Modal>
      </>
    );
  }
  