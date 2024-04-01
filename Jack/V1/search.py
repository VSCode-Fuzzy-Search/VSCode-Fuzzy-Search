import argparse
import timeit

from ir_system import IRSystem
import os

docs = []
folder_path = "Jack/documents"

def sort_file_dir(folder_path):
    items= os.listdir(folder_path)
    items.sort()
    print(f'items: {items}')
    return items

def get_files(folder_path):
    items = sort_file_dir(folder_path)
    docs = []
    for item in items:
        file_path = os.path.join(folder_path, item)
        if os.path.isfile(file_path):
            with open(file_path, 'r') as f:
                docs.append(f.read())
    print(docs)
    return docs

def main():
    docs = get_files(folder_path)
    ir = IRSystem(docs)
    ir._print_inverted_index()

    while True:
        query = input('Enter boolean query: ')

        start = timeit.default_timer()
        results = ir.process_query(query)
        stop = timeit.default_timer()
        if results is not None:
            print ('Processing time: {:.5} secs'.format(stop - start))
            print('\nDoc IDS: ')
            print(results)
        print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt as e:
        print('EXIT')



### https://github.com/pskrunner14/info-retrieval