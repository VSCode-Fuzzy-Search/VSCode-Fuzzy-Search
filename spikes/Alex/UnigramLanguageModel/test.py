from file import File
from collection import Collection

#file_path = '../Files/File1.txt'
collection = Collection()


#loop through all files in ../Files folder
for i in range(1, 4):
    file_path = f'Alex/Files/File{i}.txt'
    file = File(file_path)
    collection.add_file(file)


while True:
    query = input('Enter query: ')
    if query == 'exit':
        break
    collection.search_collection(query)
