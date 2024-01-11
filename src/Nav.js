import UploadButton from "./UploadButton";
import DownloadImage from "./DownloadImage";
import OpenDesign from "./OpenDesign";
import SaveDesign from "./SaveDesign";
import { useState } from "react";
import { Modal } from "react-bootstrap";

export default function Nav(){
  
  const [ info, set_info ] = useState(false);

  return ( 
    <>
      <ul className='d-flex justify-content-evenly align-items-center px-5 py-3 border border-bottom shadows' style={{listStyle: 'none', gap: "8px", backgroundColor: "rgb(255,235, 210)", width: "100dvw"}}>
        <li className="" > <UploadButton /> </li>
        <li className="" > <OpenDesign /> </li>
        <li className="" > <SaveDesign /> </li>
        <li className="" > <DownloadImage /> </li>
        <li> <a onClick={() => { set_info( !info ) }}> <i className="bi bi-question-circle"></i> </a> </li>
      </ul>

      <Modal show = {info} onHide={ ()=> { set_info( !info ) } } centered className='position-absolute start-50 top-50 translate-middle'>
        <Modal.Header closeButton >
          How to use the Crochet Pattern Generator
        </Modal.Header>

        <Modal.Body className="d-flex flex-column justify-content-center align-items-start">
          <div className="p-2">
            <h2 className="fs-5"> Feature </h2>
            <p> How to use </p>
          </div>

          <div className="p-2">
            <h2 className="fs-5"> Feature </h2>
            <p> How to use </p>
          </div>

          
        </Modal.Body>
      </Modal>
    </>

  );
}