
import { useContext } from "react";
import { ColorContext, DimContext, ImageContext, IsProcessedContext } from "./App";
import { file_name } from "./UploadButton";

export default function OpenDesign(){
    
    const is_processed_context = useContext(IsProcessedContext);
    const img_context = useContext(ImageContext);
    const color_context = useContext(ColorContext);
    const dims = useContext(DimContext);

    const open = (event) => {
        const file = event.target.files[0];
        const [name, extension] = file.name.split('.');
        if (file){
            const file_reader = new FileReader();
            file_reader.readAsText(file);   
            file_reader.onload = (e) => {
                try{
                    const data = JSON.parse(e.target.result);
                    img_context.set_processed_pixel_data(data.img_data);
                    dims.set_dims({
                        user_width: data.width,
                        user_height: data.height
                    });
                    color_context.set_color(data.color_scheme);
                    // localStorage.setItem('custom_color_scheme', JSON.stringify(data.color_scheme));

                    is_processed_context.set_is_processed('Open');
                    file_name.value = name;
                }
                catch{
                    alert('File is corrupt');
                }
            }
        }

        event.target.value = null;

    };

    return (
        <div>
        <label htmlFor = "open_pattern" className="btn bg-light-grey" style={{fontSize: "13px"}}> Open Pattern </label>
        <input style={{display: 'none'}} id="open_pattern" type = 'file' accept=".crochet" onChange={open} />
        </div>
    );

}