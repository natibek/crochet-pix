import { ColorContext, SelectedColorContextInd, SelectedColorContext } from './App';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Chrome } from '@uiw/react-color';

let selectedColorInd = null;

export function CustomColor(){
    const color_context = useContext(ColorContext);
    const selected_color_context = useContext(SelectedColorContext);
  
    const selecting_color = (event) => {
      if (selectedColorInd !== event.target.id){
        selectedColorInd = event.target.id;
        selected_color_context.set_selected_color(event.target.style.backgroundColor);
      } else {
        selectedColorInd = null;
        selected_color_context.set_selected_color(null);
      }
    };
  
    if (color_context.color){
      return (

        <div 
          className='flex-col-center p-4 shadows' 
          style={{borderRadius: "20px", backgroundColor:'white', height: 'fit-content', width: 'fit-content'}}
          >
          <p style={{fontSize: "14px"}}>Image Colors</p>

          <div className='color_palette'>
            {
              color_context.color.map((c, ind) => (
                <div
                  key={ind - 1000}
                  id = {ind - 1000}
                  style = {{backgroundColor: `rgb(${c.r},${c.g},${c.b})`}}
                  className = {`colors ${selectedColorInd === String(ind - 1000)? 'highlight':'small'}`}
                  onClick={selecting_color}
                  title={`rgb(${c.r},${c.g},${c.b})`}
                >
                </div>
              ))
            }
    
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

    const selected_color_context = useContext(SelectedColorContext);
    const [ user_colors, set_user_colors ] = useState([]); 
    let user_col_len = 0;
    const [ show_color_wheel, set_show_color_wheel ] = useState(false);
    const [ new_color, set_new_color ] = useState("#000000");
    const [ color_error, set_color_error ] = useState('');

    const default_color_scheme = [
      "#000000", "#FFFFFF", "#7F7F7F", "#C3C3C3", "#880015",
      "#B97A57", "#ED1C24", "#FFAEC9", "#FF7F27" , "#FFC90E",
      "#FFF200", "#EFE4B0", "#22B14C", "#B5E61D" , "#00A2E8",
      "#99D9EA", "#3F48CC", "#7092BE", "#A349A4", "#C8BFE7"
    ];

    const default_color_scheme_rgb = [
      "rgb(0,0,0)", "rgb(255,255,255)" ,"rgb(127,127,127)", "rgb(195,195,195)", "rgb(136,000,021)",
      "rgb(185,122,087)", "rgb(237,028,036)", "rgb(255,174,201)", "rgb(255,127,039)", "rgb(255,201,014)",
      "rgb(255,242,000)","rgb(239,228,176)","rgb(034,177,076)","rgb(181,230,029)","rgb(000,162,232)",
      "rgb(153,217,234)","rgb(063,072,204)","rgb(112,146,190)","rgb(163,073,164)","rgb(200,191,231)"
    ];

    function deleteColor(){

      if (
        selectedColorInd !== null && 
        selectedColorInd >= default_color_scheme.length && 
        selectedColorInd < default_color_scheme.length + user_colors.length
        )
      {
        const indexToRemove = selectedColorInd - default_color_scheme.length; 
        const latest_colors = user_colors.filter((color, index) => index !== indexToRemove);
        localStorage.setItem('user_colors', JSON.stringify(latest_colors));
        set_user_colors(latest_colors);

        selected_color_context.set_selected_color(null);
        selectedColorInd = null;
        
      }
    }

    useEffect(() => {
      const stored_colors = JSON.parse(localStorage.getItem('user_colors'));
      if (stored_colors && stored_colors.length > 0) set_user_colors(stored_colors);

    }, []);

    const selecting_color = (event) => 
    { // sets the selected color
      if (selectedColorInd !== event.target.id){ // if different than what is selected, update.
        selectedColorInd = event.target.id;
        selected_color_context.set_selected_color(event.target.style.backgroundColor);
      } else {
        selectedColorInd = null; // if the same, remove the selected.
        selected_color_context.set_selected_color(null);
      }
    };

    function add_color()
    {

      if (!default_color_scheme.includes(new_color) && !user_colors.includes(new_color)) {
        localStorage.setItem('user_colors', JSON.stringify([...user_colors, new_color]));
        set_user_colors([...user_colors, new_color]);
        set_show_color_wheel(false);
      }
      else{
        set_color_error(true);
        setTimeout(() => {
          set_color_error(false);
        }, 1000);
      }
    } 
    
    return (
      <>
      <div 
        className='flex-col-center p-4 shadows position-relative' 
        style={{borderRadius: "20px", backgroundColor:'white', height: 'fit-content', width: 'fit-content'}}
        >

          
        <p 
          className = "add_color position-absolute" 
          style = {{width: '16px', height: '16px', top: "21px", left: "35px"}}
          title = "Add color"
          onClick = {() => { set_show_color_wheel(!show_color_wheel) }}>
          +
        </p>

        <p 
          className = "add_color position-absolute" 
          style = {{width: '16px', height: '16px', top: "21px", right: "25px"}}
          title = "Add color"
          hidden = {selectedColorInd === null || selectedColorInd < 20}
          onClick = {() => { deleteColor() }}>
          -
        </p>
        <p style={{fontSize: "14px"}}>Colors</p>

        <div className='default_color_palette'>
          {default_color_scheme.map((color, ind) => (
            <div 
              id = {ind}
              className = {`colors ${selectedColorInd === String(ind)? 'highlight':'small'}`}
              onClick={selecting_color}
              key={ind} 
              style={{backgroundColor: color}}
              title={color}>
            </div>))
          }

          { 
          user_colors.map((color, ind) => (
            <div 
              id = {ind + default_color_scheme.length}
              className = {`colors ${selectedColorInd === String(ind  + default_color_scheme.length)? 'highlight':'small'}`}
              onClick={selecting_color}
              key={color} 
              style={{backgroundColor: color}}
              title={color}>
            </div>))
          }

        </div>
      </div>

      <Modal show = {show_color_wheel} onHide = {() => { set_show_color_wheel(!show_color_wheel) }} centered>
        <Modal.Header closeButton style = {{backgroundColor: "#DEEFF5"}}>
          Choose a New Color
        </Modal.Header>

        <Modal.Body className='flex-row-center py-3' style = {{backgroundColor: "hsl(194, 51%, 96%)"}}>
          <Chrome color = {new_color} onChange = {(color) => set_new_color(color.hex)}/>
        </Modal.Body>

        <Modal.Footer className='flex-col-center' style = {{backgroundColor: "#DEEFF5"}}>
          <button onClick={add_color} className={`btn bg-light-grey ${color_error ? 'shake': ''}`}>
            Add Color
          </button>
          <p style = {{color: 'red'}} hidden ={!color_error}> Color Already In List</p>
        </Modal.Footer>
      </Modal>
      </>
    );
}