from typing import NoReturn, Union, List

from src.commom import (
    Token,
    RESERVED_KEYWORDS,
    EOF,
    LPAREN,
    MINUS,
    MUL,
    RPAREN,
    PLUS,
    ASSIGN,
    DOT,
    ID,
    SEMI,
    COLON,
    COMMA,
    FLOAT_DIV,
    INTEGER_CONST,
    REAL_CONST
)


class Lexer:
    def __init__(self, input_code: str) -> None:
        self.tokens: List[Token] = []
        self.input_code: str = input_code
        self.pos: int = 0
        self.current_char: Union[str, None] = self.input_code[self.pos]

    def get_tokens(self) -> List[Token]:
        while self.current_char is not None:

            if self.current_char.isspace():
                self._skip_whitespace()
                continue

            if self.current_char == '{':
                self._advance()
                self._skip_comment()
                continue

            if self.current_char.isalpha():
                self.tokens.append(self._id())
                continue

            if self.current_char.isdigit():
                self.tokens.append(self._create_number())
                continue

            if self.current_char == ":" and self._peek() == "=":
                self._advance()
                self._advance()
                self.tokens.append(Token(ASSIGN, ":="))
                continue

            if self.current_char == ";":
                self._advance()
                self.tokens.append(Token(SEMI, ";"))
                continue

            if self.current_char == "+":
                self._advance()
                self.tokens.append(Token(PLUS, "+"))
                continue

            if self.current_char == "-":
                self._advance()
                self.tokens.append(Token(MINUS, "-"))
                continue

            if self.current_char == "*":
                self._advance()
                self.tokens.append(Token(MUL, "*"))
                continue

            if self.current_char == "(":
                self._advance()
                self.tokens.append(Token(LPAREN, "("))
                continue

            if self.current_char == ")":
                self._advance()
                self.tokens.append(Token(RPAREN, ")"))
                continue

            if self.current_char == ".":
                self._advance()
                self.tokens.append(Token(DOT, "."))
                continue

            if self.current_char == ':':
                self._advance()
                self.tokens.append(Token(COLON, ':'))
                continue

            if self.current_char == ',':
                self._advance()
                self.tokens.append(Token(COMMA, ','))
                continue

            if self.current_char == '/':
                self._advance()
                self.tokens.append(Token(FLOAT_DIV, '/'))
                continue

            print('----- ERROR -----')
            print(self.input_code[self.pos - 10:self.pos + 10])
            print('----------')
            self._error()

        self.tokens.append(Token(EOF, None))

        return self.tokens

    def _error(self) -> NoReturn:
        raise Exception("Invalid character")

    def _advance(self) -> None:
        self.pos += 1

        if self.pos > len(self.input_code) - 1:
            self.current_char = None
        else:
            self.current_char = self.input_code[self.pos]

    def _skip_whitespace(self) -> None:
        while self.current_char is not None and self.current_char.isspace():
            self._advance()

    def _create_number(self) -> Token:
        result: str = ""

        while self.current_char is not None and self.current_char.isdigit():
            result += self.current_char
            self._advance()

        if self.current_char == '.':
            result += self.current_char
            self._advance()

            while (
                self.current_char is not None and
                self.current_char.isdigit()
            ):
                result += self.current_char
                self._advance()

            token = Token(REAL_CONST, float(result))  # type: ignore
        else:
            token = Token(INTEGER_CONST, int(result))

        return token

    def _peek(self) -> Union[str, None]:
        peek_pos = self.pos + 1
        if peek_pos > len(self.input_code) - 1:
            return None
        else:
            return self.input_code[peek_pos]

    def _id(self) -> Token:
        result = ""

        while self.current_char is not None and self.current_char.isalnum():
            result += self.current_char
            self._advance()

        return RESERVED_KEYWORDS.get(result, Token(ID, result))

    def _skip_comment(self):
        while self.current_char != '}':
            self._advance()
        self._advance()
