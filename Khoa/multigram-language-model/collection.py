import math
from document import Document
from model import MultigramLanguageModel


def extract_grams(raw: list[str], order: int) -> list[list[tuple[str]]]:
    # print(extract_grams(['1', '2', '3', '4'], 3))
    #[[('1',), ('2',), ('3',), ('4',)], [('1', '2'), ('2', '3'), ('3', '4')], [('1', '2', '3'), ('2', '3', '4')]]

    grams = []
    for k in range(1, order + 1):
        cur = list(zip(*[raw[i:] for i in range(k)]))
        grams.append(cur)
    
    return grams


class Collection:
    def __init__(self, paths: list[str], collection_weight: float, order: int, weights=list[int]):
        self.documents = []
        self.models = []
        self.weight = collection_weight
        
        cgrams = [[]] * order
        for path in paths:
            document = Document(path)
            grams = extract_grams(document.raw, order)
            
            # [[('1',), ('2',), ('3',), ('4',)], [('1', '2'), ('2', '3'), ('3', '4')], [('1', '2', '3'), ('2', '3', '4')]]
            # [[('a',), ('b',), ('c',), ('d',)], [('a', 'b'), ('b', 'c'), ('c', 'd')], [('a', 'b', 'c'), ('b', 'c', 'd')]]
            # [[1, 2, 3, 4, a, b, c, d],
            # [12, 23, 34, ab, bc, cd],
            # [123, 234, abc, bcd]] 
            for i in range(order):
                cgrams[i].extend(grams[i])
            
            self.documents.append(document)
            self.models.append(MultigramLanguageModel(grams, weights))
        
        self.collection_model = MultigramLanguageModel(cgrams, weights)

    def search_collection(self, query):
        #get probability of query in each document
        probabilities = {}

        collection_log_probability = self.collection_model.get_log_probability(query)
        for document, model in zip(self.documents, self.models):
            # linear interpolation
            # advantage of the left formula is to give some probability of sharing vocabulary between different documents 
            # even if the given word not present in one document but in the other then the probability > 0
            probabilities[document.path] = self.weight * math.e ** collection_log_probability + (1 - self.weight) * math.e ** model.get_log_probability(query)
        
        return probabilities
    