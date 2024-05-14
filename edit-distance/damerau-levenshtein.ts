/**
 * Returns the edit distance between two strings using the Damerau-Levenhstein algorithm
 * 
 * @param target - the target word
 * @param source - the source word
 * @returns the bottom right element from the calculated table
 */
export function damerau_levenshtein(target: string, source: string): number {
    const ALPHABET_LENGTH = 26;
    let da: number[] = new Array(ALPHABET_LENGTH).fill(0);

    target = "  " + target;
    source = "  " + source;

    let table: number[][] = new Array(target.length);

    for (let i = 0; i < target.length; i++) {
        table[i] = new Array(source.length);
    }   

    let max_dist = target.length + source.length - 4;

    table[0][0] = max_dist;

    for (let i = 1; i < target.length; i++) {
        table[i][0] = max_dist;
        table[i][1] = i-1;
    }
    for (let j = 1; j < source.length; j++) {
        table[0][j] = max_dist;
        table[1][j] = j-1;
    }

    let db: number;
    let k: number;
    let l: number;
    let cost: number;

    for (let i = 2; i < target.length; i++) {
        db = 1;
        for (let j = 2; j < source.length; j++) {
            k = da[source[j].charCodeAt(0) - 97]+1;
            l = db;
            if (target[i] == source[j]) {
                cost = 0;
                db = j;
            } else {
                cost = 1;
            }
            table[i][j] = Math.min(table[i-1][j-1]+cost, table[i][j-1]+1, table[i-1][j]+1, table[k-1][l-1]+(i-k-1)+1+(j-l-1));
        }
        da[target[i].charCodeAt(0)-97] = i;
    }

    return table[target.length - 1][source.length - 1];
}
