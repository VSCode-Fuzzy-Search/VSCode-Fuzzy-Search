"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.damerau_levenshtein = void 0;
function damerau_levenshtein(str1, str2) {
    var ALPHABET_LENGTH = 26;
    var da = new Array(ALPHABET_LENGTH).fill(0);
    str1 = "  " + str1;
    str2 = "  " + str2;
    var table = new Array(str1.length);
    for (var i = 0; i < str1.length; i++) {
        table[i] = new Array(str2.length);
    }
    var max_dist = str1.length + str2.length - 4;
    table[0][0] = max_dist;
    for (var i = 1; i < str1.length; i++) {
        table[i][0] = max_dist;
        table[i][1] = i - 1;
    }
    for (var j = 1; j < str2.length; j++) {
        table[0][j] = max_dist;
        table[1][j] = j - 1;
    }
    var db;
    var k;
    var l;
    var cost;
    for (var i = 2; i < str1.length; i++) {
        db = 1;
        for (var j = 2; j < str2.length; j++) {
            k = da[str2[j].charCodeAt(0) - 97] + 1;
            l = db;
            if (str1[i] == str2[j]) {
                cost = 0;
                db = j;
            }
            else {
                cost = 1;
            }
            table[i][j] = Math.min(table[i - 1][j - 1] + cost, table[i][j - 1] + 1, table[i - 1][j] + 1, table[k - 1][l - 1] + (i - k - 1) + 1 + (j - l - 1));
        }
        da[str1[i].charCodeAt(0) - 97] = i;
    }
    return table[str1.length - 1][str2.length - 1];
}
exports.damerau_levenshtein = damerau_levenshtein;
