from file import File

class Collection:
    def __init__(self):
        self.files = {}
    
    def add_file(self, file: File):
        self.files[file.path] = file

    def search_collection(self, query):
        #get probability of query in each file
        probabilities = {}
        for file in self.files.values():
            probabilities[file.path] = file.get_probability(query)
        self.print_probabilities(probabilities)
        return probabilities
    
    def print_probabilities(self, probabilities):
        for file, probability in probabilities.items():
            print(f'Probability of query in {file} is {probability}')
     

       
