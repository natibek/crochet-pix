import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import './App.css';
import { toJpeg } from 'html-to-image';
import brush from "./assests/brush.svg"
import fill from "./assests/fill.svg"


const ImageContext = createContext(null);
const IsProcessedContext = createContext();
const ToolContext = createContext(null);
const ColorContext = createContext(null);
const SelectedColorContextInd = createContext();
const SelectedColorContext = createContext();

const api_url = "http://localhost:5000/api";

async function fill_image_api_call(image_data, source, target_color, width, height){
  let requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      },
    body: JSON.stringify({
      image_data: (image_data), 
      source: (source), 
      target_color: (target_color), 
      width: (width), 
      height: (height)
    })
  };
  console.log(requestOptions)
  try{
    const response = await fetch(api_url + "/fill", requestOptions);

    if (!response.ok){
      throw new Error("Error with POST 2");
    }

    const filled_img = await response.json();
    return filled_img;
  }
  catch(error){
    throw error;
  }
}

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
        throw new Error("Error with POST");
      }

      const processed_image_data = await response.json();
      return processed_image_data

  }
  catch(error) {
    throw error;
  }
}

function UploadButton(){
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
      process_image_api_call(
        raw_img.img, 
        raw_img.width, 
        raw_img.height,
      ).then(data => {
        console.log("API data", data);
        let {pixel_data, color_scheme} = data;
        img_context.set_processed_pixel_data(pixel_data);
        color_context.set_color(color_scheme)
        is_processed_context.set_is_processsed(true);
      });
    }
  }, [raw_img]);

  return (
    <div className='upload' onClick={image_upload}>
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
        <li><DownloadImage /></li>
      </ul>
  );
}

function DownloadImage(){

  const download = (e) => {
    toJpeg(document.getElementById("grid_pixelated_image"))
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'my-image-name.jpeg';
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <button id = 'download_button' onClick={download}>Download</button>
  );


}

function Pixel(){

  return (
    <div className='pix'></div>
  );
}

function Tool(){
  const tool_context = useContext(ToolContext);
  
  function tool_select(event) {
    if (event.target.id == "brush_tool" || event.target.id == "brush_img"){
      if(document.getElementById("brush_tool").style.borderStyle == "dashed"){
        document.getElementById("brush_tool").style.borderStyle = "solid";
        tool_context.set_tool("None");
      }
      else {
        document.getElementById("brush_tool").style.borderStyle = "dashed";
        tool_context.set_tool("Brush");

        if (document.getElementById("fill_tool").style.borderStyle == "dashed"){
          document.getElementById("fill_tool").style.borderStyle = "solid";
        } 
      }  
    } else {
      if(document.getElementById("fill_tool").style.borderStyle == "dashed"){
        document.getElementById("fill_tool").style.borderStyle = "solid";
        tool_context.set_tool("None");
      }
      else {
        document.getElementById("fill_tool").style.borderStyle = "dashed";
        tool_context.set_tool("Fill");

        if (document.getElementById("brush_tool").style.borderStyle == "dashed"){
          document.getElementById("brush_tool").style.borderStyle = "solid";
        } 
      }  
    }
  }

  return (
    <div className='tools_container'>
      <div className='tools_box'>
        <div>Tools</div>
        <div className='tools_list'>
          <div className='tools' id='brush_tool' onClick={tool_select}> 
            <img src={brush} id = "brush_img" alt='' width='25px'/>

          </div>

          <div className='tools' id='fill_tool' onClick={tool_select}> 
            <img src= {fill} id = "fill_img" alt='' width='25px' />
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomColor(){
  const is_processed_context = useContext(IsProcessedContext);
  const color_context = useContext(ColorContext);
  const {selected_color_ind, set_selected_color_ind} = useContext(SelectedColorContextInd);
  const selected_color_context = useContext(SelectedColorContext);


  const selecting_color = (event) => {
    set_selected_color_ind(event.target.id);
    selected_color_context.set_selected_color(event.target.style.backgroundColor);
  };

  if (is_processed_context.is_processed){
    return (
      <div className='custom_color_container'>
        <div className='custom_color_box'>
          <div>Image Colors</div>

          <div className='custom_color_palette'>
            {
              color_context.color.map((c, ind) => (
                <div
                  key={ind + 20}
                  id = {ind + 20}
                  style = {{backgroundColor: `rgb(${c.r},${c.g},${c.b})`}}
                  className = {`custom_color ${selected_color_ind === String(ind + 20)? 'highlight':''}`}
                  onClick={selecting_color}
                >
                </div>
              ))
            }
    
          </div>
        </div>
      </div>

    );
  }
  else {
    return (
      <></>
    );
  }

}

function DefaultColor(){
  const tool_context = useContext(ToolContext);
  const {selected_color_ind, set_selected_color_ind} = useContext(SelectedColorContextInd);
  const selected_color_context = useContext(SelectedColorContext);

  const default_color_scheme = [
    "#000000", "#FFFFFF", "#7F7F7F", "#C3C3C3", "#880015",
    "#B97A57", "#ED1C24", "#FFAEC9", "#FF7F27" , "#FFC90E",
    "#FFF200", "#EFE4B0", "#22B14C", "#B5E61D" , "#00A2E8",
    "#99D9EA", "#3F48CC", "#7092BE", "#A349A4", "#C8BFE7"
  ]
  
  const selecting_color = (event) => {
    set_selected_color_ind(event.target.id);
    selected_color_context.set_selected_color(event.target.style.backgroundColor);
  }; 
  
  return (
    <div className='default_color_container'>
      <div className='default_color_box'>
        <div>Default Colors</div>

        <div className='default_color_palette'>
          {default_color_scheme.map((color, ind) => (
            <div 
              id = {ind}
              className = {`custom_color ${selected_color_ind === String(ind)? 'highlight':''}`}
              onClick={selecting_color}
              key={ind} 
              style={{backgroundColor: color}}>
            </div>
          ))}
        </div>
      </div>
    </div>  
  );
}

function Display(){
  const img_context = useContext(ImageContext); 
  const is_processed_context = useContext(IsProcessedContext);
  const tool_context = useContext(ToolContext);
  const selected_color_context = useContext(SelectedColorContext);
  let display_pixel_data = Array(400).fill({r:255, g: 255, b:255});
  let ncols = 20; 

  if (is_processed_context.is_processed){
    display_pixel_data = img_context.processed_pixel_data.flat();
    ncols = img_context.processed_pixel_data[0].length;
  }
  
  const paint = (event) => {
    if (tool_context.tool == "Brush"){
      if (selected_color_context.selected_color){
        event.target.style.backgroundColor = selected_color_context.selected_color;
        let new_color = selected_color_context.selected_color.replace('rgb(',"").replace(")","").replaceAll(" ","").split(",");
        new_color = {
          r: Number(new_color[0]),
          g: Number(new_color[1]),
          b: Number(new_color[2])
        };
        display_pixel_data[Number(event.target.id)] = new_color;
      } else {
        alert("Select a color");
      }
    } 
    else if (tool_context.tool == "Fill"){
      const ind_x = (Number(event.target.id) % ncols);
      const ind_y = (Number(event.target.id) - ncols*ind_x);
      let target_color = selected_color_context.selected_color.replace('rgb(',"").replace(")","").replaceAll(" ","").split(",");
      target_color = {
        r: Number(target_color[0]),
        g: Number(target_color[1]),
        b: Number(target_color[2])
      };

      if (selected_color_context.selected_color){
        fill_image_api_call(
          display_pixel_data, 
          [ind_x,ind_y], 
          target_color, 
          ncols, 
          display_pixel_data.length/ncols)
        .then(data =>{
          display_pixel_data = data;
          img_context.set_processed_pixel_data(data);
          console.log("Filled");
        });

      } else {
        alert("Select a color");
      }
    }
  };


  return (
      (<div id = "grid_pixelated_image"className='grid_display' style={{'--num-cols': ncols}}>
  
        {
          display_pixel_data.map((pixel_val, ind) => (
            <div 
              key = {ind}
              id = {ind} 
              className='pix' 
              style={{backgroundColor: `rgb(${pixel_val.r},${pixel_val.g},${pixel_val.b})`}}
              onClick={paint}>
            </div>
          ))
  
        }
      </div>)
  );
}

//Contexts for color, tool, state of processing, and processed image
const SelectedColorContextProvider = ({children}) => {
  const [selected_color, set_selected_color] = useState(null);
  const value = {selected_color, set_selected_color};

  return (
    <SelectedColorContext.Provider value={value}>
      {children}
    </SelectedColorContext.Provider>
  );
};

const SelectedColorContextIndProvider = ({children}) => {
  const [selected_color_ind, set_selected_color_ind] = useState();
  const value = {selected_color_ind, set_selected_color_ind};

  return (
    <SelectedColorContextInd.Provider value={value}>
      {children}
    </SelectedColorContextInd.Provider>
  );
};

const ColorContextProvider = ({children}) => {
  const [color, set_color] = useState(null);
  const value = {color, set_color};

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
};

const ToolContextProvider = ({children}) => {
  const [tool, set_tool] = useState(null);
  const value = {tool, set_tool};

  return (
    <ToolContext.Provider value = {value}>
      {children}
    </ToolContext.Provider>
  );
};

const IsProcessedContextProvider = ({children}) => {
  const [is_processed, set_is_processsed] = useState(false);
  const value = {is_processed, set_is_processsed};

  return (
    <IsProcessedContext.Provider value = {value}>
      {children}
    </IsProcessedContext.Provider>
  );

};

const ImageContextProvider = ({ children }) => {
  const [processed_pixel_data, set_processed_pixel_data] = useState([]);
  const value = { processed_pixel_data, set_processed_pixel_data };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

export default function App() {

  return (
    <SelectedColorContextProvider>
    <SelectedColorContextIndProvider>
      <ColorContextProvider>
        <ToolContextProvider>  
          <IsProcessedContextProvider>
            <ImageContextProvider>
                <Nav />
                <div className='container'>
                  <div className='color_tool_container'>  
                    <Tool />
                    <DefaultColor />
                    <CustomColor />
                  </div> 
                  <div className='canvas'>
                    <Display />
                  </div>
                </div>
            </ImageContextProvider>
          </IsProcessedContextProvider>
        </ToolContextProvider>
      </ColorContextProvider>
    </SelectedColorContextIndProvider>
    </SelectedColorContextProvider>
  );
}





