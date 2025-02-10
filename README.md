# Crochet Pix

My sister crochets and her pipeline for coming up with designs is going to Pinterest and hoping that the crochet patterns she finds appeal to her. Image-to-crochet pattern conversion is a useful solution to avoid the search-and-hope strategy. 

Crochet Pix is a Django and JS web application that generates editable pixel art from images to design crochet patterns. It has features to allow downloading patterns as images as well as *.crochet* files to continue editing in the future. 

The aim of the image analysis is to converge similar hues to the same one and reduce the dimensions of the input to help make images crochetable. **scikit-image** is used to segment and simplify input images. 

