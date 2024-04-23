from model import BooleanSearchModel
from node import Node
import collections
import re

class IRSystem():
    def __init__(self, docs) -> None:
        self.docs = docs
        self.inverted_index = self.preprocess()

    def preprocess(self):
        index = {}
        for i, doc in enumerate(self.docs, start=1):
            ### Currently splitting words with Regex on non-alphanumeric characters
            for word in re.findall(r"[\w']+", doc):
                try:
                    index[word].insert(i)
                except KeyError:
                    index[word] = Node(i)
        return index
    
    def print_inverted_index(self):
        print('INVERTED INDEX:\n')
        for word, tree in self.inverted_index.items():
            print('{}: {}'.format(word, [doc_id for doc_id in tree.tree_data() if doc_id != None]))
        print()

    def get_posting_list(self, word):
        return [doc_id for doc_id in self.inverted_index[word].tree_data() if doc_id != None]
    
    def parse(self, query):
        precedence = {}
        precedence['*'] = 4
        precedence['NOT'] = 3
        precedence['AND'] = 2
        precedence['OR'] = 1
        precedence['('] = 0
        precedence[')'] = 0

        output = []
        operator_stack = []


        for token in query:
            if (token == '('):
                operator_stack.append(token)
            
            # if right bracket, pop all operators from operator stack onto output until we hit left bracket
            elif (token == ')'):
                operator = operator_stack.pop()
                while operator != '(':
                    output.append(operator)
                    operator = operator_stack.pop()
            
            # if operator, pop operators from operator stack to queue if they have higher precedence
            elif token in precedence:
                while operator_stack and precedence[operator_stack[-1]] >= precedence[token]:
                    output.append(operator_stack.pop())
                operator_stack.append(token)
            
            # if operand, add to output
            else:
                output.append(token)


        while operator_stack:
            output.append(operator_stack.pop())

        return output
    

    def process(self, query):
        query = query.replace('(', '( ')
        query = query.replace(')', ' )')
        query = query.replace('*', ' * ')
        query = query.split(' ')

        docIDs = list(range(1, len(self.docs)+1))

        results = []
        queue = collections.deque(self.parse(query))
        

        while queue:
            token = queue.popleft()
            result = []
            if token != 'AND' and token != 'OR' and token != 'NOT' and token != '*':
                if token in self.inverted_index:
                    result = self.get_posting_list(token)
            elif token == 'AND':
                right = results.pop()
                left = results.pop()
                result = BooleanSearchModel.AND(left, right)
            elif token == 'OR':
                right = results.pop()
                left = results.pop()
                result = BooleanSearchModel.OR(left, right)
            elif token == 'NOT':
                right = results.pop()
                result = BooleanSearchModel.ANDNOT(right, docIDs)
            elif token == '*':
                left = results.pop()
                result = BooleanSearchModel.WILDCARD(left, docIDs)
            results.append(result)

        return results.pop()