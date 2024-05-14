import { damerau_levenshtein } from "./damerau-levenshtein";
import { levenshtein } from "./levenshtein";
import { AlgoEnum } from "./algo-enum";

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
 * Runs the respective edit-distance algorithm 
 * 
 * @param source - source word for edit-distance algorithm
 * @param target - target word for edit-distance algorithm
 * @param algorithm - algorithm value corresponding to enum
 * @returns edit-distance between target and source
 */
function chooseAlgorithm(source: string, target: string, algorithm: string): number {
    switch (algorithm) {
        case AlgoEnum.Levenhstein:
            return levenshtein(source, target);
        case AlgoEnum.Damerau:
            return damerau_levenshtein(source, target);
        default:
            throw new Error("unsupported algorithm");
    }
}

/**
 * Determines the most similar words in a wordlist to a query based on some edit-distance threshold
 * 
 * @param query - source word 
 * @param wordlist - list of words
 * @returns list of similar words
 */
function getSimilarWords(query: string, wordlist: string[], algorithm: string = ""): string[] {
    const EDIT_DISTANCE_THRESHOLD = 3;

    let similarWords: string[] = [];

    for (let i = 0; i < wordlist.length; i++) {
        if (chooseAlgorithm(query, wordList[i], algorithm) < EDIT_DISTANCE_THRESHOLD) {
            similarWords.push(wordlist[i]);
        }
    }

    return similarWords;
}

/**
 * Returns the N closest edit-distance strings from a word list to a query
 * 
 * @param query - the string to be compared against word_list
 * @param word_list - list of words
 * @returns a list of strings
 */
function find_closest(query: string, word_list: string[], num_results: number, algorithm: string = ""): string[] {
    const distances = word_list.map(word => ({
        word,
        distance: chooseAlgorithm(query, word, algorithm)
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
console.log();
console.log('words within edit-distance threshold:');
console.log(getSimilarWords(process.argv[2], wordList, process.argv[3]));

console.log();
console.log(`4 nearest words:`);
console.log(find_closest(process.argv[2], wordList, 10, process.argv[3]));

// TODO
//  - test cases!!

// rank results on edit distance as well
// user might want to query edit-distance

