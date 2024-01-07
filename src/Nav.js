import UploadButton from "./UploadButton";
import DownloadImage from "./DownloadImage";
import OpenDesign from "./OpenDesign";
import SaveDesign from "./SaveDesign";

export default function Nav(){
    // Navigation bar
  return ( 
        <ul className='d-flex justify-content-between px-5 py-3 border border-bottom shadows sticky-top' style={{listStyle: 'none', gap: "4px", backgroundColor: "rgb(255,235, 210)"}}>
          <li className="" > <UploadButton /> </li>
          <li className="" > <OpenDesign /> </li>
          <li className="" > <SaveDesign /> </li>
          <li className="" > <DownloadImage /> </li>
        </ul>
    );
  }