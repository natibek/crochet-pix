import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import './App.css';
import { toJpeg } from 'html-to-image';
import html2canvas from 'html2canvas';
import brush from "./assets/brush.svg";
import dot from "./assets/dot1.svg";
import fill from "./assets/fill.svg";



const ImageContext = createContext(null);
const IsProcessedContext = createContext();
const ToolContext = createContext(null);
const ColorContext = createContext(null);
const SelectedColorContextInd = createContext();
const SelectedColorContext = createContext();
const DimContext = createContext();

const api_url = "http://localhost:5000/api";

// async function fill_image_api_call(image_data, source, target_color, width, height){
//   let requestOptions = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       },
//     body: JSON.stringify({
//       image_data: (image_data), 
//       source: (source), 
//       target_color: (target_color), 
//       width: (width), 
//       height: (height)
//     })
//   };
//   console.log(requestOptions)
//   try{
//     const response = await fetch(api_url + "/fill", requestOptions);

//     if (!response.ok){
//       throw new Error("Error with POST 2");
//     }

//     const filled_img = await response.json();
//     return filled_img;
//   }
//   catch(error){
//     throw error;
//   }
// }

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
      <input type="file" id = "image_input" accept='image/*' onChange={image_upload}/>
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

  const download = async (e) => {
    const target_div = document.getElementById("grid_pixelated_image");

    target_div.style.height = `${target_div.scrollHeight}px`;
    target_div.style.width = `${target_div.scrollWidth}px`;
  
    // Ensure the div is rendered before capturing
    await html2canvas(target_div);
  
    // Reset height and width to original values
    target_div.style.height = '';
    target_div.style.width = '';

    toJpeg(target_div)
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

function Tool(){
  const tool_context = useContext(ToolContext);
  
  function tool_select(event) {
    if (event.target.id === "brush_tool" || event.target.id === "brush_img"){
      if(document.getElementById("brush_tool").style.borderStyle === "dashed"){
        document.getElementById("brush_tool").style.borderStyle = "solid";
        tool_context.set_tool("None");
      }
      else {
        document.getElementById("brush_tool").style.borderStyle = "dashed";
        tool_context.set_tool("Brush");

        if (document.getElementById("pixel_tool").style.borderStyle === "dashed"){
          document.getElementById("pixel_tool").style.borderStyle = "solid";
        } 
      }  
    } else {
      if(document.getElementById("pixel_tool").style.borderStyle === "dashed"){
        document.getElementById("pixel_tool").style.borderStyle = "solid";
        tool_context.set_tool("None");
      }
      else {
        document.getElementById("pixel_tool").style.borderStyle = "dashed";
        tool_context.set_tool("Pixel");

        if (document.getElementById("brush_tool").style.borderStyle === "dashed"){
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
          <div className='tools' id='pixel_tool' onClick={tool_select}> 
            <img src={dot} id = "pixel_img" alt='' width='25px'/>

          </div>

          <div className='tools' id='brush_tool' onClick={tool_select}> 
            <img src= {brush} id = "brush_img" alt='' width='25px' />
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomColor(){
  const color_context = useContext(ColorContext);
  const {selected_color_ind, set_selected_color_ind} = useContext(SelectedColorContextInd);
  const selected_color_context = useContext(SelectedColorContext);


  const selecting_color = (event) => {
    if (selected_color_ind !== event.target.id){
      set_selected_color_ind(event.target.id);
      selected_color_context.set_selected_color(event.target.style.backgroundColor);
    } else {
      set_selected_color_ind(null);
      selected_color_context.set_selected_color(null);
    }
  };

  if (color_context.color){
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
  const {selected_color_ind, set_selected_color_ind} = useContext(SelectedColorContextInd);
  const selected_color_context = useContext(SelectedColorContext);

  const default_color_scheme = [
    "#000000", "#FFFFFF", "#7F7F7F", "#C3C3C3", "#880015",
    "#B97A57", "#ED1C24", "#FFAEC9", "#FF7F27" , "#FFC90E",
    "#FFF200", "#EFE4B0", "#22B14C", "#B5E61D" , "#00A2E8",
    "#99D9EA", "#3F48CC", "#7092BE", "#A349A4", "#C8BFE7"
  ]
  
  const selecting_color = (event) => {
    if (selected_color_ind !== event.target.id){
      set_selected_color_ind(event.target.id);
      selected_color_context.set_selected_color(event.target.style.backgroundColor);
    } else {
      set_selected_color_ind(null);
      selected_color_context.set_selected_color(null);
    }
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

  const [mouse_pressed, set_mouse_pressed] = useState(false);
  // const [user_width, set_user_width] = useState('15');
  // const [user_height, set_user_height] = useState('15');

  const {dims, set_dims} = useContext(DimContext);
  const img_context = useContext(ImageContext); 
  const {is_processed, set_is_processed} = useContext(IsProcessedContext);
  const tool_context = useContext(ToolContext);
  const selected_color_context = useContext(SelectedColorContext);
  let ncols = dims.user_width; 
  let display_pixel_data = Array(dims.user_width*dims.user_height).fill({r:255, g: 255, b:255});
    
  let left_count = [];
  let right_count = [];
  let top_count = [];
  let bottom_count = [];

  for (let i = dims.user_height; i > 0; i--) {
    if (i % 2 !== 0){
      left_count.push('-');
      right_count.push(`${i}`);
    }
    else {
      left_count.push(`${i}`);
      right_count.push('-');
    }
  }

  for (let i = dims.user_width; i > 0; i--){
      top_count.push(`${i}`);
      bottom_count.push(`${i}`);
  }

  const left_count_div = (
    <div className='left_count'>
      {left_count.map((c, ind) => (
        (c === '-') ? <div className='count_lr_em' key={ind}></div> : <div className='count_lr' key={ind}>{c}</div>
      ))}
    </div>
  );
  const right_count_div = (
    <div className='right_count'>
      {right_count.map((c, ind) => (
        (c === '-') ? <div className='count_lr_em' key={ind}></div> : <div className='count_lr' key={ind}>{c}</div>

      ))}
    </div>
  );
  const top_count_div = (
    <div className='top_count'>
      {top_count.map((c, ind) => (
        <div className='count_ud' key={ind}>{c}</div>
      ))}
    </div>
  );
  const bottom_count_div = (
    <div className='bottom_count'>
      {bottom_count.map((c, ind) => (
        <div className='count_ud' key={ind}>{c}</div>
      ))}
    </div>
  );

  if (is_processed === "Yes"){
    display_pixel_data = img_context.processed_pixel_data.flat();
    ncols = img_context.processed_pixel_data[0].length;
    set_dims({
      user_width: img_context.processed_pixel_data[0].length,
      user_height: img_context.processed_pixel_data.length
    });
  } 
  
  const paint = (event) => {
    if (tool_context.tool === "Pixel"){
      if (selected_color_context.selected_color){
        event.target.style.backgroundColor = selected_color_context.selected_color;
        // let new_color = selected_color_context.selected_color.replace('rgb(',"").replace(")","").replaceAll(" ","").split(",");
        // new_color = {
        //   r: Number(new_color[0]),
        //   g: Number(new_color[1]),
        //   b: Number(new_color[2])
        // };
        // display_pixel_data[Number(event.target.id)] = new_color;
      } 
    } 
    // else if (tool_context.tool == "Fill"){
    //   const ind_x = (Number(event.target.id) % ncols);
    //   const ind_y = (Number(event.target.id) - ncols*ind_x);
    //   let target_color = selected_color_context.selected_color.replace('rgb(',"").replace(")","").replaceAll(" ","").split(",");
    //   target_color = {
    //     r: Number(target_color[0]),
    //     g: Number(target_color[1]),
    //     b: Number(target_color[2])
    //   };

    //   if (selected_color_context.selected_color){
    //     fill_image_api_call(
    //       display_pixel_data, 
    //       [ind_x,ind_y], 
    //       target_color, 
    //       ncols, 
    //       display_pixel_data.length/ncols)
    //     .then(data =>{
    //       display_pixel_data = data;
    //       img_context.set_processed_pixel_data(data);
    //       console.log("Filled");
    //     });

    //   } else {
    //     alert("Select a color");
    //   }
    // }
    
  };

  const paint_multiple = (event) => {
    if (tool_context.tool === "Brush" && mouse_pressed){
      if (selected_color_context.selected_color){
        event.target.style.backgroundColor = selected_color_context.selected_color;
        let new_color = selected_color_context.selected_color.replace('rgb(',"").replace(")","").replaceAll(" ","").split(",");
        new_color = {
          r: Number(new_color[0]),
          g: Number(new_color[1]),
          b: Number(new_color[2])
        };
        display_pixel_data[Number(event.target.id)] = new_color;
      } 
    } 
  };

  const set_dim = () => {
    const width_input = document.getElementById('grid_width');
    const height_input = document.getElementById('grid_height');

    set_dims({
      user_width: width_input.value,
      user_height: height_input.value
    })
  };

  const reset_grid = () => {
    set_is_processed('No');

    set_dims({
      user_width: 15,
      user_height: 15

    })

    const width_input = document.getElementById('grid_width');
    const height_input = document.getElementById('grid_height');
    const pixels = document.getElementsByClassName('pix');
    const pixelArray = Array.from(pixels);

    pixelArray.forEach((pix, _) => {
      if (pix){
        pix.style.backgroundColor = 'white';
      }
    });
  
    width_input.value = 15;
    height_input.value = 15;
  };

  const mouse_pressed_true = () => {
    set_mouse_pressed(true);
  };

  const mouse_pressed_false = () => {
    set_mouse_pressed(false);
  };  

  const nothing = () => {};

  return (
    <div className='grid_container' >

      <div className='canvas' id ="scrolling_canvas">
        <div className='make_scroll' id = "grid_pixelated_image">  

          <div className= {`grid_box ${is_processed === "Processing" ? 'processing' : ''}`}>

            <div className='up_down'>
              {top_count_div}

              <div className='left_right'>
                {left_count_div}

                <div 
                  className='grid_display' 
                  style={{'--num-cols': ncols}} 
                  onMouseDown={mouse_pressed_true}
                  onMouseUp={mouse_pressed_false}
                >
                  {
                    display_pixel_data.map((pixel_val, ind) => (
                      <div 
                        key = {ind}
                        id = {ind} 
                        className='pix' 
                        style={{backgroundColor: `rgb(${pixel_val.r},${pixel_val.g},${pixel_val.b})`}}
                        onClick= {is_processed === "Processing" ? nothing : paint}
                        onMouseMove= {is_processed === "Processing" ? nothing : paint_multiple}>
                      </div>
                    ))
            
                  }
                </div>
                {right_count_div}

              </div>
              {bottom_count_div}
            </div>
          </div>  
          {/* Grid box */}
        </div>
        <div 
            className = {`${is_processed === "Processing" ? 'loading' : 'not_loading'}`}
          >
            <div>Pixelating</div>
            <div id = "loading_img"><img  src={fill} width='300px' alt='Loading'/></div>
            
          </div>
      </div> 
      <div className= {
      `customizers ${is_processed === "Processing" ? 'not_loading' : ''}`} >
        
        <button id = 'reset_button' onClick={reset_grid}>Reset</button>

      <div className={
      `sizing_choice ${is_processed === "Yes" ? 'not_loading' : ''}`}>
      
        <div className='input_dim'>    
          <label htmlFor = "grid_width">Width:</label>
          <input type='text' id='grid_width' defaultValue =  {dims.user_width}></input>
        </div>

        <div className='input_dim'>    
          <label htmlFor = "grid_height">Height:</label>
          <input type='text' id= 'grid_height' defaultValue= {dims.user_height}></input>
        </div>
        
        <button className='wh_button' onClick={set_dim}>Submit</button>
      </div>
      </div>
      
    </div>
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
  const [is_processed, set_is_processed] = useState("No");
  const value = {is_processed, set_is_processed};

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

const DimContextProvider = ({children}) => {
  const [dims, set_dims] = useState({user_width:15,user_height:15});
  const value = { dims, set_dims };

  return (
    <DimContext.Provider value={value}>
      {children}
    </DimContext.Provider>
  );
};

export default function App() {

  return (
    <DimContextProvider>
    <SelectedColorContextProvider>
    <SelectedColorContextIndProvider>
      <ColorContextProvider>
        <ToolContextProvider>  
          <IsProcessedContextProvider>
            <ImageContextProvider>
                <Nav />
                {/* <div className='container'> */}
                  <div className='color_tool_container'>  
                    <Tool />
                    <DefaultColor />
                    <CustomColor />
                  </div> 
                  <div className='display_container'>
                    <Display />
                  </div>
                {/* </div> */}
            </ImageContextProvider>
          </IsProcessedContextProvider>
        </ToolContextProvider>
      </ColorContextProvider>
    </SelectedColorContextIndProvider>
    </SelectedColorContextProvider>
    </DimContextProvider>
  );
}





