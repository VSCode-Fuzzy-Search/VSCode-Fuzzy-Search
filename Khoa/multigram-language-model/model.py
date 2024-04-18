import math

EPSILON = 10 ** -16

class MultigramLanguageModel:
    def __init__(self, grams: list[list[tuple[str]]], weights: list[int]):
        # grams[n - 1] = list of n-grams
        # grams[0] = list of unigrams
        # grams[1] = list of bigrams
        # ...

        # [[1, 2, 3, 4, a, b, c, d],
        # [12, 23, 34, ab, bc, cd],
        # [123, 234, abc, bcd]] 

        self.count = {} # dict gram, count
        self.order = len(grams)
        self.weights = weights # ex: [0.2, 0.3, 0.5] for 3-order
        
        # count of empty string will serve as the length of the document
        self.count[""] = len(grams[0])
        for gs in grams:
            for g in gs:
                self.count[" ".join(g)] = self.count.get(" ".join(g), 0) + 1

    def get_log_probability(self, query):
        #break query into words
        words = query.split()
        log_probability = 0
        
        gram = []
        for word in words:
            gram.append(word)
            # remove redundant word at the beginning P(xyzt)=P(x)P(y|x)P(z|xy)P(t|yz)
            # a -> ab -> abc -> bcd -> cde
            gram = gram[-self.order:]
            p = 0
            # ["want" , "to", "sleep" , "and"]
            for i in range(len(gram)): # len of weight
                p += self.weights[i] * self.get_gram_probability(gram[-(i + 1):])
            log_probability += math.log(p + EPSILON)
        return log_probability
    
    def get_gram_probability(self, gram: list[str]):
        # when gram is unigram, this will be count[gram] / count[""]
        # so we set count[""] equal to the length of the document
        # [the, ball , is]
        # the ball is / the ball
        return self.count.get(" ".join(gram), 0) / self.count.get(" ".join(gram[:-1]), 1)

# https://www.youtube.com/watch?v=JpOZqXsop3Q&list=PLaZQkZp6WhWwJllbfwOD9cbIHXmdkOICY&index=6