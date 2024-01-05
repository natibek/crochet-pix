import { useContext } from 'react';
import { ToolContext } from './App';
import brush from "./assets/brush.svg";
import dot from "./assets/dot1.svg";

export default function Tool(){
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
  