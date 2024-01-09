
import { useContext } from "react";
import { ColorContext, DimContext, ImageContext, IsProcessedContext } from "./App";

export default function OpenDesign(){
    
    const is_processed_context = useContext(IsProcessedContext);
    const img_context = useContext(ImageContext);
    const color_context = useContext(ColorContext);
    const dims = useContext(DimContext);

    const open = (event) => {
        let file = event.target.files[0];
        
        if (file){
            const file_reader = new FileReader();
            file_reader.readAsText(file);   
            console.log(file);
            file_reader.onload = (e) => {
                try{
                    const data = JSON.parse(e.target.result);
                    img_context.set_processed_pixel_data(data.img_data);
                    dims.set_dims({
                        user_width: data.width,
                        user_height: data.height
                    });
                    color_context.set_color(data.color_scheme);
                    is_processed_context.set_is_processed('Open');
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
        <label htmlFor = "open_pattern" className="btn bg-light-grey"> Open Pattern </label>
        <input style={{display: 'none'}} id="open_pattern" type = 'file' accept=".crochet" onChange={open} />
        </div>
    );

}