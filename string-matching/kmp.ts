function kmp(pattern: string, text: string): number[] {
    /* 
    Worst case time complexity = O(n + m)
        n = length of text
        m = length of pattern
    */
    

    let output: number[] = [];

    const m = pattern.length;
    const n = text.length;

    let prefix_table = new Array(m).fill(0);

    let i = 0;

    for (let j = 1; j < m; j++) {
        if (pattern[j] == pattern[i]) {
            // prefix_table[j] = ??;
            // i = ??;
        }
    }

    return output;
}



// Example 1
console.log("Example 1:");
console.log(kmp("AABA", "AABAACAADAABAABA"));

// Example 2
console.log("\nExample 2:");
console.log(kmp("g", "agd"));