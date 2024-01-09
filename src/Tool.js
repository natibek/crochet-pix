import { useContext } from 'react';
import { ToolContext } from './App';
import brush from "./assets/brush.svg";
import dot from "./assets/dot1.svg";
import fill from "./assets/fill.svg";


export default function Tool(){
    const tool_context = useContext(ToolContext);
    
    function tool_select(event) {
      const fill_t = document.getElementById('fill_tool')
      const brush_t = document.getElementById('brush_tool')
      const pixel_t = document.getElementById('pixel_tool')
      const cur_tool = event.target.id;

      switch( cur_tool ){
        case "brush_tool":
        case "brush_img":
          if(brush_t.style.borderStyle === "dashed"){
            brush_t.style.borderStyle = "solid";
            tool_context.set_tool("None");
          }
          else {
            brush_t.style.borderStyle = "dashed";
            tool_context.set_tool("Brush");
            fill_t.style.borderStyle = "solid";
            pixel_t.style.borderStyle = "solid";
          } 
          break;

        case "fill_tool":
        case "fill_img":
          if(fill_t.style.borderStyle === "dashed"){
            fill_t.style.borderStyle = "solid";
            tool_context.set_tool("None");
          }
          else {
            fill_t.style.borderStyle = "dashed";
            tool_context.set_tool("Fill");
            brush_t.style.borderStyle = "solid";
            pixel_t.style.borderStyle = "solid";
          } 
          break;
        
        case "pixel_tool":
        case "pixel_img":
          if(pixel_t.style.borderStyle === "dashed"){
            pixel_t.style.borderStyle = "solid";
            tool_context.set_tool("None");
          }
          else {
            pixel_t.style.borderStyle = "dashed";
            tool_context.set_tool("Pixel");
            fill_t.style.borderStyle = "solid";
            brush_t.style.borderStyle = "solid";
          } 
      }
    }
  
    return (
      
      <div className='shadows' style={{borderRadius: "20px", backgroundColor:'white', height: 'fit-content'}}>
        <div className='d-flex flex-column justify-content-center align-items-center p-3' style={{gap: "20px"}}>
          <div>Tools</div>
          <div className='d-flex justify-content-center align-items-center' style={{gap: "20px"}}>

            <div className='tools' id='pixel_tool' onClick={tool_select} title='Pixel: paint one pixel at a time'> 
              <img src={dot} id = "pixel_img"  alt='' width='25px'/>
            </div>
  
            <div className='flex-row-center tools' id='brush_tool' onClick={tool_select} title='Brush: drag over multiple pixels to paint'> 
              <img src= {brush} id = "brush_img" alt='' width='25px' />
            </div>

            <div className='flex-row-center tools' id='fill_tool' onClick={tool_select} title='Fill: neigboring pixels of the same color get painted'> 
              <img src= {fill} id = "fill_img" alt='' width='25px' />
            </div>
          </div>
        </div>
      </div>
    );
  }
  