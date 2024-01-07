import React from "react";
import { toJpeg } from 'html-to-image';
import html2canvas from 'html2canvas';
import { latest_img } from "./Display";

export default function DownloadImage(){
    // function create_export_image(){
    //   const export_img = (

    //   );
    // }
    const download =  (e) => {

      // create_export_image();
      const target_div = document.getElementById("grid_pixelated_image");
      const export_clone = target_div.cloneNode(true);

      console.log(export_clone);
  
      toJpeg(target_div)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
      });

      html2canvas(export_clone)
      .then( canvas => {
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'cloned.jpeg'
        link.click();
      })
    };

    return (
      <button className="btn bg-light-grey" id = 'download_button' onClick={download}>Download</button>
    );
  }
  