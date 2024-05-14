/**
 * Returns the edit distance between two strings using the Levenhstein algorithm
 * 
 * @param target - the target word
 * @param source - the source word
 * @returns the bottom right element from the calculated table
 */
export function levenshtein(target: string, source: string): number {
    target = " " + target;
    source = " " + source;

    let table: number[][] = new Array(target.length);

    for (let i = 0; i < target.length; i++) {
        table[i] = new Array(source.length);
    }   

    table[0][0] = 0;
    for (let j = 1; j < source.length; j++) {
        table[0][j] = j;
    }
    for (let i = 1; i < target.length; i++) {
        table[i][0] = i;
    }

    for (let i = 1; i < target.length; i++) {
        for (let j = 1; j < source.length; j++) {
            let minimum = Math.min(table[i][j-1], table[i-1][j], table[i-1][j-1]);
            if (target[i] == source[j]) {
                table[i][j] = minimum;
            } else {
                table[i][j] = minimum + 1;
            }
        }
    }

    return table[target.length - 1][source.length - 1];
}
