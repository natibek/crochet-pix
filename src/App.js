import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import './App.css';
import Tool from './Tool';
import { DefaultColor, CustomColor } from './Color';
import Display from './Display';
import Nav from './Nav';

export const ImageContext = createContext(null);
export const IsProcessedContext = createContext();
export  const ToolContext = createContext(null);
export const ColorContext = createContext(null);
export const SelectedColorContextInd = createContext();
export const SelectedColorContext = createContext();
export const DimContext = createContext();

export const api_url = "http://localhost:5000/api";

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
