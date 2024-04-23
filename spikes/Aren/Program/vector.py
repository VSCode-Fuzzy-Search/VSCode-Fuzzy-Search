import math


class Vector:
    """representation of a vector"""

    def __init__(self):
        self._vec = {}

    def get_weight(self, term: str) -> float:
        """gets the weight of a term in the vector

        Args:
            term (str): term to get the weight of

        Returns:
            float: weight of the term in the vector
        """
        return self._vec[term]

    def add_component(self, term: str, weight: float):
        """Adds a component to the vector.

        Args:
            term (str): term that the component corresponds to
            weight (float): weight of the component
        """
        self._vec[term] = weight

    def get_magnitude(self) -> float:
        """gets the magnitude of the vector (square root of the sum of the squares)

        Returns:
            float: magnitude of the vector
        """
        total = 0
        for weight in self._vec.values():
            total += weight**2
        return math.sqrt(total)

    def get_sim_score(self, other) -> float:
        """computes the similarity score between this and another vector

        Args:
            other (Vector): other vector to compute score with

        Returns:
            float: similarity score between this and another vector
        """
        score = 0
        # loop computes the dot product
        for term in self._vec.keys():
            if term in other:
                score += self.get_weight(term) * other.get_weight(term)

        # divide by the magnitudes of the vectors
        score = score / self.get_magnitude()
        score = score / other.get_magnitude()
        return score

    def __contains__(self, term: str):
        """overrides the contains method for the Vector class

        Args:
            term (str): term to be checked for

        Returns:
            _type_: true if the vector contains the term
        """
        return term in self._vec

    def __str__(self) -> str:
        """string representation of a vector

        Returns:
            str: representation of vector
        """
        text = "======="
        for term in self._vec:
            text += term + ": " + str(self.get_weight(term)) + "\n"
        text += "========"
        return text
