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
    row: number,
    col: number,
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
export const num: RegExp = /^((?:0[xobd])?[A-Fa-f0-9]+(?:\.[A-Fa-f0-9]+)?)/;
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
    return `${t.ttype}\t[${t.value}]\t(${t.row}, ${t.col})`
}
// The main lexer class
export class Lexer {
    source: string;   // Is the source string 
    right: string;    // Is the string that we have yet to process
    line: number; // Is the index of the line that
    col: number;
    constructor(input: string) {
        this.source = input;
        this.right = this.source;
        this.line = 1;
	this.col = 1;
    }

    // Getting the next token, or null if it is the end of the file
    chomp(): Token | null {
        // There is no right hand side
        if (this.right === "")
            return null;

	// Saving the current row and column
	let [token_row, token_col]: [number, number] = [this.line, this.col];

        // Try matching each of the patterns in turn to what is in the right
        let m: Token | undefined = undefined;
        for (const [key, val] of dictionary) { // This will iterate through the
	    // token dictionary, in the order that the pairs were added.
            let a: Array<string> | null = null; // The variable a is how we are
	    // storing the match
            if ((a = val.exec(this.right))) { // If there is a match found
		// Update the string by which we match tokens 
                this.right = this.right.slice(a[0].length);
		// Update the line and column
		this.col += a[0].length;
		if (key === "Ws" || key === "Str") {
		    // These types can contain newlines
		    let lines = a[0].split("\n");
		    if (lines.length > 1) {// If there are newlines
			this.line += lines.length - 1;
			this.col = lines[lines.length - 1].length + 1;
		    }
		}
		// make the token
                m = {
                    ttype: key,
                    value: a[0],
		    row: token_row,
		    col: token_col,
                };
		// We don't need to match anything anymore, so break
                break;
            }
        }

        // If none of the regexes match, Unk 
        if (m === undefined) {
            let u = this.right[0];
            this.right = this.right.slice(1);
	    this.col += 1;
            return {
                ttype: "Unk",
                value: u,
		row: token_row,
		col: token_col,
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
	    row: -1,
	    col: -1,
        };
    }
}

