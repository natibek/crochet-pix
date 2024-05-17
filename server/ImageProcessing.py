import numpy as np

class ImageProcessor():

    def __init__(self, img, width, height, mode = "regular") -> None:
        self.pixel_data = []        
        self.preprocessed = []
        self.colorScheme = []
        self.img_data = img

        self.width = width
        self.height = height
        self.threshold = 30
        self.chunk_size = 25
        self.stride = 25
        self.mode = mode

        self.preprocess()

    def preprocess(self, ):
        
        preprocessed_lst = []
        if self.mode == 'np':
            self.preprocessed = self.img_data
            self.shrink()
        else:
            for row in range(0,self.height):
                curRow = []

                for col in range(0, self.width*4, 4):
                    red = self.img_data[col + row * self.width * 4]
                    green = self.img_data[col + 1+ row * self.width * 4]
                    blue = self.img_data[col + 2 +row * self.width * 4]

                    if self.mode == "regular":
                        pixel = { "r": red, "g": green, "b": blue }
                    elif self.mode == 'tonp':
                        pixel = [red, green, blue]

                    curRow.append(pixel)

                preprocessed_lst.append(curRow)
            self.shrink()
            # self.preprocessed = np.array(preprocessed_lst)[::15, ::15]
            # self.pixel_data = self.preprocessed
            # print(self.preprocessed.shape, "place")
            # self.shrink(self.preprocessed.shape[1], self.preprocessed.shape[0])

    def arePixelsSimilar(self, pix1, pix2):
        if self.mode == "regular":
            r1, g1, b1 = pix1.values()
            r2, g2, b2 = pix2.values()
        else:
            r1, g1, b1 = pix1
            r2, g2, b2 = pix2
            # print(r1, g1, b1)
            # print(r2, g2, b2)
        if abs(r1 - r2) <= self.threshold and abs(g1 - g2) <= self.threshold and abs(b1 - b2) <= self.threshold:
            # print('similar')
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
    
    def shrink(self):
        
        print(self.width, self.height, 'dims')
        for row in range(0, self.height, self.stride):
            rowEnd = row + self.chunk_size
            if (rowEnd > self.height): rowEnd = self.height

            newRow = []
            for col in range(0, self.width, self.stride):
                colEnd = col + self.stride
                if (colEnd > self.width): colEnd = self.width
                # print(row, rowEnd, col, colEnd)
                curSubset = self.preprocessed[row:rowEnd, col:colEnd]
                newPixel = self.reduce(curSubset)
                # print(newPixel)
                
                if (self.inColorScheme(newPixel) is False) or len(self.colorScheme) == 0:
                    self.colorScheme.append(newPixel)
                else:
                    newPixel = self.inColorScheme(newPixel)
                newRow.append(newPixel)
            self.pixel_data.append(newRow)
    
        if self.mode != 'regular':
            # print(len(self.pixel_data))
            # for i in range(len(self.pixel_data)):
            #     print(len(self.pixel_data[i]))
            self.pixel_data = np.asarray(self.pixel_data, np.int64)
        