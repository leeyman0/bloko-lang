// TokenType is the type of token that is there
export type TokenType =
    "Str" // String
    | "Num" // Number
    | "Op"  // operator
    | "Ws"  // whitespace
    | "Sym" // symbol
    | "Com" // comment
    | "Pnc" // punctuation
    | "Unk" // Unknown character
    | "End" // end of file
    ;
// The values are just the part of the string that they are
export type Token = {
    value: string,
    ttype: TokenType,
};
// punctuation is syntactical
// punctuation is one of the following characters:
// '(' | ')' | '{' | '}' | ':' | ';' | '<' | '>'
export const pnc: RegExp = /^([\{\};:\(\)<>])/;
// Whitespace. No capture but syntactical
export const ws: RegExp = /^\s+/;
// A comment is not syntactical but nice to recognize
// Comments are special because they take precedence over the rest of them
export const com: RegExp = /^\/\/(.*)/;
// A number can be recognized, but will not be parsed until the later stages
export const num: RegExp = /^((?:0[xobd])?[A-Fa-f0-9]*(?:\.[0-9]+)?)/;
// A symbol is the same as a C symbol
export const sym: RegExp = /^([A-Za-z]\w*)/;
// An operator can be any one or multiple of the following:
// '!' | '@' | '#' | '$' | '%' | '^' | '*' | '-' | '+' | '=' | '[' | ']' | '?' |
// '/' | '\' | '&' | '|'
export const op: RegExp = /^([!@#$%^*\-+=\[\]\?\/\\&|]+)/;
// A string is more complex. There must be an even number of backslashes before
// the end of the string.
export const str: RegExp =
    /^(\"[^\"]*(?:[^\\](?:\\\\)*)\"|\'[^\']*(?:[^\\](?:\\\\)*)\')/;

// The dictionary is the list and order of each token variety
const dictionary: Map<TokenType, RegExp> = new Map();
// This is the order in which they are parsed, because the insertion order
// is the way that they are done
dictionary.set("Com", com);
dictionary.set("Pnc", pnc);
dictionary.set("Ws", ws);
dictionary.set("Op", op);
dictionary.set("Str", str);
dictionary.set("Sym", sym);
dictionary.set("Num", num);

// Simple helper function that prints the value of the token 
export function tokenToString(t: Token): string {
    return `${t.ttype}\t[${JSON.stringify(t.value)}]`
}
// The main lexer class
export class Lexer {
    source: string;   // Is the source string 
    right: string;    // Is the string that we have yet to process
    position: number; // Is the index
    constructor(input: string) {
        this.source = input;
        this.right = this.source;
        this.position = 0;
    }

    // Getting the next token, or null if it is the end of the file
    chomp(): Token | null {
        // There is no right hand side
        if (this.right === "")
            return null;

        // Try matching each of the patterns in turn to what is in the right
        let m: Token | undefined = undefined;
        for (const [key, val] of dictionary) {
            let a: Array<string> | null = null;
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
        } else return m;
    }

    *[Symbol.iterator](): Generator<Token> {
        let current_token: Token | null;
        while ((current_token = this.chomp()) !== null) {
            yield current_token;
        }
        yield {
            value: "EOF",
            ttype: "End",
        };
    }
}

