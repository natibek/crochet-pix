def make_right(height):
    return ["-" if i % 2 != 0 else i for i in range(height, 0, -1)]

def make_left(height):
    return [i if i % 2 != 0 else "-" for i in range(height, 0, -1)]

def make_horizontal(width):
    return list(range(width, 0, -1))