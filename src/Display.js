import { useContext, useState, useEffect } from "react";
import { DimContext, ImageContext, ToolContext, SelectedColorContext } from "./App"

export default function Display(){

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