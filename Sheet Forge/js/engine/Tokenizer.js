/**
 * SheetForge - Formula Tokenizer
 * Lexer for spreadsheet expressions, cell references, ranges, cross-sheet refs, operators, and literals
 */

export const TokenType = Object.freeze({
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    BOOLEAN: 'BOOLEAN',
    CELL_REF: 'CELL_REF',       // e.g. A1, $B$5
    RANGE_REF: 'RANGE_REF',     // e.g. A1:B10
    SHEET_REF: 'SHEET_REF',     // e.g. Sheet1!A1, 'Sales Data'!B2:C10
    FUNCTION: 'FUNCTION',       // e.g. SUM, AVERAGE, IF
    OPERATOR: 'OPERATOR',       // +, -, *, /, ^, %, &, =, <>, !=, <, <=, >, >=
    LPAREN: 'LPAREN',           // (
    RPAREN: 'RPAREN',           // )
    COMMA: 'COMMA',             // ,
    COLON: 'COLON',             // :
    EOF: 'EOF',
    UNKNOWN: 'UNKNOWN'
});

export class Token {
    constructor(type, value, start, end) {
        this.type = type;
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export class Tokenizer {
    constructor(formula) {
        this.input = typeof formula === 'string' ? formula : '';
        if (this.input.startsWith('=')) {
            this.input = this.input.substring(1);
        }
        this.pos = 0;
        this.len = this.input.length;
    }

    tokenize() {
        const tokens = [];
        while (this.pos < this.len) {
            this.skipWhitespace();
            if (this.pos >= this.len) break;

            const ch = this.input[this.pos];
            const start = this.pos;

            // Numbers (including decimals and scientific e.g. 1.5e3)
            if (this.isDigit(ch) || (ch === '.' && this.isDigit(this.peek(1)))) {
                tokens.push(this.readNumber());
                continue;
            }

            // String literals: "hello" or 'hello'
            if (ch === '"' || ch === "'") {
                tokens.push(this.readString(ch));
                continue;
            }

            // Parentheses, commas, colons
            if (ch === '(') {
                tokens.push(new Token(TokenType.LPAREN, '(', start, ++this.pos));
                continue;
            }
            if (ch === ')') {
                tokens.push(new Token(TokenType.RPAREN, ')', start, ++this.pos));
                continue;
            }
            if (ch === ',') {
                tokens.push(new Token(TokenType.COMMA, ',', start, ++this.pos));
                continue;
            }
            if (ch === ':') {
                tokens.push(new Token(TokenType.COLON, ':', start, ++this.pos));
                continue;
            }

            // Two-character operators: <=, >=, <>, !=, ==
            const twoChar = this.input.substr(this.pos, 2);
            if (['<=', '>=', '<>', '!=', '=='].includes(twoChar)) {
                tokens.push(new Token(TokenType.OPERATOR, twoChar === '==' ? '=' : twoChar, start, this.pos += 2));
                continue;
            }

            // Single-character operators: +, -, *, /, ^, %, &, <, >, =
            if (['+', '-', '*', '/', '^', '%', '&', '<', '>', '='].includes(ch)) {
                tokens.push(new Token(TokenType.OPERATOR, ch, start, ++this.pos));
                continue;
            }

            // Sheet reference with quoted sheet name: 'Sheet Name'!A1:B10
            if (ch === "'" || this.input.substr(this.pos).match(/^([A-Za-z0-9_]+)!/)) {
                const sheetToken = this.tryReadSheetRef();
                if (sheetToken) {
                    tokens.push(sheetToken);
                    continue;
                }
            }

            // Identifiers: functions, booleans, cell references, ranges
            if (this.isAlpha(ch) || ch === '$' || ch === '_') {
                tokens.push(this.readIdentifierOrRef());
                continue;
            }

            // Unknown character
            tokens.push(new Token(TokenType.UNKNOWN, ch, start, ++this.pos));
        }

        tokens.push(new Token(TokenType.EOF, '', this.pos, this.pos));
        return tokens;
    }

    skipWhitespace() {
        while (this.pos < this.len && /\s/.test(this.input[this.pos])) {
            this.pos++;
        }
    }

    isDigit(ch) {
        return ch >= '0' && ch <= '9';
    }

    isAlpha(ch) {
        return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
    }

    isAlphaNum(ch) {
        return this.isAlpha(ch) || this.isDigit(ch) || ch === '_' || ch === '$';
    }

    peek(offset = 0) {
        const p = this.pos + offset;
        return p < this.len ? this.input[p] : '';
    }

    readNumber() {
        const start = this.pos;
        let hasDot = false;
        let hasExp = false;

        while (this.pos < this.len) {
            const ch = this.input[this.pos];
            if (this.isDigit(ch)) {
                this.pos++;
            } else if (ch === '.' && !hasDot && !hasExp) {
                hasDot = true;
                this.pos++;
            } else if ((ch === 'e' || ch === 'E') && !hasExp) {
                hasExp = true;
                this.pos++;
                if (this.pos < this.len && (this.input[this.pos] === '+' || this.input[this.pos] === '-')) {
                    this.pos++;
                }
            } else {
                break;
            }
        }

        const numStr = this.input.substring(start, this.pos);
        return new Token(TokenType.NUMBER, parseFloat(numStr), start, this.pos);
    }

    readString(quoteChar) {
        const start = this.pos;
        this.pos++; // Skip opening quote
        let result = '';

        while (this.pos < this.len) {
            const ch = this.input[this.pos];
            if (ch === quoteChar) {
                // Check for escaped quote ("" or '')
                if (this.pos + 1 < this.len && this.input[this.pos + 1] === quoteChar) {
                    result += quoteChar;
                    this.pos += 2;
                } else {
                    this.pos++; // Skip closing quote
                    break;
                }
            } else {
                result += ch;
                this.pos++;
            }
        }

        return new Token(TokenType.STRING, result, start, this.pos);
    }

    tryReadSheetRef() {
        const start = this.pos;
        let sheetName = '';

        if (this.input[this.pos] === "'") {
            this.pos++;
            while (this.pos < this.len && this.input[this.pos] !== "'") {
                sheetName += this.input[this.pos];
                this.pos++;
            }
            if (this.pos < this.len && this.input[this.pos] === "'") {
                this.pos++;
            }
        } else {
            while (this.pos < this.len && (this.isAlphaNum(this.input[this.pos]))) {
                sheetName += this.input[this.pos];
                this.pos++;
            }
        }

        if (this.pos < this.len && this.input[this.pos] === '!') {
            this.pos++; // skip !
            // Now read the cell or range reference
            const refToken = this.readIdentifierOrRef();
            return new Token(TokenType.SHEET_REF, {
                sheet: sheetName,
                ref: refToken.value,
                isRange: refToken.type === TokenType.RANGE_REF
            }, start, this.pos);
        }

        // Backtrack
        this.pos = start;
        return null;
    }

    readIdentifierOrRef() {
        const start = this.pos;
        while (this.pos < this.len && (this.isAlphaNum(this.input[this.pos]) || this.input[this.pos] === ':')) {
            this.pos++;
        }

        const raw = this.input.substring(start, this.pos);
        const upper = raw.toUpperCase();

        // Check for Booleans
        if (upper === 'TRUE') {
            return new Token(TokenType.BOOLEAN, true, start, this.pos);
        }
        if (upper === 'FALSE') {
            return new Token(TokenType.BOOLEAN, false, start, this.pos);
        }

        // Check for range: e.g. A1:B10 or $A$1:$B$10
        if (raw.includes(':')) {
            const parts = raw.split(':');
            if (parts.length === 2 && this.isCellRef(parts[0]) && this.isCellRef(parts[1])) {
                return new Token(TokenType.RANGE_REF, upper, start, this.pos);
            }
        }

        // Check for single cell reference: e.g. A1, $A1, A$1, $A$1
        if (this.isCellRef(raw)) {
            // Check if next non-space char is a colon for range (e.g. A1 : B10)
            const savePos = this.pos;
            this.skipWhitespace();
            if (this.pos < this.len && this.input[this.pos] === ':') {
                this.pos++;
                this.skipWhitespace();
                const nextRefStart = this.pos;
                while (this.pos < this.len && this.isAlphaNum(this.input[this.pos])) {
                    this.pos++;
                }
                const nextRef = this.input.substring(nextRefStart, this.pos);
                if (this.isCellRef(nextRef)) {
                    return new Token(TokenType.RANGE_REF, `${upper}:${nextRef.toUpperCase()}`, start, this.pos);
                }
                this.pos = savePos; // backtrack
            } else {
                this.pos = savePos;
            }
            return new Token(TokenType.CELL_REF, upper, start, this.pos);
        }

        // Function call
        return new Token(TokenType.FUNCTION, upper, start, this.pos);
    }

    isCellRef(str) {
        if (!str || typeof str !== 'string') return false;
        return /^(\$)?([A-Za-z]+)(\$)?([0-9]+)$/.test(str.trim());
    }
}
