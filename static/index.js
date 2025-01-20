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
