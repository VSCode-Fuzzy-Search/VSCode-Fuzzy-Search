/**
 * Finds the occurrences of a pattern in text and returns the its respective indexes
 *
 * @param pattern - the string being searched for
 * @param text - the string being searched
 * @returns - list of indexes
 */
function naive_search(pattern, text) {
    var output = [];
    var m = pattern.length;
    var n = text.length;
    for (var i = 0; i <= n; i++) {
        var j = 0;
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
var txt1 = "AABAACAADAABAABA";
var pat1 = "AABA";
console.log("Example 1:");
console.log(naive_search(pat1, txt1));
// Example 2
var txt2 = "agd";
var pat2 = "g";
console.log("\nExample 2:");
console.log(naive_search(pat2, txt2));
