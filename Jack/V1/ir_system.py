from model import BooleanModel
from node import Node
import collections
import re

class IRSystem():
    def __init__(self, docs, stop_words=[]):
        self.docs = docs
        self.stop_words = stop_words
        self.inverted_index = self.preprocess(stop_words)
        # 2self._print_inverted_index()

    
    def preprocess(self, stop_words):
        """
        Preprocess the documents
        """
        index = {}
        for i, doc in enumerate(self.docs, start=1):
            for word in re.findall(r"[\w']+", doc):
                print(f'word: {word}, doc_id: {i}')
                try:
                    index[word].insert(i)
                except KeyError:
                    index[word] = Node(i)
        return index
    
    
    
    def _print_inverted_index(self):
        print('INVERTED INDEX:\n')
        for word, tree in self.inverted_index.items():
            print('{}: {}'.format(word, [doc_id for doc_id in tree.tree_data() if doc_id != None]))
        print()

    def _get_posting_list(self, word):
        return [doc_id for doc_id in self.inverted_index[word].tree_data()]
    
    def _parse_query(self, infix_tokens):
        """ Parse Query 
        Parsing done using Shunting Yard Algorithm 
        """
        precedence = {}
        precedence['NOT'] = 3
        precedence['AND'] = 2
        precedence['OR'] = 1
        precedence['('] = 0
        precedence[')'] = 0    

        output = []
        operator_stack = []

        for token in infix_tokens:
            if (token == '('):
                operator_stack.append(token)
            
            # if right bracket, pop all operators from operator stack onto output until we hit left bracket
            elif (token == ')'):
                operator = operator_stack.pop()
                while operator != '(':
                    output.append(operator)
                    operator = operator_stack.pop()
            
            # if operator, pop operators from operator stack to queue if they are of higher precedence
            elif (token in precedence):
                # if operator stack is not empty
                if (operator_stack):
                    current_operator = operator_stack[-1]
                    while (operator_stack and precedence[current_operator] > precedence[token]):
                        output.append(operator_stack.pop())
                        if (operator_stack):
                            current_operator = operator_stack[-1]
                operator_stack.append(token) # add token to stack
            else:
                output.append(token.lower())

        # while there are still operators on the stack, pop them into the queue
        while (operator_stack):
            output.append(operator_stack.pop())

        return output
    
    def process_query(self, query):

        indexed_docIDs = list(range(1, len(self.docs) + 1))

        results_stack = []
        postfix_queue = collections.deque(self._parse_query(query)) # get query in postfix notation as a queue

        while postfix_queue:
            token = postfix_queue.popleft()
            if token == 'AND':
                right_op = results_stack.pop()
                left_op = results_stack.pop()
                results_stack.append(BooleanModel.and_op(left_op, right_op))
            elif token == 'OR':
                right_op = results_stack.pop()
                left_op = results_stack.pop()
                results_stack.append(BooleanModel.or_op(left_op, right_op))
            elif token == 'NOT':
                right_op = results_stack.pop()
                results_stack.append(BooleanModel.not_op(right_op, indexed_docIDs))
            else:
                try:
                    results_stack.append(self._get_posting_list(token))
                except KeyError:
                    results_stack.append([])


        if results_stack.pop == []:
            raise ValueError('One or more terms not present in any document.')
        
        return results_stack.pop()
