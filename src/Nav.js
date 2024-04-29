import UploadButton from "./UploadButton";
import DownloadImage from "./DownloadImage";
import OpenDesign from "./OpenDesign";
import SaveDesign from "./SaveDesign";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import brush from "./assets/brush.svg";
import dot from "./assets/dot1.svg";
import fill from "./assets/fill.svg";
import eraser from "./assets/eraser.svg"

export default function Nav(){
  
  const [ info, set_info ] = useState(false);

  return ( // rgb(255,235, 210)
    <>
      <ul className='d-flex justify-content-evenly align-items-center px-5 py-3 border border-bottom shadows navigation' 
        style={{listStyle: 'none', gap: "8px", backgroundColor: "#DEEFF5", marginBottom: '30px'}}> 
        <li > <UploadButton /> </li>
        <li > <OpenDesign /> </li>
        <li > <SaveDesign /> </li>
        <li > <DownloadImage /> </li>
        <li className="info"> <div onClick={() => { set_info( !info ) }}> <i className="bi bi-question-circle"></i> </div> </li>
      </ul>``

    <Modal show = {info} onHide={ ()=> { set_info( !info ) } } size = "lg" centered className = "w-100">
        <Modal.Header closeButton >
          How to use the Crochet Pattern Generator
        </Modal.Header>

        <Modal.Body style = {{width: "inherit"}} className = "p-4">
          <div className="p-2">
            <h2 className="fs-5"> Crochet Pattern Generator </h2>
            <p>
              <em>If using a mobile device, please use this page in landscape orientation.</em>
            </p>
            <p> 
              Create crochet patterns by converting images to editable pixel art or using the
              pixel canvas to come up with your own design. Use the pixel paint, brush paint, fill, 
              and eraser tools to improve pixel art from images or to draw your own patterns.
            </p>

            <p>  
              There are 20 default Paint inspired colors. You will also get the custom colors that make up
              the pixel art generated from an image when creating patterns from uploaded pictures.    
            </p>

            <p>
              You can save your pixel art to continue working on it in the future using the <em>Save Pattern </em> 
              button. It creates a .crochet file that contains your pixel art data. You can open these files with 
              the <em>Open Pattern</em> button to continue working on a pattern.
            </p>

            <p>
              You can download your final crochet pattern as an image with the row and column counters using the  
              <em> Download Image</em> button.
            </p>
          </div>

          <div className="p-2">
            <h2 className="fs-5"> Pattern From Image </h2>
            <p> 
              Upload an image file using the <em>Upload Picture</em> button. This will open a cropping window where you
              can select which section of the picture you want to generate the crochet pattern from. After pixelating 
              the selected region, you will get the pixel art for the region and the color scheme that makes up the 
              pixel art. You can edit this pixel art using the 4 tools.
            </p>
          </div>

          <div className="p-2">
            <h2 className="fs-5"> Resizing The Canvas</h2>
            <p> 
              You can use the <em>+</em> and <em>-</em> at the edges of the canvas to add or removes rows and columns.
              You can also use the width and height inputs at the bottom of the canvas to create a canvas with your desired
              dimensions. The maximum grid size is a 100 by 100 pixel grid. The minimum grid is a 1 by 1 pixel grid.
              You can also reset the canvas to a white 15 by 15 pixel grid using the <em>Reset</em> button at the bottom of the canvas.
            </p>
          </div>

          <div className="p-2">
            <h2 className="fs-5"> Pixel Tool <img src={dot} width="25px" alt=""/></h2>
            <p> Paints one pixel at a time. </p>
          </div>

          <div className="p-2">
            <h2 className="fs-5"> Brush Tool <img src={brush} width="25px" alt=""/></h2>
            <p> 
              Paints multiple pixels with a stroke. If using a mouse, left click on the canvas to start painting and left click
              again to stop. You also stop painting if you leave the canvas. If using a touch screen device, just 
              drag over the pixels you want to paint.
            </p>
          </div>

          <div className="p-2">
            <h2 className="fs-5"> Fill Tool <img src={fill} width="25px" alt=""/></h2>
            <p>
              Paints all neighboring pixels of the same color with the selected color.
            </p>
          </div>

          <div className="p-2">
            <h2 className="fs-5"> Eraser Tool <img src={eraser} width="25px" alt=""/></h2>
            <p>
              Erasers the coloring done to pixel and changes them back to white. Similar to the brush tool, if using a mouse, left click 
              on the canvas to start erasing and left click again to stop. You also stop erasing if you leave the canvas. If using a touch
              screen device, just drag over the pixels you want to erase. The eraser has 3 sizes which you can change to using the buttons above it. 
            </p>
            <ul style={{listStyle: "none"}}>
                <li>Size 1: Erasers one pixel at a time.</li>
                <li>Size 2: Erasers a pixel and neighbors that are one pixel away.</li>
                <li>Size 3: Erasers a pixel and neighbors that are upto 2 pixels away.</li>
              </ul>
          </div>

          
        </Modal.Body>
      </Modal>
    </>
  );
}