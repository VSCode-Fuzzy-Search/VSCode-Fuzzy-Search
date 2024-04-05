import os
from system import IRSystem

dir_path = "Jack/documents"

def sort_file_dir(folder_path):
    items= os.listdir(folder_path)
    items.sort()
    return items

def get_files(folder_path):
    items = sort_file_dir(folder_path)
    docs = []
    for item in items:
        file_path = os.path.join(folder_path, item)
        if os.path.isfile(file_path):
            with open(file_path, 'r') as f:
                docs.append(f.read())
    return docs


def main():
    docs = get_files(dir_path)
    ir = IRSystem(docs)
    ir.print_inverted_index()

    while True:
        query = input('Enter boolean query: ')

        results = ir.process(query)
        if results is not None:
            print('\nDoc IDS: ')
            print(results)
        print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt as e:
        print('EXIT')