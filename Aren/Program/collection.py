import re
import math
from document import Document
from vector import Vector
from docstat_container import DocstatContainer


class Collection:
    """class defining the collection"""

    def __init__(self):
        """Constructor"""
        ## for every item in the sample value, add to index.
        self._index = {}
        self._document_counter = 0

    def add_document_to_index(self, doc: Document) -> None:
        """adds a document into the collection's inverted index

        Args:
            doc (Document): the document to be added.
        """
        # Remove whitespaces, punctuation and create list of all words in doc.
        punctuationless = re.sub(r"[.,\/#!$%\^&\*;:{}=\-_`~()]", "", doc.get_body())
        final_string = re.sub(r"\s{2,}", " ", punctuationless)
        document_array = final_string.split()

        # Build a temporary index containing the term frequency of all terms in this document.
        temp_index = {}
        for term in document_array:
            if term in temp_index:
                temp_index[term] += 1
            else:
                temp_index[term] = 1

        # add all data to the main inverted index
        for doc_term in temp_index.keys():
            if doc_term in self._index:
                self._index[doc_term].add_stats(doc, temp_index[doc_term])
            else:
                self._index[doc_term] = DocstatContainer()
                self._index[doc_term].add_stats(doc, temp_index[doc_term])

        self._increment_docs()

    def _increment_docs(self) -> None:
        """increments the number of documents by 1"""
        self._document_counter += 1

    def get_df(self, term: str) -> int:
        """finds the document frequency (df) of a term in the collection

        Args:
            term (str): term to search for

        Raises:
            ValueError: when the term is not in the collection

        Returns:
            int: document frequency of a term in the collection
        """
        if term in self:
            return len(self._index[term])

        else:
            raise ValueError(term + " does not appear in the collection")

    def get_idf(self, term: str) -> float:
        """gets the inverse document frequency (idf) of a term

        Args:
            term (str): term being searched

        Returns:
            float: idf of the term
        """
        try:
            return math.log(self._document_counter / float(self.get_df(term)), 10)
        except ValueError as e:
            print("An error occured: ", e)

    def get_tf(self, term: str, document: Document) -> int:
        """finds the term frequency (tf) of a term in a document

        Args:
            term (str): term to search the collection for
            document (Document): document the term frequency is being checked for

        Raises:
            ValueError: if the term is not in the collection
            ValueError: if an existing term is not found in the specified document

        Returns:
            int: term frequency (tf) of a term in a document
        """
        if not term in self:
            raise ValueError(term + " is not in the collection")
        if document in self._index[term]:
            return self._index[term].get_tf(document)
        raise ValueError("the document doesn't contain the term")

    def get_tfidf(self, term: str, document: Document) -> float:
        """gets the tf-idf weighting of the term for a given document

        Args:
            term (str): term being queried
            document (Document): document to search for

        Returns:
            float: tf-idf weighting of the term in the document vector
        """
        try:
            return self.get_tf(term, document) * self.get_idf(term)
        except ValueError as e:
            print("An error occured: ", e)

    def get_vector(self, document: Document) -> Vector:
        """gets vector of a document

        Args:
            document (Document): document to represent as a vector

        Returns:
            Vector: vector of a document
        """
        temp_vec = []
        for term in self._index.keys():
            if document in self._index[term]:
                temp_vec.append((term, self.get_tfidf(term, document)))
        v = Vector()
        for component in temp_vec:
            v.add_component(component[0], component[1])
        return v

    def __contains__(self, term: str) -> bool:
        """magic method for whether this collection contains a term

        Args:
            term (str): term to be checked for

        Returns:
            bool: true if the term is in the collection
        """
        return term in self._index
