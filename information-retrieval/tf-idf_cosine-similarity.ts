class Vector {

    components: number[];

    /**
     * Initialises the vector as a list of 0's of a defined size
     * 
     * @param num_values - the size of the vector
     */
    constructor(num_values: number) {
        this.components = new Array(num_values).fill(0);
    }

    /**
     * Returns the element from a given index
     * 
     * @param index - the index of the item being retrieved
     * @returns the value at that index
     */
    get_component(index: number): number {
        return this.components[index];
    }

    /**
     * Returns the size of the vector
     * 
     * @returns the length of the components array
     */
    get_length(): number {
        return this.components.length;
    }

    /**
     * Modifies the value of a given index
     * 
     * @param index - the index of the value being modified
     * @param value - the value being assigned to the particular index
     */
    set_component(index: number, value: number): void {
        this.components[index] = value;
    }

    /**
     * Returns the Euclidean Length of the vector
     * 
     * @returns the square root of the sum of the squared components
     */
    euclidean_length(): number {
        let run_sum = 0;
        this.components.forEach( (component) => {
            run_sum += component ** 2;
        });
        return run_sum ** 0.5;
    }

    /**
     * Increases the size of the vector and sets the respective values to 0
     * 
     * @param new_size - the number of elements the vector should contain 
     */
    add_zeros(new_size: number): void {
        let current_length = this.get_length();
        let num_new_zeros = new_size - current_length;
        this.components = this.components.concat(new Array(num_new_zeros).fill(0));
    }

}


/**
 * Calculates the term-frequency vector of a given document and maintains a running record of the word frequencies
 * 
 * @param d - the document
 * @param words_dict - dictionary keeping track of word frequencies
 * @returns the tf vector and the updated dictionary of words which have appeared   
 */
function tf(d: string, words_dict: Record<string, number> = {}): [Vector, Record<string, number>] {

 
    let words: string[];

    words = d.split(" ");

    words.forEach( (word: string) => {
        word = word.toLocaleLowerCase();
        if (words_dict[word]) {
            words_dict[word] += 1;
        } else {
            words_dict[word] = 1;
        }
    });

    let tf_vector = new Vector(Object.keys(words_dict).length);
    let i = 0;
    Object.keys(words_dict).forEach( (key) => {
        tf_vector.set_component(i, words_dict[key] / words.length);
        words_dict[key] = 0;
        i++;
    });

    return [tf_vector, words_dict];
    
}

/**
 * Calculates the inverse-document-frequency vector of a given list of documents
 * 
 * @param documents - list of documents
 * @returns the idf vector
 */
function idf(documents: Vector[]): Vector {

    
    const n = documents.length;

    let counts: number[] = [];

    const num_words = documents[0].get_length();

    for (let i = 0; i < num_words; i++) {
        let count = 0;
        documents.forEach( (d) => {
            if (d.get_component(i) > 0) {
                count++;
            }
        });
        counts.push(count);
    }

    let idf_v = new Vector(num_words);
    for (let i = 0; i < num_words; i++) {
        idf_v.set_component(i, Math.log10(n / counts[i]));
    }

    return idf_v;

}

/**
 * Calculates the tf-idf vector of a particular document within a set of documents
 * 
 * @param tf_v - the term frequency vector of the document
 * @param idf_v - the inverse document frequency vector of the list of documents
 * @returns the tf-idf vector
 */
function tf_idf(tf_v: Vector, idf_v: Vector): Vector {
    
    let num_words = tf_v.get_length();

    let tf_idf_vector = new Vector(num_words);

    for (let i = 0; i < num_words; i++) {
        tf_idf_vector.set_component(i, tf_v.get_component(i) * idf_v.get_component(i));
    }

    return tf_idf_vector;

}

/**
 * Returns the unit vector of a given vector
 * 
 * @param v - the vector
 * @returns the respective unit vector
 */
function get_unit_vector(v: Vector): Vector {
    
    const size = v.get_length();
    let unit_vector = new Vector(size);

    const euclidean_length = v.euclidean_length();

    for (let i = 0; i < size; i++) {
        unit_vector.set_component(i, v.get_component(i) / euclidean_length);
    }

    return unit_vector;

}

/**
 * Calculates the dot product of two vectors
 * 
 * @param v1 - the first vector
 * @param v2 - the second vector
 * @returns the dot product
 */
function dot_product(v1: Vector, v2: Vector): number {
    
    let prod = 0;

    for (let i = 0; i < v1.get_length(); i++) {
        prod += v1.get_component(i) * v2.get_component(i);
    }

    return prod;

 }

/**
 * Calculates the cosine similarity of two vectors
 * 
 * @param v1 - the first vector
 * @param v2 - the second vector
 * @returns the cosine similarity
 */ 
function cosine_similarity(v1: Vector, v2: Vector): number {

    return dot_product(get_unit_vector(v1), get_unit_vector(v2));

 }

 /**
 * Returns the cosine similarity of documents and a query based on tf-idf weighting 
 * 
 * @param corpus - list of the documents
 * @param query - the search query
 * @returns the cosine similarity of each of the documents to the query
 */
 function main(corpus: string[], query: string): number[] {

    let document_vectors: Vector[] = [];

    let [tf_query, running_words] = tf(query);
    document_vectors.push(tf_query);
    
    corpus.forEach( (document) => {
        let tf_document: Vector;
        [tf_document, running_words] = tf(document, running_words);
        document_vectors.push(tf_document);
    });
    
    let total_num_words = document_vectors[document_vectors.length - 1].get_length();
    
    document_vectors.forEach( (vector) => {
        if (vector.get_length() < total_num_words) {
            vector.add_zeros(total_num_words);
        }
    });
    
    let idf_vector = idf(document_vectors);
    
    let tf_idf_vectors: Vector[] = [];
    
    document_vectors.forEach( (vector) => {
        tf_idf_vectors.push(tf_idf(vector, idf_vector));
    });

    let output: number[] = []
    
    tf_idf_vectors.forEach( (vector) => {
        output.push(cosine_similarity(tf_idf_vectors[0], vector));
    });

    return output;

 }

debugger;
const d1 = "the best Italian restaurant enjoy the best pasta";
const d2 = "American restaurant enjoy the best hamburger";
const d3 = "Korean restaurant enjoy the best bibimbap";
const d4 = "the best the best American restaurant";

const corpus = [d1, d2, d3, d4];

let document_vectors: Vector[] = [];

const query = "american";

console.log(main(corpus, query));

// let [tf_query, running_words] = tf(query);
// document_vectors.push(tf_query);

// corpus.forEach( (document) => {
//     let tf_document: Vector;
//     [tf_document, running_words] = tf(document, running_words);
//     document_vectors.push(tf_document);
// });

// let total_num_words = document_vectors[document_vectors.length - 1].get_length();

// document_vectors.forEach( (vector) => {
//     if (vector.get_length() < total_num_words) {
//         vector.add_zeros(total_num_words);
//     }
// });

// let idf_vector = idf(document_vectors);

// let tf_idf_vectors: Vector[] = [];

// document_vectors.forEach( (vector) => {
//     tf_idf_vectors.push(tf_idf(vector, idf_vector));
// });

// tf_idf_vectors.forEach( (vector) => {
//     console.log(cosine_similarity(tf_idf_vectors[0], vector));
// });