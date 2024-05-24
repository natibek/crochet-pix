import { latest_img } from './Display';
import { ColorContext, DimContext } from './App';
import { useContext } from 'react';
import { file_name } from './UploadButton';

export default function SaveDesign() {
  const { dims, set_dims } = useContext(DimContext);
  const color_context = useContext(ColorContext);

  const save = () => {
    const output = {
      img_data: latest_img.value,
      color_scheme: color_context.color,
      width: dims.user_width,
      height: dims.user_height,
    };

    const blob = new Blob([JSON.stringify(output, null)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file_name.value + '.crochet';
    link.click();
  };

  return (
    <div className="btn bg-light-grey" onClick={save} style={{ fontSize: '12px' }}>
      Save Pattern
    </div>
  );
}
