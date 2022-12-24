"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lexer_1 = require("./Lexer");
let input = "aushf32342 9f23 <t> 239042n @*(#&$*( )(*)(&@*(#&{}@#}{:";
let lexer = new Lexer_1.Lexer(input);
for (let t of lexer) {
    console.log((0, Lexer_1.tokenToString)(t));
}
