import { useContext, useState, useEffect } from 'react';
import {
  DimContext,
  ImageContext,
  ToolContext,
  SelectedColorContext,
  IsProcessedContext,
} from './App';
import fill from './assets/fill.svg';
import { signal } from '@preact/signals';
export const latest_img = signal(Array(15 * 15).fill({ r: 255, g: 255, b: 255 }));

export default function Display() {
  const [mouse_pressed, set_mouse_pressed] = useState(false);
  const { dims, set_dims } = useContext(DimContext);
  const img_context = useContext(ImageContext);
  const { is_processed, set_is_processed } = useContext(IsProcessedContext);
  const tool_context = useContext(ToolContext);
  const selected_color_context = useContext(SelectedColorContext);

  const [display_pixel_data, set_display_pixel_data] = useState({
    data: Array(dims.user_width * dims.user_height).fill({ r: 255, g: 255, b: 255 }),
  });

  function filling(e) {
    function same_color(p1, p2) {
      return p1.r === p2.r && p1.g === p2.g && p1.b === p2.b;
    }

    function valid_ind(ind) {
      const end_ind = dims.user_height * dims.user_width - 1;
      const first_row = ind - dims.user_width < 0;
      const last_row = ind + dims.user_width > end_ind;
      const last_col = (end_ind - ind) % dims.user_width === 0;
      const first_col = (end_ind + 1 - dims.user_width - ind) % dims.user_width === 0;
      let valid_inds = [];

      if (!first_row) valid_inds.push(ind - dims.user_width);
      if (!last_row) valid_inds.push(ind + dims.user_width);
      if (!first_col) valid_inds.push(ind - 1);
      if (!last_col) valid_inds.push(ind + 1);

      return valid_inds;
    }

    let visited = new Set();
    let queue = [Number(e.target.id) - 1000];

    const target_color = latest_img.value[Number(e.target.id) - 1000];

    let fill_color = selected_color_context.selected_color
      .replace('rgb(', '')
      .replace(')', '')
      .replaceAll(' ', '')
      .split(',');
    fill_color = {
      r: Number(fill_color[0]),
      g: Number(fill_color[1]),
      b: Number(fill_color[2]),
    };

    latest_img.value[Number(e.target.id) - 1000] = fill_color;

    while (queue.length > 0) {
      const cur_pix = queue.shift();
      let valid_inds = valid_ind(cur_pix);

      for (let pix of valid_inds) {
        if (!visited.has(pix) && same_color(target_color, latest_img.value[pix])) {
          queue.push(pix);
          latest_img.value[Number(pix)] = fill_color;
        }
      }
      visited.add(cur_pix);
    }

    set_display_pixel_data({ ...display_pixel_data, data: [...latest_img.value] });
  }

  function add_right() {
    let temp = latest_img.value;

    for (let i = dims.user_height * dims.user_width - 1; i >= 0; i -= dims.user_width) {
      temp.splice(i + 1, 0, { r: 255, g: 255, b: 255 });
    }

    set_dims((prev) => ({
      ...prev,
      user_width: prev.user_width + 1,
    }));

    latest_img.value = temp;
    set_display_pixel_data({ ...display_pixel_data, data: [...temp] });
  }

  function remove_right() {
    if (dims.user_width > 1) {
      let temp = latest_img.value;
      for (let i = dims.user_height * dims.user_width - 1; i >= 0; i -= dims.user_width) {
        temp.splice(i, 1);
      }

      set_dims((prev) => ({
        ...prev,
        user_width: prev.user_width - 1,
      }));

      latest_img.value = temp;
      set_display_pixel_data({ ...display_pixel_data, data: [...temp] });
    }
  }

  function add_left() {
    let temp = latest_img.value;
    for (let i = dims.user_height * dims.user_width; i > 0; i -= dims.user_width) {
      temp.splice(i, 0, { r: 255, g: 255, b: 255 });
    }
    temp = [{ r: 255, g: 255, b: 255 }, ...temp.slice(0, temp.length - 1)];

    set_dims((prev) => ({
      ...prev,
      user_width: prev.user_width + 1,
    }));

    latest_img.value = temp;
    set_display_pixel_data({ ...display_pixel_data, data: [...temp] });
  }

  function remove_left() {
    if (dims.user_width > 1) {
      let temp = latest_img.value;
      for (
        let i = dims.user_height * dims.user_width - dims.user_width;
        i >= 0;
        i -= dims.user_width
      ) {
        temp.splice(i, 1);
      }

      set_dims((prev) => ({
        ...prev,
        user_width: prev.user_width - 1,
      }));

      latest_img.value = temp;
      set_display_pixel_data({ ...display_pixel_data, data: [...temp] });
    }
  }

  function add_top() {
    set_dims((prev) => ({
      ...prev,
      user_height: prev.user_height + 1,
    }));

    const new_row = Array(dims.user_width).fill({ r: 255, g: 255, b: 255 });
    latest_img.value = [...new_row, ...latest_img.value];
    set_display_pixel_data({ ...display_pixel_data, data: [...latest_img.value] });
  }

  function remove_top() {
    if (dims.user_height > 1) {
      set_dims((prev) => ({
        ...prev,
        user_height: prev.user_height - 1,
      }));
      latest_img.value = latest_img.value.slice(dims.user_width);
      set_display_pixel_data({ ...display_pixel_data, data: [...latest_img.value] });
    }
  }
  function add_bottom() {
    set_dims((prev) => ({
      ...prev,
      user_height: prev.user_height + 1,
    }));

    latest_img.value = [
      ...latest_img.value,
      ...Array(dims.user_width).fill({ r: 255, g: 255, b: 255 }),
    ];
    set_display_pixel_data({ ...display_pixel_data, data: [...latest_img.value] });
  }

  function remove_bottom() {
    if (dims.user_height > 1) {
      set_dims((prev) => ({
        ...prev,
        user_height: prev.user_height - 1,
      }));

      latest_img.value = latest_img.value.slice(0, latest_img.value.length - dims.user_width);
      set_display_pixel_data({ ...display_pixel_data, data: [...latest_img.value] });
    }
  }

  let left_count = [];
  let right_count = [];
  let top_count = [];
  let bottom_count = [];

  for (let i = dims.user_height; i > 0; i--) {
    if (i % 2 !== 0) {
      left_count.push('-');
      right_count.push(`${i}`);
    } else {
      left_count.push(`${i}`);
      right_count.push('-');
    }
  }

  for (let i = dims.user_width; i > 0; i--) {
    top_count.push(`${i}`);
    bottom_count.push(`${i}`);
  }

  const right_count_div = (
    <div className="right_count" draggable="false">
      {left_count.map((c, ind) =>
        c === '-' ? (
          <div className="count_lr_em" key={-97 * ind}></div>
        ) : (
          <div className="flex-row-center count_lr text-center" key={-97 * ind}>
            {c}
          </div>
        )
      )}

      <div className="flex-row-center count_lr" style={{ gap: '5px', paddingTop: '10px' }}>
        <div className="grid_buttons" onClick={add_bottom}>
          {' '}
          +{' '}
        </div>
        <div className="grid_buttons" onClick={remove_bottom}>
          {' '}
          -{' '}
        </div>
      </div>
    </div>
  );
  const left_count_div = (
    <div className="left_count" draggable="false">
      <div className="flex-row-center count_lr" style={{ gap: '5px', paddingBottom: '10px' }}>
        <div className="grid_buttons" onClick={add_top}>
          {' '}
          +{' '}
        </div>
        <div className="grid_buttons" onClick={remove_top}>
          {' '}
          -{' '}
        </div>
      </div>
      {right_count.map((c, ind) =>
        c === '-' ? (
          <div className="count_lr_em" key={-51 * ind}></div>
        ) : (
          <div className="flex-row-center count_lr text-center" key={-51 * ind}>
            {c}
          </div>
        )
      )}
    </div>
  );
  const top_count_div = (
    <div className="top_count" draggable="false">
      {top_count.map((c, ind) => (
        <div className="flex-row-center count_ud text-center" key={-49 * ind}>
          {c}
        </div>
      ))}

      <div className="flex-row-center rotate_90" style={{ gap: '5px' }}>
        <div className="grid_buttons" onClick={add_right}>
          {' '}
          +{' '}
        </div>
        <div className="grid_buttons" onClick={remove_right}>
          {' '}
          -{' '}
        </div>
      </div>
    </div>
  );
  const bottom_count_div = (
    <div className="bottom_count" draggable="false">
      <div className="flex-row-center rotate_90" style={{ gap: '5px' }}>
        <div className="grid_buttons" onClick={add_left}>
          {' '}
          +{' '}
        </div>
        <div className="grid_buttons" onClick={remove_left}>
          {' '}
          -{' '}
        </div>
      </div>
      {bottom_count.map((c, ind) => (
        <div className="flex-row-center count_ud text-center" key={-1 * ind}>
          {c}
        </div>
      ))}
    </div>
  );

  // useEffect( () => {
  //   const pixel_backup = JSON.parse(localStorage.getItem("pixel_backup"));

  //   if (pixel_backup){
  //     set_display_pixel_data({data: pixel_backup})
  //     set_dims(JSON.parse(localStorage.getItem('dims')));
  //     color_context.set_color(JSON.parse(localStorage.getItem('custom_color_scheme')));
  //     latest_img.value = pixel_backup
  //     localStorage.setItem('pixel_backup', JSON.stringify(null));
  //   }

  // }, [])

  // useEffect( () => {
  //   localStorage.setItem('dims', JSON.stringify(dims));
  // }, [dims])

  // useEffect(()=>{
  //   function handleHover(e){
  //     e.target.style.borderColor = 'red';
  //     alert('hovering')
  //   };

  //   const pix = document.getElementsByClassName('pix');
  //   console.log(pix)

  //   pix.forEach(element => {
  //     element.addEventListener('hover', handleHover);
  //   });

  //   return () => {
  //     pix[0].removeEventListener('hover', handleHover);
  //   }
  // }, [])

  useEffect(() => {
    if (is_processed === 'Yes') {
      const pixels = document.getElementsByClassName('pix');
      const pixelArray = Array.from(pixels);

      pixelArray.forEach((pix, _) => {
        if (pix) {
          pix.style.backgroundColor = 'white';
        }
      });

      set_display_pixel_data({
        ...display_pixel_data,
        data: img_context.processed_pixel_data.flat(),
      });
      latest_img.value = img_context.processed_pixel_data.flat();
      set_dims({
        user_width: img_context.processed_pixel_data[0].length,
        user_height: img_context.processed_pixel_data.length,
      });
      set_is_processed('No');
    } else if (is_processed === 'Open') {
      set_display_pixel_data({ ...display_pixel_data, data: img_context.processed_pixel_data });
      console.log(img_context.processed_pixel_data);
      latest_img.value = img_context.processed_pixel_data;
      set_is_processed('No');
    }
  }, [is_processed]);

  const paint = (event) => {
    if (tool_context.tool === 'Pixel') {
      if (selected_color_context.selected_color) {
        let new_color = selected_color_context.selected_color
          .replace('rgb(', '')
          .replace(')', '')
          .replaceAll(' ', '')
          .split(',');
        new_color = {
          r: Number(new_color[0]),
          g: Number(new_color[1]),
          b: Number(new_color[2]),
        };
        latest_img.value[Number(event.target.id) - 1000] = new_color;
        event.target.style.backgroundColor = selected_color_context.selected_color;
      }
    } else if (tool_context.tool === 'Fill' && selected_color_context.selected_color) {
      filling(event);
    }
  };

  function neighbor_pixels(ind, size) {
    if (size === 0) {
      return [ind];
    }

    function neigboring(x, y) {
      let neighbors = [];

      if (x > 0) {
        neighbors.push([x - 1, y]);
      }
      if (x < dims.user_height - 1) {
        neighbors.push([x + 1, y]);
      }
      if (y > 0) {
        neighbors.push([x, y - 1]);
      }
      if (y < dims.user_width - 1) {
        neighbors.push([x, y + 1]);
      }
      if (x < dims.user_height - 1 && y < dims.user_width - 1) {
        neighbors.push([x + 1, y + 1]);
      }
      if (x > 0 && y > 0) {
        neighbors.push([x - 1, y - 1]);
      }
      if (x < dims.user_height - 1 && y > 0) {
        neighbors.push([x + 1, y - 1]);
      }
      if (x > 0 && y < dims.user_width - 1) {
        neighbors.push([x - 1, y + 1]);
      }

      return neighbors;
    }

    const x = Math.floor(ind / dims.user_width);
    const y = ind % dims.user_width;
    let neighborhood = [];

    let visited = new Set();
    let queue = [[x, y, 0]];

    while (queue.length > 0) {
      const cur_pix = queue.pop();
      const [cur_x, cur_y, depth] = cur_pix;
      if (!visited.has([cur_x, cur_y])) {
        visited.add([cur_x, cur_y]);

        if (depth !== size) {
          const neigbors = neigboring(cur_x, cur_y);
          neigbors.forEach((neighbor) => {
            if (!visited.has(neighbor)) {
              queue.push([neighbor[0], neighbor[1], depth + 1]);
              const index = dims.user_width * neighbor[0] + neighbor[1];
              neighborhood.push(index);
            }
          });
        }
      }
    }
    return neighborhood;
  }

  const brush_erase_touch = (event) => {
    if (tool_context.tool === 'Brush' && selected_color_context.selected_color) {
      const pixel = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
      if (pixel.className === 'pix') {
        let new_color = selected_color_context.selected_color
          .replace('rgb(', '')
          .replace(')', '')
          .replaceAll(' ', '')
          .split(',');
        new_color = {
          r: Number(new_color[0]),
          g: Number(new_color[1]),
          b: Number(new_color[2]),
        };
        latest_img.value[Number(pixel.id) - 1000] = new_color;
        pixel.style.backgroundColor = selected_color_context.selected_color;
      }
    } else if (tool_context.tool.includes('Eraser')) {
      const pixel = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
      if (pixel.className === 'pix') {
        const eraser_size = Number(tool_context.tool.slice(-1));
        const ind = Number(pixel.id) - 1000;
        const neighbors = neighbor_pixels(ind, eraser_size);
        neighbors.forEach((index) => {
          const cur_pix = document.getElementById(String(index + 1000));
          cur_pix.style.backgroundColor = 'white';
          latest_img.value[index] = { r: 255, g: 255, b: 255 };
        });
      }
    }
  };

  const brush_erase_mouse = (event) => {
    if (tool_context.tool === 'Brush' && mouse_pressed && selected_color_context.selected_color) {
      event.preventDefault();
      let new_color = selected_color_context.selected_color
        .replace('rgb(', '')
        .replace(')', '')
        .replaceAll(' ', '')
        .split(',');
      new_color = {
        r: Number(new_color[0]),
        g: Number(new_color[1]),
        b: Number(new_color[2]),
      };
      latest_img.value[Number(event.target.id) - 1000] = new_color;
      event.target.style.backgroundColor = selected_color_context.selected_color;
    } else if (tool_context.tool.includes('Eraser') && mouse_pressed) {
      event.preventDefault();
      const eraser_size = Number(tool_context.tool.slice(-1));
      const ind = Number(event.target.id) - 1000;

      const neighbors = neighbor_pixels(ind, eraser_size);

      neighbors.forEach((index) => {
        const cur_pix = document.getElementById(String(index + 1000));
        cur_pix.style.backgroundColor = 'white';
        latest_img.value[index] = { r: 255, g: 255, b: 255 };
      });
    }
  };

  const set_dim = () => {
    const width = Number(document.getElementById('grid_width').value);
    const height = Number(document.getElementById('grid_height').value);

    if (width <= 0 || height <= 0) return;

    if (width * height > dims.user_width * dims.user_height) {
      let diff = width * height - dims.user_width * dims.user_height;
      let newPixels = Array(diff).fill({ r: 255, g: 255, b: 255 });
      latest_img.value = [...latest_img.value, ...newPixels];
    } else if (width * height < dims.user_width * dims.user_height) {
      latest_img.value = latest_img.value.slice(0, width * height);
    }

    set_display_pixel_data((prev) => ({ data: latest_img.value, change: prev.change + 1 }));
    set_dims({
      user_width: width,
      user_height: height,
    });
  };

  const reset_grid = (e) => {
    e.preventDefault();
    set_is_processed('No');

    set_dims({
      user_width: 15,
      user_height: 15,
    });

    const width_input = document.getElementById('grid_width');
    const height_input = document.getElementById('grid_height');

    set_display_pixel_data((prev) => ({
      data: Array(15 * 15).fill({ r: 255, g: 255, b: 255 }),
      change: prev.change + 1,
    }));
    latest_img.value = Array(15 * 15).fill({ r: 255, g: 255, b: 255 });
    width_input.value = 15;
    height_input.value = 15;
  };

  if (is_processed === 'Processing') {
    return (
      <div className="flex-col-center loading rounded shadows_big p-5 my-3">
        <div>Pixelating</div>
        <div id="loading_img">
          <img src={fill} width="150px" alt="Loading" />
        </div>
      </div>
    );
  }
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      if (mouse_pressed) {
        set_display_pixel_data({ ...display_pixel_data, data: [...latest_img.value] });
      }
      set_mouse_pressed(!mouse_pressed);
    }
  };

  const handleMouseLeave = (e) => {
    set_display_pixel_data({ ...display_pixel_data, data: [...latest_img.value] });
    set_mouse_pressed(false);
  };

  return (
    <div
      className="grid_container flex-col-center"
      style={{ width: 'fit-content' }}
      draggable="false"
    >
      <div
        className="canvas shadows_big"
        id="scrolling_canvas"
        draggable="false"
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid_box" id="grid" draggable="false">
          <div className="up_down" draggable="false">
            {top_count_div}

            <div className="left_right" draggable="false">
              {left_count_div}

              <div
                draggable="false"
                className="grid_display"
                id="pix_grid"
                style={{ '--num-cols': dims.user_width }}
                onMouseDown={handleMouseDown}
              >
                {display_pixel_data.data.map((pixel_val, ind) => (
                  <div
                    draggable="false"
                    key={1000 + ind}
                    id={1000 + ind}
                    className="pix"
                    style={{
                      backgroundColor: `rgb(${pixel_val.r},${pixel_val.g},${pixel_val.b})`,
                    }}
                    onClick={paint}
                    onMouseMove={brush_erase_mouse}
                    onTouchMove={brush_erase_touch}
                    // onTouchEnd={ ()=> set_display_pixel_data({...display_pixel_data, data: [...latest_img.value]})}
                    title={ind}
                  ></div>
                ))}
              </div>
              {right_count_div}
            </div>
            {bottom_count_div}
          </div>

          {/* Grid box */}
        </div>
      </div>

      <div
        className={`flex-row-center ${is_processed === 'Processing' ? 'not_loading' : ''}`}
        style={{ gap: '20px', marginBottom: '20px' }}
      >
        <button
          className="btn bg-light-grey"
          id="reset_button"
          onClick={reset_grid}
          style={{ fontSize: '13px' }}
        >
          Reset
        </button>

        <div className="flex-row-center" style={{ gap: '10px' }}>
          <div className="flex-row-center">
            <label htmlFor="grid_width" style={{ fontSize: '13px' }}>
              Width:
            </label>
            <input
              type="text"
              id="grid_width"
              placeholder={dims.user_width}
              className="text-center mx-2"
              style={{ width: '50px' }}
            ></input>
          </div>

          <div className="flex-row-center">
            <label htmlFor="grid_height" style={{ fontSize: '13px' }}>
              Height:
            </label>
            <input
              type="text"
              id="grid_height"
              placeholder={dims.user_height}
              className="text-center mx-2"
              style={{ width: '50px' }}
            ></input>
          </div>

          <button className="btn bg-light-grey" onClick={set_dim} style={{ fontSize: '13px' }}>
            {' '}
            Submit{' '}
          </button>
        </div>
      </div>
    </div>
  );
}
