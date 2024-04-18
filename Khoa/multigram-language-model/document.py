class Document:
    def __init__(self, path):
        self.path = path
        self.raw = []
        self.length = 0

        self.read_file()

    def read_file(self):
        with open(self.path, 'r') as file:
            for line in file:
                for word in line.split():
                    w = word.lower()
                    self.raw.append(w)