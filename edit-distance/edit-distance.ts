import { damerau_levenshtein } from "./damerau-levenshtein";
import { levenshtein } from "./levenshtein";

import * as fs from 'fs';

/**
 * Takes a filepath to a list of words and converts it to a list of words
 * 
 * @param filepath - string detailing filepath to words list
 * @returns list of words
 */
function getWords(filepath: string): string[] {
    return fs.readFileSync(filepath, 'utf-8').split('\n').map(word => word.trim());
}

/**
 * Determines the most similar words in a wordlist to a query based on some edit-distance threshold
 * 
 * @param query - source word 
 * @param wordlist - list of words
 * @returns list of similar words
 */
function getSimilarWords(query: string, wordlist: string[], algorithm: string): string[] {
    const EDIT_DISTANCE_THRESHOLD = 3;

    let similarWords: string[] = [];

    for (let i = 0; i < wordlist.length; i++) {
        if (chooseAlgorithm(query, wordList[i], algorithm) < EDIT_DISTANCE_THRESHOLD) {
            similarWords.push(wordlist[i]);
        }
    }

    return similarWords;
}

function chooseAlgorithm(source: string, target: string, algorithm: string): number {
    if (algorithm == "L") {
        return levenshtein(source, target);
    } else if (algorithm == "DL") {
        return damerau_levenshtein(source, target);
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
function find_closest(query: string, word_list: string[], num_results: number): string[] {
    const distances = word_list.map(word => ({
        word,
        distance: levenshtein(query, word)
    }));

    distances.sort((a, b) => a.distance - b.distance);

    return distances.slice(0, num_results).map(item => `${item.word} (edit distance = ${item.distance})`);
}

// e.g. 
// tsc edit-distance.ts
// node edit-distance.js netwrok DL
const filepath = 'wordlist-10000.txt';
const wordList = getWords(filepath);
const process = require('process');
console.log(getSimilarWords(process.argv[2], wordList, process.argv[3]));

// TODO
//  - enum for algorithm
//  - fix DL (wrong number for some cases)
//      - test cases!!


