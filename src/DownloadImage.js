import React, { useState } from "react";
import { toJpeg } from 'html-to-image';
import { file_name } from "./UploadButton";

export default function DownloadImage(){

    const [ downloading, set_downloading ] = useState(false);

    const download =  (e) => {

      // create_export_image();
      set_downloading(true)
      const target_div = document.getElementById("scrolling_canvas");
      target_div.style.overflow = 'none';
      target_div.style.maxHeight = 'fit-content';
      target_div.style.maxWidth = 'fit-content';
      
  
      toJpeg(target_div)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = file_name + '-crochet.jpeg';
        link.href = dataUrl;
        link.click();
      });

      
      setTimeout(() => {
        target_div.style.overflow = 'auto';
        target_div.style.maxHeight = '550px';
        target_div.style.maxWidth = '700px';
      }, 0);
    };

    return (
      <>
      <button className="btn bg-light-grey" id = 'download_button' onClick={download} style={{fontSize: "13px"}}>Download Image</button>

      {
        downloading ? 
          <div className="">
          
          </div>
        :

        <></>
      }
      </>
    );
  }
  