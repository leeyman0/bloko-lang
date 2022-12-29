import {
    tokenToString,
    Lexer,
} from "./Lexer";

let input: string = "aushf32342 9f23 <t> 239042n \n \n @*(#&$*( )(*)(&@*(#&{}@#}{: \n beef";
let lexer: Lexer = new Lexer(input);
for (let t of lexer) {
    console.log(tokenToString(t));
}
