import React from "react";
import { toJpeg } from 'html-to-image';
import html2canvas from 'html2canvas';

export default function DownloadImage(){

    const download = async (e) => {
      const target_div = document.getElementById("grid_pixelated_image");
  
      target_div.style.height = `${target_div.scrollHeight}px`;
      target_div.style.width = `${target_div.scrollWidth}px`;
    
      // Ensure the div is rendered before capturing
      await html2canvas(target_div);
    
      // Reset height and width to original values
      target_div.style.height = '';
      target_div.style.width = '';
  
      toJpeg(target_div)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
      });
    };
  
    return (
      <button id = 'download_button' onClick={download}>Download</button>
    );
  }
  