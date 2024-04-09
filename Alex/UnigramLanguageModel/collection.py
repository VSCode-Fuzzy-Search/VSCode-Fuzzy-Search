from file import File

class Collection:
    def __init__(self):
        self.files = []
    
    def add_file(self, file: File):
        self.files.append(file)

    def search_collection(self, query):
        #get probability of query in each file
        probabilities = []
        for file in self.files:
            probabilities.append(file.get_probability(query))
