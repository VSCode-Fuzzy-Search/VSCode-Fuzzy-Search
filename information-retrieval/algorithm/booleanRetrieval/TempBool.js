"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempBool = void 0;
var fs = require("fs");
var TempBool = /** @class */ (function () {
    function TempBool() {
    }
    TempBool.prototype.processQuery = function (query, index) {
        var splitQuery = query.replace("(", "").replace(")", "").split(" ");
        var andArray = [];
        for (var i = 0; i < splitQuery.length; i++) {
            if (splitQuery[i] == "AND") {
                var arr1 = index[splitQuery[i - 1]];
                var arr2 = index[splitQuery[i + 1]];
                for (var j = 0; j < arr2.length; j++) {
                    if (arr1.includes(arr2[j])) {
                        andArray.push(arr2[j]);
                    }
                }
            }
        }
        var result = [];
        for (var i = 0; i < andArray.length; i++) {
            result.push({ file: andArray[i], related: 1 });
        }
        return result;
    };
    TempBool.prototype.createIndex = function (path) {
        var documents = fs.readdirSync(path);
        //console.log(documents)
        return { "Hello": ["Doc 1", "Doc 2", "Doc 3"],
            "Bye": ["Doc 2", "Doc 3"],
            "Goodbye": ["Doc 1"]
        };
    };
    return TempBool;
}());
exports.TempBool = TempBool;
