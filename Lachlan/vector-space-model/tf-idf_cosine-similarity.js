var Vector = /** @class */ (function () {
    function Vector(num_rows) {
        this.components = new Array(num_rows).fill(0);
    }
    Vector.prototype.get_component = function (index) {
        return this.components[index];
    };
    Vector.prototype.get_length = function () {
        return this.components.length;
    };
    Vector.prototype.set_component = function (index, value) {
        this.components[index] = value;
    };
    Vector.prototype.euclidean_length = function () {
        var run_sum = 0;
        this.components.forEach(function (component) {
            run_sum += Math.pow(component, 2);
        });
        return Math.pow(run_sum, 0.5);
    };
    Vector.prototype.add_zeros = function (new_size) {
        var current_length = this.get_length();
        var num_new_zeros = new_size - current_length;
        this.components = this.components.concat(new Array(num_new_zeros).fill(0));
    };
    return Vector;
}());
function tf(d, words_dict) {
    if (words_dict === void 0) { words_dict = {}; }
    var words;
    words = d.split(" ");
    words.forEach(function (word) {
        word = word.toLocaleLowerCase();
        if (words_dict[word]) {
            words_dict[word] += 1;
        }
        else {
            words_dict[word] = 1;
        }
    });
    var tf_vector = new Vector(Object.keys(words_dict).length);
    var i = 0;
    Object.keys(words_dict).forEach(function (key) {
        tf_vector.set_component(i, words_dict[key] / words.length);
        words_dict[key] = 0;
        i++;
    });
    return [tf_vector, words_dict];
}
function idf(documents) {
    var n = documents.length;
    var counts = [];
    var num_words = documents[0].get_length();
    var _loop_1 = function (i) {
        var count = 0;
        documents.forEach(function (d) {
            if (d.get_component(i) > 0) {
                count++;
            }
        });
        counts.push(count);
    };
    for (var i = 0; i < num_words; i++) {
        _loop_1(i);
    }
    var idf_v = new Vector(num_words);
    for (var i = 0; i < num_words; i++) {
        idf_v.set_component(i, Math.log10(n / counts[i]));
    }
    return idf_v;
}
function tf_idf(tf_v, idf_v) {
    var num_words = tf_v.get_length();
    var tf_idf_vector = new Vector(num_words);
    for (var i = 0; i < num_words; i++) {
        tf_idf_vector.set_component(i, tf_v.get_component(i) * idf_v.get_component(i));
    }
    return tf_idf_vector;
}
function get_unit_vector(v) {
    var size = v.get_length();
    var unit_vector = new Vector(size);
    var euclidean_length = v.euclidean_length();
    for (var i = 0; i < size; i++) {
        unit_vector.set_component(i, v.get_component(i) / euclidean_length);
    }
    return unit_vector;
}
function dot_product(v1, v2) {
    var prod = 0;
    for (var i = 0; i < v1.get_length(); i++) {
        prod += v1.get_component(i) * v2.get_component(i);
    }
    return prod;
}
function cosine_similarity(v1, v2) {
    return dot_product(get_unit_vector(v1), get_unit_vector(v2));
}
debugger;
var d1 = "the best Italian restaurant enjoy the best pasta";
var d2 = "American restaurant enjoy the best hamburger";
var d3 = "Korean restaurant enjoy the best bibimbap";
var d4 = "the best the best American restaurant";
var corpus = [d1, d2, d3, d4];
var document_vectors = [];
var query = "american";
var _a = tf(query), tf_query = _a[0], running_words = _a[1];
document_vectors.push(tf_query);
corpus.forEach(function (document) {
    var _a;
    var tf_document;
    _a = tf(document, running_words), tf_document = _a[0], running_words = _a[1];
    document_vectors.push(tf_document);
});
var total_num_words = document_vectors[document_vectors.length - 1].get_length();
document_vectors.forEach(function (vector) {
    if (vector.get_length() < total_num_words) {
        vector.add_zeros(total_num_words);
    }
});
var idf_vector = idf(document_vectors);
var tf_idf_vectors = [];
document_vectors.forEach(function (vector) {
    tf_idf_vectors.push(tf_idf(vector, idf_vector));
});
tf_idf_vectors.forEach(function (vector) {
    console.log(cosine_similarity(tf_idf_vectors[0], vector));
});
