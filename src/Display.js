import { useContext, useState, useEffect } from "react";
import { DimContext, ImageContext, ToolContext, SelectedColorContext, IsProcessedContext } from "./App"
import fill from "./assets/fill.svg";
import { signal } from "@preact/signals";
export const latest_img = signal();

export default function Display(){

    const [mouse_pressed, set_mouse_pressed] = useState(false);  
    const {dims, set_dims} = useContext(DimContext);
    const img_context = useContext(ImageContext); 
    const {is_processed, set_is_processed} = useContext(IsProcessedContext);
    const tool_context = useContext(ToolContext);
    const selected_color_context = useContext(SelectedColorContext);
    let ncols = dims.user_width; 
    const [ display_pixel_data, set_display_pixel_data ] = useState(Array(dims.user_width*dims.user_height).fill({r:255, g: 255, b:255}))
    
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
          (c === '-') ? <div className='count_lr_em' key={ind}></div> : <div className='flex-row-center count_lr text-center' key={ind}>{c}</div>

        ))}
      </div>
    );
    const right_count_div = (
      <div className='right_count'>
        {right_count.map((c, ind) => (
          (c === '-') ? <div className='count_lr_em' key={ind}></div> : <div className='flex-row-center count_lr text-center' key={ind}>{c}</div>
  
        ))}
      </div>
    );
    const top_count_div = (
      <div className='top_count'>
        {top_count.map((c, ind) => (
          <div className='flex-row-center count_ud text-center' key={ind}>{c}</div>
        ))}
      </div>
    );
    const bottom_count_div = (
      <div className='bottom_count'>
        {bottom_count.map((c, ind) => (
          <div className='flex-row-center count_ud text-center' key={ind}>{c}</div>
        ))}
      </div>
    );

    useEffect( () => {
      if (is_processed === "Yes"){
        const pixels = document.getElementsByClassName('pix');
        const pixelArray = Array.from(pixels);
        
        pixelArray.forEach((pix, _) => {
          if (pix){
            pix.style.backgroundColor = 'white';
          }
        });
      
        set_display_pixel_data(img_context.processed_pixel_data.flat());
        latest_img.value = img_context.processed_pixel_data.flat();
        ncols = img_context.processed_pixel_data[0].length;
        set_dims({
          user_width: img_context.processed_pixel_data[0].length,
          user_height: img_context.processed_pixel_data.length
        });
      } 
    }, [is_processed])
      
    const paint = (event) => {
      if (tool_context.tool === "Pixel"){
        if (selected_color_context.selected_color){
          event.target.style.backgroundColor = selected_color_context.selected_color;
          let new_color = selected_color_context.selected_color.replace('rgb(',"").replace(")","").replaceAll(" ","").split(",");
          new_color = {
            r: Number(new_color[0]),
            g: Number(new_color[1]),
            b: Number(new_color[2])
          };

          let temp = display_pixel_data;
          temp[Number(event.target.id)] = new_color;
          latest_img.value = temp;
        } 
      } 
      
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

          let temp = display_pixel_data;
          temp[Number(event.target.id)] = new_color;
          latest_img.value = temp;
        } 
      } 
    };
  
    const set_dim = () => {
      const width_input = document.getElementById('grid_width');
      const height_input = document.getElementById('grid_height');
      
      let temp = display_pixel_data;
      if (width_input.value * height_input.value > dims.user_width * dims.user_height){
        let diff = width_input.value * height_input.value - dims.user_width * dims.user_height
        let newPixels = Array(diff).fill({r:255, g: 255, b:255});
        let temp = [...display_pixel_data, ...newPixels];
        set_display_pixel_data(temp);
        latest_img.value = temp;
        set_dims({
          user_width: width_input.value,
          user_height: height_input.value
        });
      }
      else if ((width_input.value * height_input.value < dims.user_width * dims.user_height)){
        let temp = display_pixel_data.slice(0, width_input.value * height_input.value);
        set_display_pixel_data(temp);
        latest_img.value = temp;

        set_dims({
          user_width: width_input.value,
          user_height: height_input.value
        });
      }
      


    };
  
    const reset_grid = () => {
      set_is_processed('No');
  
      set_dims({
        user_width: 15,
        user_height: 15
  
      })
  
      const width_input = document.getElementById('grid_width');
      const height_input = document.getElementById('grid_height');

      set_display_pixel_data(Array(15*15).fill({r:255, g: 255, b:255}))
      width_input.value = 15;
      height_input.value = 15;
    };
  
    if (is_processed === "Processing"){
      return (
        <div className = 'flex-col-center loading rounded shadows_big p-5 my-3'>
        <div>Pixelating</div>
        <div id = "loading_img"><img  src={fill} width='300px' alt='Loading'/></div>            
      </div>
      );
    }
  
    return (
      <div className='grid_container flex-col-center' style={{width: 'fit-content'}} >
  
        <div className='canvas shadows_big' id ="scrolling_canvas">
          <div id = "grid_pixelated_image">  
          {/* this extends the background to make the scrolling work  */}
              <div className= 'grid_box'>
  
              <div className='up_down'>
                {top_count_div}
  
                <div className='left_right'>
                  {left_count_div}
  
                  <div 
                    draggable="false"
                    className='grid_display' 
                    style={{'--num-cols': ncols}} 
                    onMouseDown={ () => set_mouse_pressed(true) }
                    onMouseUp={ () => set_mouse_pressed(false) }
                  >
                    {
                      display_pixel_data.map((pixel_val, ind) => (
                        <div 
                          draggable="false"
                          key = {ind}
                          id = {ind} 
                          className='pix' 
                          style={{backgroundColor: `rgb(${pixel_val.r},${pixel_val.g},${pixel_val.b})`}}
                          onClick= {is_processed === "Processing" ? () => {} : paint}
                          onMouseMove= {is_processed === "Processing" ? () => {} : paint_multiple}
                          onDrag= {is_processed === "Processing" ? () => {} : ()=> set_mouse_pressed(false)}
                          >
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

        </div>

        <div className= {`flex-row-center ${is_processed === "Processing" ? 'not_loading' : ''}`} style={{gap: "20px", marginBottom: "20px"}}>
          
          <button className='btn bg-light-grey' id = 'reset_button' onClick={reset_grid}>Reset</button>
  
          <div className={
          `flex-row-center ${is_processed === "Yes" ? 'not_loading' : ''}`} style={{gap: "10px"}}>
          
            <div className='flex-row-center'>    
              <label htmlFor = "grid_width">Width:</label>
              <input type='text' id='grid_width' defaultValue =  {dims.user_width} className="text-center mx-2" style={{width: "50px"}}></input>
            </div>
    
            <div className='flex-row-center'>    
              <label htmlFor = "grid_height">Height:</label>
              <input type='text' id= 'grid_height' defaultValue= {dims.user_height} className="text-center mx-2" style={{width: "50px"}}></input>
            </div>
            
            <button className='btn bg-light-grey' onClick={set_dim}> Submit </button>
          </div>
        </div>
        
      </div>
    );
  }