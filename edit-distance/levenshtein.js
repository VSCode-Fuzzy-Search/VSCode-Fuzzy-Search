"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
/**
 * Returns the edit distance between two strings using the Levenhstein algorithm
 *
 * @param str1 - the first string
 * @param str2 - the second string
 * @returns the bottom right element from the calculated table
 */
function levenshtein_edit_distance(str1, str2) {
    str1 = " " + str1;
    str2 = " " + str2;
    var table = new Array(str2.length);
    for (var i = 0; i < str2.length; i++) {
        table[i] = new Array(str1.length);
    }
    table[0][0] = 0;
    for (var i = 1; i < str1.length; i++) {
        table[0][i] = i;
    }
    for (var j = 1; j < str2.length; j++) {
        table[j][0] = j;
    }
    for (var i = 1; i < str1.length; i++) {
        for (var j = 1; j < str2.length; j++) {
            var minimum = Math.min(table[j][i - 1], table[j - 1][i], table[j - 1][i - 1]);
            if (str1[i] == str2[j] && i == j) {
                table[j][i] = minimum;
            }
            else {
                table[j][i] = minimum + 1;
            }
        }
    }
    return table[str2.length - 1][str1.length - 1];
}
/**
 * Returns the 10 closest edit-distance strings from a word list to a query
 *
 * @param query - the string to be compared against word_list
 * @param word_list - list of words
 * @returns a list of strings
 */
function find_closest(query, word_list) {
    var num_results = 10;
    var distances = word_list.map(function (word) { return ({
        word: word,
        distance: levenshtein_edit_distance(query, word)
    }); });
    distances.sort(function (a, b) { return a.distance - b.distance; });
    return distances.slice(0, num_results).map(function (item) { return "".concat(item.word, " (edit distance = ").concat(item.distance, ")"); });
}
function main() {
    var word_list = fs.readFileSync('wordlist-10000.txt', 'utf-8').split('\n').map(function (word) { return word.trim(); });
    var query = 'absetn';
    var closestWords = find_closest(query, word_list);
    console.log("Closest words to ".concat(query, ":"));
    for (var i = 0; i < closestWords.length; i++) {
        console.log(closestWords[i]);
    }
}
main();
