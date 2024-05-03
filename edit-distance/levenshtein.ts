/**
 * Returns the edit distance between two strings using the Levenhstein algorithm
 * 
 * @param str1 - the first string
 * @param str2 - the second string
 * @returns the bottom right element from the calculated table
 */
export function levenshtein(str1: string, str2: string): number {

    str1 = " " + str1;
    str2 = " " + str2;

    let table: number[][] = new Array(str2.length);

    for (let i = 0; i < str2.length; i++) {
        table[i] = new Array(str1.length);
    }   

    table[0][0] = 0;
    for (let i = 1; i < str1.length; i++) {
        table[0][i] = i;
    }
    for (let j = 1; j < str2.length; j++) {
        table[j][0] = j;
    }

    for (let i = 1; i < str1.length; i++) {
        for (let j = 1; j < str2.length; j++) {
            let minimum = Math.min(table[j][i-1], table[j-1][i], table[j-1][i-1]);
            if (str1[i] == str2[j] && i == j) {
                table[j][i] = minimum;
            } else {
              table[j][i] = minimum + 1;
            }
        }
    }

    return table[str2.length - 1][str1.length - 1];

}
