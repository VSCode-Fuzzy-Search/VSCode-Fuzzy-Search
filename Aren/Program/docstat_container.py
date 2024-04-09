from document import Document


class DocstatContainer:
    """contains a map of document to its stats (like tf)"""

    def __init__(self):
        self._doc_map = {}

    def add_stats(self, document: Document, tf: int) -> None:
        """adds the dodument's stats to the mapping of documents containing the term

        Args:
            document (Document): document for the stats
            tf (int): term frequency (tf)
        """
        self._doc_map[document] = tf

    def get_tf(self, document: Document) -> int:
        """gets the term frequecy of the term in the specified document

        Args:
            document (Document): document to check term frequency for

        Returns:
            int: term frequency
        """
        if document not in self:
            return 0
        return self._doc_map[document]

    def __contains__(self, document: Document) -> bool:
        """magic method for checking if the map contains the document

        Args:
            document (Document): document to check for

        Returns:
            bool: true if the document is in the map
        """
        return document in self._doc_map

    def __len__(self) -> int:
        """gets the number of documents containing the word

        Returns:
            int: number of documents containing the word
        """
        return len(self._doc_map.keys())
