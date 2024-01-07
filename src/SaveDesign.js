import { latest_img } from "./Display";
import { DimContext } from "./App";
import { useContext } from "react";

export default function SaveDesign(){
    const {dims, set_dims} = useContext(DimContext);
    const save = () => {
        const output = {
            img_data: latest_img,
            width: dims.user_width,
            height: dims.user_height
        };
        
        console.log(output);
        const blob = new Blob([JSON.stringify(output, null)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pattern.crochet';
        link.click();
    };

    return (
        <div className="btn bg-light-grey" onClick={save}>Save Pattern</div>
    );
}