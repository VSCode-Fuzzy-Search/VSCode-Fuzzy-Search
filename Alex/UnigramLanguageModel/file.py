class File:
    def __init__(self, path):
        self.text = {} # dict word, count
        self.total_words = 0
        self.path = path

        self.read_file(path)

    def read_file(self, path):
        with open(path, 'r') as file:
            for line in file:
                for word in line.split():
                    self.text[word] = self.text.get(word, 0) + 1
                    self.total_words += 1
    
    def get_probability(self, query):
        #break query into words
        words = query.split()
        probability = 1
        
        for i in range(len(words)):
            probability *= self.get_word_probability(words[i]) 
        return probability
    
    def get_word_probability(self, word):
        return self.text.get(word, 0)/self.total_words