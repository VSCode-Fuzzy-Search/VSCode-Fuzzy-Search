import unittest
from search import get_files
from system import IRSystem

class TestAnd(unittest.TestCase):
    def __init__(self, methodName):
        super().__init__(methodName)
        self.dir_path = "Jack/documents"
        self.docs = get_files(self.dir_path)
        self.ir = IRSystem(self.docs)

    def test_single_and(self):
        query = "for AND range"
        self.assertEqual(self.ir.process(query), [1])

    def test_double_and(self):
        query = "while AND i AND print"
        self.assertEqual(self.ir.process(query), [2])

    def test_triple_and(self):
        query = "for AND i AND in AND print"
        self.assertEqual(self.ir.process(query), [1])

    def test_single_and_brackets(self):
        query = "(for AND range)"
        self.assertEqual(self.ir.process(query), [1])
    
    def test_double_and_brackets(self):
        query = "(while AND i) AND (print AND i)"
        self.assertEqual(self.ir.process(query), [2])



if __name__=='__main__':
	unittest.main()