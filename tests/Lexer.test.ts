
import {
    Token,
    tokenToString,
    Lexer
} from "../Lexer";

test('Identifying symbols correctly', () => {
    let lexer = new Lexer('abc 1ab alpha_omega');
    expect([...lexer]).toStrictEqual([
        {
            ttype: "Sym",
            value: "abc",
        },
        {
            ttype: "Ws",
            value: " ",
        },
        {
            ttype: "Num",
            value: "1ab",
        },
        {
            ttype: "Ws",
            value: " ",
        },
        {
            ttype: "Sym",
            value: "alpha_omega",
        },
        {
            ttype: "End",
            value: "EOF",
        },
    ]);
});
