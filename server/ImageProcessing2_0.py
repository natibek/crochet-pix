import numpy as np
from skimage.segmentation import slic
import cv2

class ImageProcessor():
    NUMSEGMENT = 170
    COMPACTNESS = 80
    RESIZEPARM = 5
    
    def __init__(self, img, width, height) -> None:
        
        self.colorScheme = []
        self.pixelData = []
        self.img = img
        self.width = width
        self.height = height
        self.threshold = 15

    def process(self):
        preprocessed = self.preprocess()
        dim = (self.width // self.RESIZEPARM, self.height // self.RESIZEPARM)
        resized = cv2.resize(preprocessed, dim, interpolation = cv2.INTER_LINEAR)
        pixelated = self.pixelate(resized)
        return self.convertStruct(pixelated)

    def preprocess(self):
        preprocessed = []
        for row in range(0,self.height):
            curRow = []

            for col in range(0, self.width*4, 4):
                red = self.img[col + row * self.width * 4]
                green = self.img[col + 1+ row * self.width * 4]
                blue = self.img[col + 2 +row * self.width * 4]

                pixel = [red, green, blue]
                curRow.append(pixel)

            preprocessed.append(curRow)
        
        return preprocessed

    def pixelate(self, preprocessed):
        original = np.int8(preprocessed)
        segmented = slic(original ,n_segments=self.NUMSEGMENT,compactness=self.COMPACTNESS)
        pixelated = self.reduce(segmented,original).tolist()
        return pixelated

    def colorCache(self, c1):
        r1, g1, b1 = c1
        for c2 in self.colorScheme:
            r2, g2, b2 = c1

            if abs(r1 - r2) > self.threshold: continue
            if abs(g1 - g2) > self.threshold: continue
            if abs(b1 - b2) > self.threshold: continue
            return c2

        self.colorScheme.append(c1)
        return c1

    def reduce(self, segmented, original):
        unique = np.unique(segmented)
        final = np.int8(original)

        for u in np.asarray((unique)).T:
            inds = np.where(segmented == u)
            avg_col = np.mean(final[inds], axis = 0, dtype=np.int8)
            final[inds] = self.colorCache(avg_col)

        return final
    
    def convertStruct(self, pixelated):
        for row in pixelated:
            curRow = []
            for color in row:
                curRow.append({
                    'r' : color[0],
                    'g' : color[1],
                    'b' : color[2]
                })
            self.pixelData.append(curRow)

        return self.pixelData, self.colorScheme