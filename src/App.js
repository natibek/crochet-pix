import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import './App.css';

const ImageContext = createContext(null);

const api_url = "http://localhost:5000/api";

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
        // new_stride:stride_slider.value, 
        // new_chunk:chunk_size_slider.value
    })
  };

  try {

      // last_chunk = chunk_size_slider.value;
      // last_stride = stride_slider.value;
      const response = await fetch(api_url + "/process_image", requestOptions);

      if (!response.ok){
          throw new Error("Error Encoutered with API response");
      }

      const processed_image_data = await response.json();
      return processed_image_data

  }catch(error) {
      throw error;
  }
}

function UploadButton(){
  /*
    Upload Button component.
    Includes API call and image upload 
  */
  const value = useContext(ImageContext);
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
            console.log(request_data);
            set_raw_image({img: request_data, width: image.width, height: image.height});          
          }
        };
      };
    };
  };

  useEffect(() => {
    // Use the updated state values here to make api call
    if (raw_img.img){
      console.log("Uploaded", raw_img);
      
      process_image_api_call(
        raw_img.img, 
        raw_img.width, 
        raw_img.height,
      ).then(data => {
        console.log("API data", data);
        value.set_processed_pixel_data(data);
      });

    } else {
      console.log("no", raw_img);
    }
  }, [raw_img]);

  return (
    <div className='upload'>
      {/* <label htmlFor="image_input">Upload Image:  </label> */}
      <input type="file" id = "image_input" onChange={image_upload} accept='image/*'/>
    </div>
  );
}

function Nav(){
  // Navigation bar
  return ( 
      <ul className='nav_bar'>
        <li>
          <UploadButton />
        </li>
        <li><button id = "download_button" onClick={download_image}>Download</button></li>
      </ul>
  );
}

function download_image(){
  console.log("Download");
}

function Pixel(){
  //Pixel in Display. Key is object of form {x, y} and has color value
  function change_color(){
    // Element.style.backgroundColor = 'black'
  }

  return (
    <div 
      className='pix'
      onClick={change_color(this)}>
    </div>
  );
}

function Display(){
  const {processed_pixel_data, set_processed_pixel_data} = useContext(ImageContext); 
  const flatted_pixel_data = processed_pixel_data.flat();
  console.log(flatted_pixel_data[0]);
  return (
    <div className='grid_display' style={{'--num-rows': processed_pixel_data[0].length}}>

      {
        flatted_pixel_data.map((pixel_val, ind) => (
          // <Pixel key = {ind} style={{backgroundColor: `rgb(${pixel_val.r},${pixel_val.g},${pixel_val.b})`}}></Pixel>
          <div 
            key = {ind} 
            className='pix' 
            style={{backgroundColor: `rgb(${pixel_val.r},${pixel_val.g},${pixel_val.b})`}}>
          </div>
        ))

      }
    </div>
  );
}
/*
Display component

Paint tools component
*/
const ImageContextProvider = ({ children }) => {
  const [processed_pixel_data, set_processed_pixel_data] = useState(
    Array.from({ length: 20 }, () => Array(20).fill(0))
    );
  const value = { processed_pixel_data, set_processed_pixel_data };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};

export default function App() {

  return (
    <ImageContextProvider>
        <Nav />
        <div className='container'>
          <div className='canvas'>
            <Display />
          </div>
          </div>
    </ImageContextProvider>
    
  );
}





