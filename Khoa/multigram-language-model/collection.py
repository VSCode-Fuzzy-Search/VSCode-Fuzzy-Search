from document import Document
from model import MultigramLanguageModel


def extract_grams(raw: list[str], order: int) -> list[list[tuple[str]]]:
    grams = []
    for k in range(1, order + 1):
        cur = list(zip(*[raw[i:] for i in range(k)]))
        grams.append(cur)
    
    return grams


class Collection:
    def __init__(self, paths: list[str], collection_weight: float, order: int):
        self.documents = []
        self.models = []
        self.weight = collection_weight
        
        cgrams = [[]] * order
        for path in paths:
            document = Document(path)
            grams = extract_grams(document.raw, order)
            for i in range(order):
                cgrams[i].extend(grams[i])
            
            self.documents.append(document)
            self.models.append(MultigramLanguageModel(grams))
        
        self.collection_model = MultigramLanguageModel(cgrams)

    def search_collection(self, query):
        #get probability of query in each document
        probabilities = {}

        collection_probability = self.collection_model.get_probability(query)
        for document, model in zip(self.documents, self.models):
            # linear interpolation
            probabilities[document.path] = self.weight * collection_probability + (1 - self.weight) * model.get_probability(query)
        
        return probabilities
    