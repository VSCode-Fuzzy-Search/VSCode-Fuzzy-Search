import * as fs from 'fs';

function damerau_levenshtein(str1: string, str2: string): number {

    const ALPHABET_LENGTH = 26;
    let da: number[] = new Array(ALPHABET_LENGTH).fill(0);

    const test = "a";
    test.charCodeAt(0)
    // - 97

    str1 = "  " + str1;
    str2 = "  " + str2;

    let table: number[][] = new Array(str1.length);

    for (let i = 0; i < str1.length; i++) {
        table[i] = new Array(str2.length);
    }   

    let max_dist = str1.length + str2.length - 4;

    table[0][0] = max_dist;

    for (let i = 1; i < str1.length; i++) {
        table[i][0] = max_dist;
        table[i][1] = i-1;
    }
    for (let j = 1; j < str2.length; j++) {
        table[0][j] = max_dist;
        table[1][j] = j-1;
    }

    let db: number;
    let k: number;
    let l: number;
    let cost: number;

    for (let i = 2; i < str1.length; i++) {
        db = 1;
        for (let j = 2; j < str2.length; j++) {
            k = da[str2[j].charCodeAt(0) - 97]+1;
            l = db;
            if (str1[i] == str2[j]) {
                cost = 0;
                db = j;
            } else {
                cost = 1;
            }
            table[i][j] = Math.min(table[i-1][j-1]+cost, table[i][j-1]+1, table[i-1][j]+1, table[k-1][l-1]+(i-k-1)+1+(j-l-1));
        }
        da[str1[i].charCodeAt(0)-97] = i;
    }

    return table[str1.length - 1][str2.length - 1];

}

/**
 * Returns the 10 closest edit-distance strings from a word list to a query
 * 
 * @param query - the string to be compared against word_list
 * @param word_list - list of words
 * @returns a list of strings
 */
function find_closest(query: string, word_list: string[]): string[] {

    const num_results = 10;

    const distances = word_list.map(word => ({
        word,
        distance: damerau_levenshtein(query, word)
    }));

    distances.sort((a, b) => a.distance - b.distance);

    return distances.slice(0, num_results).map(item => `${item.word} (edit distance = ${item.distance})`);

}

function main() {

    // console.log(damerau_levenshtein("abcd", "acbd"));

    const word_list: string[] = fs.readFileSync('wordlist-10000.txt', 'utf-8').split('\n').map(word => word.trim());

    const query = 'absetn';
    const closestWords = find_closest(query, word_list);

    console.log(`Closest words to ${query}:`);
    for (let i = 0; i < closestWords.length; i++) {
        console.log(closestWords[i]);
    }

}

main();