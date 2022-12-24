"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.tokenToString = exports.str = exports.op = exports.sym = exports.num = exports.com = exports.ws = exports.pnc = void 0;
// punctuation is syntactical
// punctuation is one of the following characters:
// '(' | ')' | '{' | '}' | ':' | ';' | '<' | '>'
exports.pnc = /^([\{\};:\(\)<>])/;
// Whitespace. No capture but syntactical
exports.ws = /^\s+/;
// A comment is not syntactical but nice to recognize
// Comments are special because they take precedence over the rest of them
exports.com = /^\/\/(.*)/;
// A number can be recognized, but will not be parsed until the later stages
exports.num = /^(0[xobd])?([A-Fa-f0-9]+)/;
// A symbol is the same as a C symbol
exports.sym = /^([A-Za-z]\w*)/;
// An operator can be any one or multiple of the following:
// '!' | '@' | '#' | '$' | '%' | '^' | '*' | '-' | '+' | '=' | '[' | ']' | '?' |
// '/' | '\' | '&' | '|'
exports.op = /^([!@#$%^*\-+=\[\]\?\/\\&|]+)/;
// A string is more complex. There must be an even number of backslashes before
// the end of the string.
exports.str = /^(\"[^\"]*(?:[^\\](?:\\\\)*)\"|\'[^\']*(?:[^\\](?:\\\\)*)\')/;
// The dictionary is the list and order of each token variety
const dictionary = new Map();
// This is the order in which they are parsed, because the insertion order
// is the way that they are done
dictionary.set("Com", exports.com);
dictionary.set("Pnc", exports.pnc);
dictionary.set("Ws", exports.ws);
dictionary.set("Op", exports.op);
dictionary.set("Str", exports.str);
dictionary.set("Sym", exports.sym);
dictionary.set("Num", exports.num);
// Simple helper function that prints the value of the token 
function tokenToString(t) {
    return `${t.ttype}\t[${JSON.stringify(t.value)}]`;
}
exports.tokenToString = tokenToString;
// The main lexer class
class Lexer {
    constructor(input) {
        this.source = input + "\n";
        this.right = this.source;
        this.position = 0;
    }
    // Getting the next token, or null if it is the end of the file
    chomp() {
        // There is no right hand side
        if (this.right === "")
            return null;
        // Try matching each of the patterns in turn to what is in the right
        let m = undefined;
        for (const [key, val] of dictionary) {
            let a = null;
            if ((a = val.exec(this.right))) {
                this.right = this.right.slice(a[0].length);
                m = {
                    ttype: key,
                    value: a[0],
                };
                break;
            }
        }
        // If none of the regexes match, Unk 
        if (m === undefined) {
            let u = this.right[0];
            this.right = this.right.slice(1);
            return {
                ttype: "Unk",
                value: u,
            };
        }
        else
            return m;
    }
    *[Symbol.iterator]() {
        let current_token;
        while ((current_token = this.chomp()) !== null) {
            yield current_token;
        }
        yield {
            value: "EOF",
            ttype: "End",
        };
    }
}
exports.Lexer = Lexer;
