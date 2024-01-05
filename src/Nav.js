import UploadButton from "./UploadButton";
import DownloadImage from "./DownloadImage";

export default function Nav(){
    // Navigation bar
    return ( 
        <ul className='nav_bar'>
          <li>
            <UploadButton />
          </li>
          <li><DownloadImage /></li>
        </ul>
    );
  }