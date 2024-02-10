import numpy as np

class ImageProcessor():

    def __init__(self, mode = "regular") -> None:
        self.pixel_data = None
        self.preprocessed = []
        self.colorScheme = []
        self.threshold = 30
        self.chunk_size = 5
        self.stride = 5
        self.mode = mode

    def preprocess(self, image_data, width, height):
        
        preprocessed_lst = []
        for row in range(0,height):
            curRow = []

            for col in range(0, width*4, 4):
                red = image_data[col + row * width * 4]
                green = image_data[col + 1+ row * width * 4]
                blue = image_data[col + 2 +row * width * 4]

                if self.mode == "regular":
                    pixel = { "r": red, "g": green, "b": blue }
                else:
                    pixel = [red, green, blue]

                curRow.append(pixel)

            preprocessed_lst.append(curRow)

        self.preprocessed = np.array(preprocessed_lst)
        self.shrink(width, height)

    def arePixelsSimilar(self, pix1, pix2):
        if self.mode == "regular":
            r1, g1, b1 = pix1.values()
            r2, g2, b2 = pix2.values()
        else:
            r1, g1, b1 = pix1
            r2, g2, b2 = pix2

        if abs(r1 - r2) <= self.threshold and abs(g1 - g2) <= self.threshold and abs(b1 - b2) <= self.threshold:
            return True
        return False

    def inColorScheme(self, curPixel):
        for pix in self.colorScheme:
            if self.arePixelsSimilar(pix, curPixel):
                return pix
        return False
    
    def reduce(self, matrix):
        if self.mode != "regular":
            return np.mean(np.mean(matrix, axis = 0), axis = 0)

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
        for row in range(0, height, self.stride):
            rowEnd = row + self.chunk_size
            if (rowEnd > height): rowEnd = height

            newRow = []
            for col in range(0, width, self.stride):
                colEnd = col + self.stride
                if (colEnd > width): colEnd = width

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
        