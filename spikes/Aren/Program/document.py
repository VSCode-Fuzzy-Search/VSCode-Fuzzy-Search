class Document:
    """A document with a body of text

    Note: id is not necessarily unique. This class doesn't check for this.
    """

    def __init__(self, body: str, id: int):
        """Constructor

        Args:
            body (str): the body of text
        """
        self._body = body
        self._id = id

    def get_body(self) -> str:
        """gets the body of text in the document

        Returns:
            str: body of text in the document
        """
        return self._body

    def get_id(self) -> int:
        """returns id of the document

        Returns:
            int: id of the document
        """
        return self._id
