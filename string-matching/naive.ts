/**
 * Finds the occurrences of a pattern in text and returns the its respective indexes 
 * 
 * @param pattern - the string being searched for
 * @param text - the string being searched
 * @returns - list of indexes
 */
function naive_search(pattern: string, text: string): number[] {

    let output: number[] = [];

    const m = pattern.length;
    const n = text.length;

    for (let i = 0; i <= n; i++) {
        let j = 0;

        while (j < m && text[i + j] == pattern[j]) {
            j++;
        }

        if (j == m) {
            output.push(i);
        }
    }

    return output;

}

// Example 1
const txt1 = "AABAACAADAABAABA";
const pat1 = "AABA";
console.log("Example 1:");
console.log(naive_search(pat1, txt1));

// Example 2
const txt2 = "agd";
const pat2 = "g";
console.log("\nExample 2:");
console.log(naive_search(pat2, txt2));