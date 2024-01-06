import numpy as np

class ImageProcessor():

    pixel_data = None
    preprocessed = None
    colorScheme = None
    threshold = 30
    chunk_size = 25
    stride = 25

    def preprocess(self, image_data, width, height):
        
        preprocessed_lst = []
        for row in range(0,height):
            curRow = []

            for col in range(0, width*4, 4):
                pixel = {
                    "r": image_data[col + row * width * 4],
                    "g": image_data[col + 1+ row * width * 4],
                    "b": image_data[col + 2 +row * width * 4]
                }
                
                curRow.append(pixel)

            preprocessed_lst.append(curRow)

        self.preprocessed = np.array(preprocessed_lst)
        print('preprocessed')


    def arePixelsSimilar(self, pix1, pix2):
        r1, g1, b1 = pix1.values()
        r2, g2, b2 = pix2.values()

        if abs(r1 - r2) <= self.threshold and abs(g1 - g2) <= self.threshold and abs(b1 - b2) <= self.threshold:
            return True
        else:
            return False

    def inColorScheme(self, curPixel):
        for pix in self.colorScheme:
            if self.arePixelsSimilar(pix, curPixel):
                return pix
        return False
    
    def reduce(self, matrix):
        lst = np.array(matrix).flat
        if len(lst) > 0:
            red_total = blue_total = green_total = 0

            for color in lst:
                red_total += color['r']
                blue_total += color['b']
                green_total += color['g']

            return {'r': red_total/len(lst), 'g': green_total/len(lst), 'b': blue_total/len(lst)}
        
        return False
    
    def shrink(self, width, height):

        self.pixel_data = []
        self.colorScheme = [] 

        for row in range(0, height, self.stride):
            rowEnd = row + self.chunk_size
            if (rowEnd >= height):
                rowEnd = height - 1

            newRow = []
            for col in range(0, width, self.stride):
                colEnd = col + self.stride
                if (colEnd >= width):
                    colEnd = width - 1

                curSubset = self.preprocessed[row:rowEnd, col:colEnd]
                newPixel = self.reduce(curSubset)

                if not newPixel:
                    continue
                if not self.inColorScheme(newPixel) or len(self.colorScheme) == 0:
                    self.colorScheme.append(newPixel)
                else:
                    newPixel = self.inColorScheme(newPixel)
                newRow.append(newPixel)

            self.pixel_data.append(newRow)
            
        print('shrunk')
        

    
    
        