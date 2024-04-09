from collection import Collection
from document import Document
from vector import Vector

doc_text1 = "Nearly all butterflies are diurnal, have relatively bright colours, and hold their wings vertically above their bodies when at rest, unlike the majority of moths which fly by night are often cryptically coloured (well camouflaged), and either hold their wings flat (touching the surface on which the moth is standing) or fold them closely over their bodies. Some day-flying moths, such as the hummingbird hawk-moth,[19] are exceptions to these rules."
doc_text2 = "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined, and slightly less than one one-thousandth the mass of the Sun. Jupiter orbits the Sun at a distance of 5.20 AU (778.5 Gm) with an orbital period of 11.86 years. Jupiter is the third brightest natural object in the Earth's night sky after the Moon and Venus, and it has been observed since prehistoric times. It was named after Jupiter, the chief deity of ancient Roman religion."
doc_text3 = "Three Scuderia Ferrari cars in 1934, all Alfa Romeo P3s. Drivers, left to right: Achille Varzi, Louis Chiron, and Carlo Felice Trossi. Enzo Ferrari, formerly a salesman and racing driver for Alfa Romeo, founded Scuderia Ferrari, a racing team, in 1929. Originally intended to service gentleman drivers and other amateur racers, Alfa Romeo's withdrawal from racing in 1933, combined with Enzo's connections within the company, turned Scuderia Ferrari into its unofficial representative on the track.[10] Alfa Romeo supplied racing cars to Ferrari, who eventually amassed some of the best drivers of the 1930s and won many races before the team's liquidation in 1937"


def run():
    """Function to run the app"""
    ## adding the documents to the collection
    c = Collection()
    doc1 = Document(doc_text1, 1)
    doc2 = Document(doc_text2, 2)
    doc3 = Document(doc_text3, 3)
    c.add_document_to_index(doc1)
    c.add_document_to_index(doc2)
    c.add_document_to_index(doc3)
    # print(c.get_vector(doc1))

    # # testing for whether tf idf all work
    # c.print_index()
    # search_term = "other"
    # search_doc = doc3
    # print("df= " + str(c.get_df(search_term)))
    # print("tf= " + str(c.get_tf(search_term, doc2)))
    # print("idf= " + str(c.get_idf(search_term)))
    # print("tfidf= " + str(c.get_tfidf(search_term, doc2)))

    terminating = False
    while not terminating:
        user_input = input(
            "Type the phrase you're searching for or enter empty string to exit: "
        )
        # FIXME: doesn't do anything for multiple words. Only works with single words.
        if user_input == "":  # terminates the loop
            terminating = True
            continue

        # TODO: take queries and rank scores.
        query_vec = Vector()
        query_vec.add_component(user_input, 1.0)
        print("doc1 score: ", query_vec.get_sim_score(c.get_vector(doc1)))
        print("doc2 score: ", query_vec.get_sim_score(c.get_vector(doc2)))
        print("doc3 score: ", query_vec.get_sim_score(c.get_vector(doc3)))


if __name__ == "__main__":
    run()
