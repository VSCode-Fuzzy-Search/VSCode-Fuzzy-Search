"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var damerau_levenshtein_1 = require("./damerau-levenshtein");
var levenshtein_1 = require("./levenshtein");
var fs = require("fs");
/**
 * Takes a filepath to a list of words and converts it to a list of words
 *
 * @param filepath - string detailing filepath to words list
 * @returns list of words
 */
function getWords(filepath) {
    return fs.readFileSync(filepath, 'utf-8').split('\n').map(function (word) { return word.trim(); });
}
/**
 * Determines the most similar words in a wordlist to a query based on some edit-distance threshold
 *
 * @param query - source word
 * @param wordlist - list of words
 * @returns list of similar words
 */
function getSimilarWords(query, wordlist, algorithm) {
    var EDIT_DISTANCE_THRESHOLD = 3;
    var similarWords = [];
    for (var i = 0; i < wordlist.length; i++) {
        if (chooseAlgorithm(query, wordList[i], algorithm) < EDIT_DISTANCE_THRESHOLD) {
            similarWords.push(wordlist[i]);
        }
    }
    return similarWords;
}
function chooseAlgorithm(source, target, algorithm) {
    if (algorithm == "L") {
        return (0, levenshtein_1.levenshtein)(source, target);
    }
    else if (algorithm == "DL") {
        return (0, damerau_levenshtein_1.damerau_levenshtein)(source, target);
    }
    return -1;
}
/**
 * Returns the N closest edit-distance strings from a word list to a query
 *
 * @param query - the string to be compared against word_list
 * @param word_list - list of words
 * @returns a list of strings
 */
function find_closest(query, word_list, num_results) {
    var distances = word_list.map(function (word) { return ({
        word: word,
        distance: (0, levenshtein_1.levenshtein)(query, word)
    }); });
    distances.sort(function (a, b) { return a.distance - b.distance; });
    return distances.slice(0, num_results).map(function (item) { return "".concat(item.word, " (edit distance = ").concat(item.distance, ")"); });
}
var filepath = 'wordlist-10000.txt';
var wordList = getWords(filepath);
var process = require('process');
console.log(getSimilarWords(process.argv[2], wordList, process.argv[3]));
