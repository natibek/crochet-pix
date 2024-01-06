import UploadButton from "./UploadButton";
import DownloadImage from "./DownloadImage";

export default function Nav(){
    // Navigation bar
    return ( 
        <ul className='d-flex justify-content-between px-5 py-3' style={{listStyle: 'none'}}>
          <li className="" > <UploadButton /> </li>
          <li className="" > <DownloadImage /> </li>
        </ul>
    );
  }