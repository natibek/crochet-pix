import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import './App.css';
import Tool from './Tool';
import { DefaultColor, CustomColor } from './Color';
import Display, { latest_img } from './Display';
import Nav from './Nav';
import { Modal } from 'react-bootstrap';

export const ImageContext = createContext(null);
export const IsProcessedContext = createContext();
export  const ToolContext = createContext(null);
export const ColorContext = createContext(null);
export const SelectedColorContextInd = createContext();
export const SelectedColorContext = createContext();
export const DimContext = createContext();

export const api_url = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

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
  const [tool, set_tool] = useState("None");
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
  const [show_alert, set_show_alert] = useState(JSON.parse(localStorage.getItem('show_alert')) === "SHOW" || !JSON.parse(localStorage.getItem('show_alert')));

  useEffect( ()=>{
    const handleBeforeUnload = (e) => {
      const message = "Make sure you have saved all your progress.";
      e.returnValue = message;
      // localStorage.setItem('pixel_backup', JSON.stringify(latest_img.value));

      // const pixel_backup = JSON.parse(localStorage.getItem('pixel_backup'));
      // if(pixel_backup){
      //   localStorage.setItem('pixel_backup', JSON.stringify(null));
      // }
      // else{
      // }

      // setTimeout(() => {
      //   localStorage.setItem('pixel_backup', JSON.stringify(null));
      // }, 1000);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const alert_preferenece = JSON.parse(localStorage.getItem('show_alert'));

    if (!alert_preferenece){
      localStorage.setItem('show_alert', JSON.stringify("Show"))
    }
    else if (alert_preferenece === "Hide"){
      set_show_alert(false);
    }
    else if (alert_preferenece === "Show"){
      set_show_alert(true);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [] )

  function handleCheckboxChange(){
    const alert_preferenece = JSON.parse(localStorage.getItem('show_alert'));
    if (alert_preferenece === "Hide"){
      localStorage.setItem('show_alert', JSON.stringify("Show"))
    }
    else {
      localStorage.setItem('show_alert', JSON.stringify("Hide"))
    }
  }

  return (
    <DimContextProvider>
    <SelectedColorContextProvider>
    <SelectedColorContextIndProvider>
      <ColorContextProvider>
        <ToolContextProvider>  
          <IsProcessedContextProvider>
            <ImageContextProvider>
                <div className='app_container' >
                  <main>
                    <Nav />

                    <div className = "flew-col-center" style={{margin: 'auto'}}>
                      <div className='tools_colors' style={{gap: "15px"}}>  
                        <Tool />
                        <DefaultColor />
                        <CustomColor />
                      </div> 
                      
                      <div className='flex-row-center' >
                        <Display />
                      </div>
                    </div>                    
                  </main>

                  <br />
                  <footer className='flex-col-center p-2 border border-top shadows' style={{backgroundColor: '#DEEFF5', marginTop : 'auto'}}>
                    <div className='w-100 flex-row-center px-3'> 
                      Nathnael Bekele 
                      &nbsp;  <a href='https://www.linkedin.com/in/nathnael-bekele-2b240b257' target='_blank' rel='noreferrer'> <i className="bi bi-linkedin"></i></a> 
                      &nbsp; <a href='https://github.com/natibek' target='_blank' rel='noreferrer'> <i className='bi bi-github'></i></a>
                    </div>
                    <br />
                    <div> &copy; January 2024</div>
                  </footer>

                  <Modal show = {show_alert} onHide={ () => {set_show_alert(false)}} centered>                   
                    <Modal.Header closeButton>

                    </Modal.Header>
                    <Modal.Body className='flex-col-center'> 
                      <div className='p-4'>
                        If on mobile, please use landscape orientation :)
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <div className='flex-row-center ' style={{gap: "10px"}} >
                        <label style={{fontSize: '14px'}}> Don't Show Message Again </label>
                        <input type="checkbox" onChange={handleCheckboxChange} className='p-3'/>
                      </div>
                    </Modal.Footer>
                  </Modal>      

                </div>
            </ImageContextProvider>
          </IsProcessedContextProvider>
        </ToolContextProvider>
      </ColorContextProvider>
    </SelectedColorContextIndProvider>
    </SelectedColorContextProvider>
    </DimContextProvider>
  );
}
