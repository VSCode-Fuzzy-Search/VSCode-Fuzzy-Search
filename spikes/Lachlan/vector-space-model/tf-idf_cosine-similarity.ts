class Vector {

    components: number[];

    constructor(num_rows: number) {
        this.components = new Array(num_rows).fill(0);
    }

    get_component(index: number): number {
        return this.components[index];
    }

    get_length(): number {
        return this.components.length;
    }

    set_component(index: number, value: number): void {
        this.components[index] = value;
    }

    euclidean_length(): number {
        let run_sum = 0;
        this.components.forEach( (component) => {
            run_sum += component ** 2;
        });
        return run_sum ** 0.5;
    }

    add_zeros(new_size: number): void {
        let current_length = this.get_length();
        let num_new_zeros = new_size - current_length;
        this.components = this.components.concat(new Array(num_new_zeros).fill(0));
    }

}

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

function tf_idf(tf_v: Vector, idf_v: Vector): Vector {
    
    let num_words = tf_v.get_length();

    let tf_idf_vector = new Vector(num_words);

    for (let i = 0; i < num_words; i++) {
        tf_idf_vector.set_component(i, tf_v.get_component(i) * idf_v.get_component(i));
    }

    return tf_idf_vector;

}

function get_unit_vector(v: Vector): Vector {
    
    const size = v.get_length();
    let unit_vector = new Vector(size);

    const euclidean_length = v.euclidean_length();

    for (let i = 0; i < size; i++) {
        unit_vector.set_component(i, v.get_component(i) / euclidean_length);
    }

    return unit_vector;

}

function dot_product(v1: Vector, v2: Vector): number {
    let prod = 0;

    for (let i = 0; i < v1.get_length(); i++) {
        prod += v1.get_component(i) * v2.get_component(i);
    }

    return prod;

 }

 function cosine_similarity(v1: Vector, v2: Vector): number {

    return dot_product(get_unit_vector(v1), get_unit_vector(v2));

 }

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