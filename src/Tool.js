import { useContext } from 'react';
import { ToolContext } from './App';
import brush from "./assets/brush.svg";
import dot from "./assets/dot1.svg";
import fill from "./assets/fill.svg";
import eraser from "./assets/eraser.svg"

export default function Tool(){
    const tool_context = useContext(ToolContext);
    
    function tool_select(event) {
      const fill_t = document.getElementById('fill_tool');
      const brush_t = document.getElementById('brush_tool');
      const pixel_t = document.getElementById('pixel_tool');
      const eraser_t = document.getElementById('eraser_tool');
      const cur_tool = event.target.id;
      const canvas = document.getElementById('pix_grid');
      
      if (tool_context.tool === "Brush"){
        canvas.style.touchAction = 'auto';

      }

      switch( cur_tool ){
        case "brush_tool":
        case "brush_img":
          if(brush_t.style.borderColor === "darkcyan"){
            brush_t.style.borderColor = "black";
            tool_context.set_tool("None");
          }
          else {
            brush_t.style.borderColor = "darkcyan";
            tool_context.set_tool("Brush");
            canvas.style.touchAction = 'none';

            fill_t.style.borderColor= "black";
            pixel_t.style.borderColor= "black";
            eraser_t.style.borderColor = 'black';
          } 
          break;

        case "fill_tool":
        case "fill_img":
          if(fill_t.style.borderColor === "darkcyan"){
            fill_t.style.borderColor = 'black';
            tool_context.set_tool("None");
          }
          else {
            fill_t.style.borderColor = 'darkcyan';
            tool_context.set_tool("Fill");
            brush_t.style.borderColor= "black";
            pixel_t.style.borderColor= "black";
            eraser_t.style.borderColor = 'black';
          } 
          break;
        
        case "pixel_tool":
        case "pixel_img":
          if(pixel_t.style.borderColor === "darkcyan"){
            pixel_t.style.borderColor = 'black';

            tool_context.set_tool("None");
          }
          else {
            pixel_t.style.borderColor = 'darkcyan';
            tool_context.set_tool("Pixel");
            fill_t.style.borderColor= "black";
            brush_t.style.borderColor= "black";
            eraser_t.style.borderColor = 'black';
          } 
          break;
        case "eraser_tool":
        case "eraser_img":
          if(eraser_t.style.borderColor === "darkcyan"){
            eraser_t.style.borderColor = 'black';

            tool_context.set_tool("None");
          }
          else {
            eraser_t.style.borderColor = 'darkcyan';
            tool_context.set_tool("Pixel");
            fill_t.style.borderColor= "black";
            brush_t.style.borderColor= "black";
            pixel_t.style.borderColor= "black";
          } 
      }
    }

    function increase_eraser_size() {

    }

    function decrease_eraser_size() {

    }
  
    return (
      
      <div className='shadows' style={{borderRadius: "20px", backgroundColor:'white', height: 'fit-content'}}>
        <div className='d-flex flex-column justify-content-center align-items-center p-3' style={{gap: "20px"}}>
          <div>Tools</div>
          <div className='d-flex justify-content-center align-items-center' style={{gap: "20px"}}>

            <div className='flex-col-center' style={{gap: "10px"}}>
              <div className='tools' id='pixel_tool' onClick={tool_select} title='Pixel: paint one pixel at a time'> 
                <img src={dot} id = "pixel_img"  alt='' width='25px'/>
              </div>
    
              <div className='flex-row-center tools' id='brush_tool' onClick={tool_select} title='Brush: drag over multiple pixels to paint'> 
                <img src= {brush} id = "brush_img" alt='' width='25px' />
              </div>
            </div>

            <div className='flex-col-center' style={{gap: "10px"}}>
              <div className='flex-col-center position-relative'>
                <div className='d-flex justify-content-between position-absolute' style={{top: '-25px', gap: '14px'}}>
                  <div className="grid_buttons" onClick={increase_eraser_size}> + </div>
                  <div className="grid_buttons" onClick={decrease_eraser_size}> - </div>
                </div>

                <div className='flex-row-center tools' id='eraser_tool' onClick={tool_select} title='Eraser: turns pixels back to white'> 
                  <img src= {eraser} id = "eraser_img" alt='' width='25px' />
                </div>
              </div>

              <div className='flex-row-center tools' id='fill_tool' onClick={tool_select} title='Fill: neigboring pixels of the same color get painted'> 
                <img src= {fill} id = "fill_img" alt='' width='25px' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  