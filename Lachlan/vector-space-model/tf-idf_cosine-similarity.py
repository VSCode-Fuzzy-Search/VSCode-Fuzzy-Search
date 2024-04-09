from typing import List
from classes.vector import Vector
import math


def tf(d: str, words_dict=None) -> [Vector, dict]:

    if words_dict is None:
        words_dict = dict()

    words = d.split(" ")

    for word in words:
        word = word.lower()
        if word not in words_dict:
            words_dict[word] = 1
        else:
            words_dict[word] += 1

    tf_vector = Vector(len(words_dict.keys()))
    i = 0
    for key in words_dict.keys():
        tf_vector.set_component(i, words_dict[key]/len(words))
        words_dict[key] = 0
        i += 1

    return tf_vector, words_dict


def idf(documents: List[Vector]) -> Vector:

    n = len(documents)

    counts = []

    num_words = documents[0].get_length()

    for i in range(num_words):
        count = 0
        for d in documents:
            if d.get_component(i) > 0:
                count += 1
        counts.append(count)

    idf_v = Vector(num_words)
    for i in range(num_words):
        idf_v.set_component(i, math.log((n/counts[i]), 10))

    return idf_v


def tf_idf(tf_v: Vector, idf_v: Vector) -> Vector:

    num_words = tf_v.get_length()

    tf_idf_vector = Vector(num_words)

    for i in range(num_words):
        tf_idf_vector.set_component(i, tf_v.get_component(i)*idf_v.get_component(i))

    return tf_idf_vector


def create_vector_list() -> List[Vector]:
    return []


def get_unit_vector(v: Vector) -> Vector:

    size = v.get_length()
    unit_vector = Vector(size)

    euclidean_length = v.euclidean_length()

    for i in range(size):
        unit_vector.set_component(i, v.get_component(i)/euclidean_length)

    return unit_vector


def dot_product(v1: Vector, v2: Vector) -> float:

    prod = 0.0

    for i in range(v1.get_length()):
        prod += v1.get_component(i) * v2.get_component(i)

    return prod


def cosine_similarity(v1: Vector, v2: Vector) -> float:

    return dot_product(get_unit_vector(v1), get_unit_vector(v2))


if __name__ == "__main__":
    d1 = "the best Italian restaurant enjoy the best pasta"
    d2 = "American restaurant enjoy the best hamburger"
    d3 = "Korean restaurant enjoy the best bibimbap"
    d4 = "the best the best American restaurant"

    corpus = [d1, d2, d3, d4]

    document_vectors = create_vector_list()

    query = "american"
    tf_query, running_words = tf(query)
    document_vectors.append(tf_query)

    for document in corpus:
        tf_document, running_words = tf(document, running_words)
        document_vectors.append(tf_document)

    total_num_words = document_vectors[len(document_vectors) - 1].get_length()

    for vector in document_vectors:
        if vector.get_length() < total_num_words:
            vector.add_zeros(total_num_words)

    idf_vector = idf(document_vectors)

    tf_idf_vectors = create_vector_list()

    for vector in document_vectors:
        tf_idf_vectors.append(tf_idf(vector, idf_vector))

    for vector in tf_idf_vectors:
        print(cosine_similarity(tf_idf_vectors[0], vector))

    #     files = ["houn.txt",
    #              "sign.txt",
    #              "stud.txt",
    #              "vall.txt"]
    #
    #     for file in files: ...
