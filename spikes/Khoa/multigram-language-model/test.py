from collection import Collection

file_paths = [f'./files/{i}.txt' for i in range(2)]
order = 3
weights = [0.2, 0.3, 0.5]
collection = Collection(file_paths, 0.5, order, weights)

def print_probabilities(probabilities):
    for document, probability in probabilities.items():
        print(f'Probability of query in {document} is {probability}')

while True:
    query = input('Enter query: ')
    if query == 'exit':
        break
    probabilities = collection.search_collection(query)
    print_probabilities(probabilities)