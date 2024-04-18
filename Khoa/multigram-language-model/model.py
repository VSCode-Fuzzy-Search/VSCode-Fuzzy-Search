class MultigramLanguageModel:
    def __init__(self, grams: list[list[tuple[str]]]):
        # grams[n - 1] = list of n-grams
        # grams[0] = list of unigrams
        # grams[1] = list of bigrams
        # ...

        self.count = {} # dict gram, count
        self.order = len(grams)
        
        # count of empty string will serve as the length of the document
        self.count[""] = len(grams[0])
        for gs in grams:
            for g in gs:
                self.count[" ".join(g)] = self.count.get(" ".join(g), 0) + 1

    def get_probability(self, query):
        #break query into words
        words = query.split()
        probability = 1
        
        gram = []
        for word in words:
            gram.append(word)
            # remove redundant word at the beginning
            gram = gram[-self.order:]
            probability *= self.get_gram_probability(gram)
        return probability
    
    def get_gram_probability(self, gram: list[str]):
        # when gram is unigram, this will be count[gram] / count[""]
        # so we set count[""] equal to the length of the document
        return self.count.get(" ".join(gram), 0) / self.count.get(" ".join(gram[:-1]), 1)