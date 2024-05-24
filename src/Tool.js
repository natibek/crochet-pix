import { useContext, useEffect, useState } from 'react';
import { ToolContext } from './App';
import brush from './assets/brush.svg';
import dot from './assets/dot1.svg';
import fill from './assets/fill.svg';
import eraser from './assets/eraser.svg';
import eraser_cursor from './assets/eraser_cursor.svg';

export default function Tool() {
  const tool_context = useContext(ToolContext);
  const [eraser_size, set_eraser_size] = useState(0);
  const [custom_cursor, set_custom_cursor] = useState();

  function tool_select(event) {
    const fill_t = document.getElementById('fill_tool');
    const brush_t = document.getElementById('brush_tool');
    const pixel_t = document.getElementById('pixel_tool');
    const eraser_t = document.getElementById('eraser_tool');
    const cur_tool = event.target.id;
    const grid = document.getElementById('pix_grid');

    if (tool_context.tool === 'Brush') {
      grid.style.touchAction = 'auto';
    } else if (tool_context.tool.includes('Eraser')) {
      grid.style.touchAction = 'auto';
    }

    switch (cur_tool) {
      case 'brush_tool':
      case 'brush_img':
        if (brush_t.style.borderColor === 'darkcyan') {
          brush_t.style.borderColor = 'black';
          grid.style.cursor = `default`;
          tool_context.set_tool('None');
        } else {
          brush_t.style.borderColor = 'darkcyan';
          tool_context.set_tool('Brush');
          grid.style.touchAction = 'none';
          grid.style.cursor = `none`;
          set_custom_cursor(
            <div id="custom_cursor" className="custom-cursor">
              <img src={brush} id="cursor_img" alt="" width="25px" />
            </div>
          );
          fill_t.style.borderColor = 'black';
          pixel_t.style.borderColor = 'black';
          eraser_t.style.borderColor = 'black';
        }
        break;

      case 'fill_tool':
      case 'fill_img':
        if (fill_t.style.borderColor === 'darkcyan') {
          fill_t.style.borderColor = 'black';
          grid.style.cursor = `default`;
          tool_context.set_tool('None');
        } else {
          fill_t.style.borderColor = 'darkcyan';
          tool_context.set_tool('Fill');
          grid.style.cursor = `none`;

          set_custom_cursor(
            <div id="custom_cursor" className="custom-cursor">
              <img src={fill} id="cursor_img" alt="" width="25px" />
            </div>
          );

          brush_t.style.borderColor = 'black';
          pixel_t.style.borderColor = 'black';
          eraser_t.style.borderColor = 'black';
        }
        break;

      case 'pixel_tool':
      case 'pixel_img':
        if (pixel_t.style.borderColor === 'darkcyan') {
          pixel_t.style.borderColor = 'black';
          grid.style.cursor = `default`;
          tool_context.set_tool('None');
        } else {
          pixel_t.style.borderColor = 'darkcyan';
          tool_context.set_tool('Pixel');
          grid.style.cursor = `none`;

          set_custom_cursor(
            <div id="custom_cursor" className="custom-cursor">
              <img src={dot} id="cursor_img" alt="" width="25px" />
            </div>
          );

          fill_t.style.borderColor = 'black';
          brush_t.style.borderColor = 'black';
          eraser_t.style.borderColor = 'black';
        }
        break;
      case 'eraser_tool':
      case 'eraser_img':
        if (eraser_t.style.borderColor === 'darkcyan') {
          eraser_t.style.borderColor = 'black';
          grid.style.cursor = `default`;
          tool_context.set_tool('None');
        } else {
          eraser_t.style.borderColor = 'darkcyan';
          tool_context.set_tool('Eraser ' + String(eraser_size));
          grid.style.cursor = `none`;
          grid.style.touchAction = 'none';
          fill_t.style.borderColor = 'black';
          brush_t.style.borderColor = 'black';
          pixel_t.style.borderColor = 'black';
        }
    }
  }

  useEffect(() => {
    if (tool_context.tool !== 'None') {
      let cursor_div, cursor_img;

      if (tool_context.tool.includes('Eraser')) {
        cursor_div = document.getElementById('eraser_cursor');
        cursor_img = document.getElementById('eraser_img');
        const cur_width = Number(cursor_img.style.width.slice(0, -2));
        if (cur_width === 0) {
          cursor_img.style.width = '25px';
        }
      } else {
        cursor_div = document.getElementById('custom_cursor');
        cursor_img = document.getElementById('cursor_img');
      }

      function handleCursorPos(e) {
        // updates cursor position for the pseudo cursors
        let posx, posy;
        if (e.type === 'mousemove') {
          posx = e.clientX + window.scrollX;
          posy = e.clientY + window.scrollY;
        } else if (e.type === 'touchmove') {
          posx = e.touches[0].clientX + window.scrollX;
          posy = e.touches[0].clientY + window.scrollY;
        }

        cursor_div.style.left = `${posx}px`;
        cursor_div.style.top = `${posy}px`;
        cursor_img.style.left = `${posx}px`;
        cursor_img.style.top = `${posy}px`;
      }
      const canvas = document.getElementById('pix_grid');

      function handleLeave() {
        // remove the cursor image when it leaves the grid/canvas
        cursor_div.style.display = 'none';
        cursor_img.style.display = 'none';
        canvas.removeEventListener('mousemove', handleCursorPos);
      }

      function handleEnter() {
        // make the pseudo-cursor visible once it enters the grid/canvas
        cursor_div.style.display = 'block';
        cursor_img.style.display = 'block';
        canvas.addEventListener('mousemove', handleCursorPos); // bind the handleCursorPos function to the grid
      }

      canvas.addEventListener('mouseleave', handleLeave);
      canvas.addEventListener('mouseenter', handleEnter);
      canvas.addEventListener('touchmove', handleCursorPos);
      canvas.addEventListener('touchstart', handleEnter);
      canvas.addEventListener('touchend', handleEnter);
      canvas.addEventListener('mouseover', handleEnter);

      return () => {
        canvas.removeEventListener('mousemove', handleCursorPos);
        canvas.removeEventListener('mouseleave', handleLeave);
        canvas.removeEventListener('mouseenter', handleEnter);
        canvas.removeEventListener('mouseover', handleEnter);
        canvas.removeEventListener('touchmove', handleCursorPos);
        canvas.removeEventListener('touchstart', handleEnter);
        canvas.removeEventListener('touchend', handleEnter);
      };
    } else {
      // if no tool is selected, make the custom cursor invisible
      const cursor_div = document.getElementById('custom_cursor');
      if (cursor_div) {
        cursor_div.style.display = 'none';
      }
    }
  }, [tool_context.tool]);

  function increase_eraser_size() {
    if (tool_context.tool.includes('Eraser') && eraser_size <= 1) {
      const eraser_name = 'Eraser ' + String(eraser_size + 1);
      tool_context.set_tool(eraser_name);
      set_eraser_size((prev) => prev + 1);

      const eraser_img = document.getElementById('eraser_img');

      if (eraser_img) {
        const new_width = Number(eraser_img.style.width.slice(0, -2)) + 40;
        eraser_img.style.width = `${new_width}px`;
      }
    }
  }

  function decrease_eraser_size() {
    if (tool_context.tool.includes('Eraser') && eraser_size >= 1) {
      const eraser_name = 'Eraser ' + String(eraser_size - 1);
      tool_context.set_tool(eraser_name);
      set_eraser_size((prev) => prev - 1);

      const eraser_img = document.getElementById('eraser_img');

      if (eraser_img) {
        const new_width = Math.max(Number(eraser_img.style.width.slice(0, -2)) - 40, 25);
        eraser_img.style.width = `${new_width}px`;
      }
    }
  }
  useEffect(() => {
    const brush_element = document.getElementById('brush_tool');
    const pixel_element = document.getElementById('pixel_tool');
    const fill_element = document.getElementById('fill_tool');
    const eraser_element = document.getElementById('eraser_tool');

    function handleKeyPresses(e) {
      // shortcuts to tools
      const key = e.code;

      if (key === 'KeyB') brush_element.click();
      if (key === 'KeyE') eraser_element.click();
      if (key === 'KeyF') fill_element.click();
      if (key === 'KeyP') pixel_element.click();
      // if (key === "Period") {
      //   alert(eraser_size)
      //   increase_eraser_size()

      // }
      // if (key === "Comma") {
      //   alert(eraser_size)
      //   decrease_eraser_size()
      // }
    }

    document.addEventListener('keydown', handleKeyPresses);

    return () => {
      document.removeEventListener('keydown', handleKeyPresses);
    };
  }, []);
  return (
    <div
      className="shadows"
      style={{ borderRadius: '20px', backgroundColor: 'white', height: 'fit-content' }}
    >
      {tool_context.tool.includes('Eraser') ? ( // pseudo-cursor for the eraser when it is selected
        <div id="eraser_cursor" className="custom-cursor">
          <img src={eraser_cursor} id="eraser_img" alt="" width="25px" />
        </div>
      ) : (
        custom_cursor
      )}
      <div className="flex-col-center p-4" style={{ gap: '20px' }}>
        <div style={{ fontSize: '14px' }}>Tools</div>
        <div className="flex-row-center" style={{ gap: '20px' }}>
          <div className="flex-col-center" style={{ gap: '10px' }}>
            <div
              className="tools"
              id="pixel_tool"
              onClick={tool_select}
              title="Pixel: paint one pixel at a time"
            >
              <img src={dot} id="pixel_img" alt="" width="25px" />
            </div>

            <div
              className="flex-row-center tools"
              id="brush_tool"
              onClick={tool_select}
              title="Brush: drag over multiple pixels to paint"
            >
              <img src={brush} id="brush_img" alt="" width="25px" />
            </div>
          </div>

          <div className="flex-col-center" style={{ gap: '10px' }}>
            <div className="flex-col-center position-relative">
              <div
                className="flex-row-center position-absolute"
                style={{ top: '-22px', gap: '8px' }}
              >
                <div
                  className="grid_buttons"
                  id="eraser_increase"
                  onClick={increase_eraser_size}
                  hidden={!tool_context.tool.includes('Eraser')}
                >
                  {' '}
                  +{' '}
                </div>
                <div style={{ fontSize: '14px' }} hidden={!tool_context.tool.includes('Eraser')}>
                  {eraser_size + 1}
                </div>
                <div
                  className="grid_buttons"
                  id="eraser_decrease"
                  onClick={decrease_eraser_size}
                  hidden={!tool_context.tool.includes('Eraser')}
                >
                  {' '}
                  -{' '}
                </div>
              </div>

              <div
                className="flex-row-center tools"
                id="eraser_tool"
                onClick={tool_select}
                title="Eraser: erases colored pixels"
              >
                <img src={eraser} id="eraser_img" alt="" width="25px" />
              </div>
            </div>

            <div
              className="flex-row-center tools"
              id="fill_tool"
              onClick={tool_select}
              title="Fill: neigboring pixels of the same color get painted"
            >
              <img src={fill} id="fill_img" alt="" width="25px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
