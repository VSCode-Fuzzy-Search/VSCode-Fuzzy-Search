import argparse
import timeit

from ir_system import IRSystem
import os

docs = []
folder_path = "Jack/documents"

for filename in os.listdir(folder_path):
    file_path = os.path.join(folder_path, filename)
    if os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            doc = file.read()
            docs.append(doc)


def parse_args():
    parser = argparse.ArgumentParser(description='Information Retrieval System Configuration')
    return parser.parse_args()

def main():
    args = parse_args()
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