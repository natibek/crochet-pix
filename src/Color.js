import { ColorContext, SelectedColorContextInd, SelectedColorContext } from './App';
import { useContext } from 'react';


export function CustomColor(){
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
        <div className='shadows' style={{borderRadius: "20px", backgroundColor:'white', height: 'fit-content'}}>
          <div className='d-flex flex-column justify-content-center align-items-center p-3' style={{gap: "10px"}}>
            <div>Image Colors</div>
  
            <div className='color_palette'>
              {
                color_context.color.map((c, ind) => (
                  <div
                    key={ind + 20}
                    id = {ind + 20}
                    style = {{backgroundColor: `rgb(${c.r},${c.g},${c.b})`}}
                    className = {`colors ${selected_color_ind === String(ind + 20)? 'highlight':''}`}
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
  
export function DefaultColor(){
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
      <div className='shadows' style={{borderRadius: "20px", backgroundColor:'white', height: 'fit-content'}}>
        <div className='d-flex flex-column justify-content-center align-items-center p-3' style={{gap: "10px"}}>
          <div>Default Colors</div>
  
          <div className='color_palette'>
            {default_color_scheme.map((color, ind) => (
              <div 
                id = {ind}
                className = {`colors ${selected_color_ind === String(ind)? 'highlight':''}`}
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