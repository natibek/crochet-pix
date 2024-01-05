const math = require("mathjs");

// class FillTool{
//     constructor(image_data, source, target_color, width, height){
//         this.image_data = image_data;
//         this.source = source;
//         this.target_color = target_color;
//         this.width = width;
//         this.height = height;
//         this.matrix_pixel = null;
//     }

//     preprocess(){
//         this.matrix_pixel = []; 

//         for (let row = 0; row<this.height; row++){
//             let cur_row = [];
//             for (let col = 0; col<this.width ; col++){
//                 let pixel = this.image_data[col + this.width*row];
//                 cur_row.push(pixel);
//             }
//             this.matrix_pixel.push(cur_row);
//         }
//     }

//     equal(p_1, p_2){
//         if (p_1.r == p_2.r && p_1.g == p_2.g && p_1.b == p_2.b){
//             return true
//         }
//         return false
//     }

//     dfs(){
//         let visited = [];
//         let direction = [[-1,0],[0,-1],[0,1][1,0]];
//         let stack = [this.source];
//         console.log(stack)
//         while (stack.length >= 1){
//             const pos = stack.pop();
//             console.log(pos);
//             visited.push(String(pos[0])+String(pos[1]));

//             for (const dirs of direction){
//                 let new_pos = [(pos[0] + dirs[0]), (pos[1] + dirs[1])]
//                 if (new_pos[0] >= 0 && new_pos[0] < this.width){
//                     if (new_pos[1] >= 0 && new_pos[1] < this.height){
//                         if (this.equal(this.matrix_pixel[pos[0]][pos[1]], this.matrix_pixel[new_pos[0]][new_pos[1]])){
//                             if (!visited.includes(String(new_pos[0])+String(new_pos[1]))){
//                                 stack.push(new_pos);
//                             }
//                         }
//                     }
//                 }
//             }
//             this.matrix_pixel[pos[0]][pos[1]] = this.target_color;
//         }
//     }

//     get_filled_pixel(){
//         this.preprocess();
//         this.dfs();
//         return this.matrix_pixel;
//     }
// }


class ImageGenerator{
    constructor(){
        this.pixel_data = null;
        this.preprocessed = null;
        this.colorScheme = null;
        this.threshold = 30; //threshold for how similar rgb values can be to be grouped as the same color
        this.chunk_size = 25; //size of the chunks being grouped as one pixel
        this.stride = 25; //how many pixels a chunk is moved across
    }

    preprocess(imageData, width, height){
        this.preprocessed = []; 

        for (let row = 0; row<height; row++){
            let curRow = [];
            for (let col = 0; col<width*4 ; col+= 4){
                let pixel = {
                    r: imageData[col + row * width * 4],
                    g: imageData[col + 1+ row * width * 4],
                    b: imageData[col + 2 +row * width * 4]
                };
    
                curRow.push(pixel);
            }
            this.preprocessed.push(curRow);
        }
    }

    isSimilarPixels(pix1, pix2){
        let {r: red1, g: green1, b: blue1} = pix1;
        let {r: red2, g: green2, b: blue2} = pix2;

        if((Math.abs(red1 - red2) <= this.threshold)){
            if(Math.abs(blue1 - blue2) <= this.threshold){
                if(Math.abs(green1 - green2) <= this.threshold){
                    return true
                }
            }
        }
        return false

    }

    inColorScheme(curPixel){
        for (let pix of this.colorScheme){
            if (this.isSimilarPixels(pix, curPixel)){
                return pix;//or take the mean of the curPixel and pixel found. 
            }
        }
        return false;
    }

    reduce(matrix){
        let lst = matrix.flat();
        let reds = 0, blues = 0, greens = 0;

        for (let color of lst){
            reds += color.r;
            blues += color.b;
            greens += color.g;
        }
        return {r: reds/lst.length, g: greens/lst.length, b: blues/lst.length};
    }

    shrink(width, height){

        this.pixel_data = [];
        this.colorScheme = new Set();
        
        for (let row = 0; row < height; row += this.stride){
            let rowEnd = row + this.chunk_size;
            if (rowEnd >= height){
                rowEnd = height-1;
            } 

            let newRow = [];
            for (let col = 0; col < width; col += this.stride){
                let colEnd = col + this.chunk_size;
                if (colEnd >= width){
                    colEnd = width-1;
                }
                let curSubset = math.subset(this.preprocessed, math.index(math.range(row, rowEnd),math.range(col, colEnd)));
                let newPixel = this.reduce(curSubset);

                if (!this.inColorScheme(newPixel) || this.colorScheme.size == 0){
                    this.colorScheme.add(newPixel);
                } else {
                    newPixel = this.inColorScheme(newPixel);
                }
                
                newRow.push(newPixel);
            }
            this.pixel_data.push(newRow);
        }
    }

    performPreprocessing(imageData, width, height){
        this.preprocess(imageData, width, height);
        console.log("preprocessed");
    }

    performShrinking(width, height){
        this.shrink(width, height);
        console.log("shrunk");
    }
}

module.exports = {
    ImageGenerator
};