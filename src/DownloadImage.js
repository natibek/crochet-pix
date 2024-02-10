import React, { useState } from "react";
import { toJpeg } from 'html-to-image';
import { file_name } from "./UploadButton";
import { Modal } from "react-bootstrap";

export default function DownloadImage(){

    const [ downloading, set_downloading ] = useState(false);

    const download =  (e) => {

      set_downloading(true);

      setTimeout(() => {
        const target_div = document.getElementById("scrolling_canvas");
        target_div.style.overflow = 'none';
        target_div.style.maxHeight = 'fit-content';
        target_div.style.maxWidth = 'fit-content';
    
        toJpeg(target_div)
        .then(function (dataUrl) {
          set_downloading(false);
          let link = document.createElement('a');
          link.download = file_name + '-crochet.jpeg';
          link.href = dataUrl;
          link.click();
        });

        setTimeout(() => {
          target_div.style.overflow = 'auto';
          target_div.style.maxHeight = '550px';
          target_div.style.maxWidth = '700px';
        }, 0);
      }, 50);


    };

    return (
      <>
      <button className="btn bg-light-grey" id = 'download_button' onClick={download} style={{fontSize: "13px"}}>Download Image</button>

      <Modal show={downloading} keyboard = {false} backdrop = 'static' centered className="p-absolute top-50 start-50 translate-middle w-50">
        <Modal.Body className="flex-col-center p-5" style={{gap: "20px"}}>
          Downloading
          <div className="progress" style={{width : "100%"}}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              aria-valuenow="100" 
              aria-valuemin="0" 
              aria-valuemax="100" 
              style={{width: "100%"}}></div> 
          </div>

        </Modal.Body>

      </Modal>
      </>
    );
  }
  