/**
 * SheetForge - Formula Parser
 * Recursive descent AST parser with operator precedence
 */
import { TokenType, Tokenizer } from './Tokenizer.js';

export const ASTNodeType = Object.freeze({
    LITERAL: 'LITERAL',
    CELL_REF: 'CELL_REF',
    RANGE_REF: 'RANGE_REF',
    SHEET_REF: 'SHEET_REF',
    UNARY_OP: 'UNARY_OP',
    BINARY_OP: 'BINARY_OP',
    FUNCTION_CALL: 'FUNCTION_CALL'
});

export class ASTNode {
    constructor(type, data = {}) {
        this.type = type;
        Object.assign(this, data);
    }
}

export class Parser {
    constructor(formula) {
        this.tokenizer = new Tokenizer(formula);
        this.tokens = this.tokenizer.tokenize();
        this.pos = 0;
    }

    peek() {
        return this.tokens[this.pos] || this.tokens[this.tokens.length - 1];
    }

    consume(expectedType = null, expectedVal = null) {
        const token = this.peek();
        if (expectedType && token.type !== expectedType) {
            throw new Error(`Parse error: expected token type ${expectedType}, got ${token.type}`);
        }
        if (expectedVal && token.value !== expectedVal) {
            throw new Error(`Parse error: expected token value "${expectedVal}", got "${token.value}"`);
        }
        this.pos++;
        return token;
    }

    match(type, val = null) {
        const token = this.peek();
        if (token.type === type) {
            if (val === null || token.value === val) {
                this.pos++;
                return token;
            }
        }
        return null;
    }

    parse() {
        if (this.tokens.length === 0 || this.peek().type === TokenType.EOF) {
            return null;
        }
        const ast = this.parseExpression();
        if (this.peek().type !== TokenType.EOF) {
            throw new Error(`Unexpected token "${this.peek().value}" at end of formula`);
        }
        return ast;
    }

    parseExpression() {
        return this.parseComparison();
    }

    // Comparison operators: =, <>, !=, <, <=, >, >=
    parseComparison() {
        let left = this.parseConcat();

        while (true) {
            const token = this.peek();
            if (token.type === TokenType.OPERATOR && ['=', '<>', '!=', '<', '<=', '>', '>='].includes(token.value)) {
                this.consume();
                const right = this.parseConcat();
                left = new ASTNode(ASTNodeType.BINARY_OP, {
                    op: token.value,
                    left,
                    right
                });
            } else {
                break;
            }
        }
        return left;
    }

    // String concatenation: &
    parseConcat() {
        let left = this.parseAddSub();

        while (true) {
            const token = this.peek();
            if (token.type === TokenType.OPERATOR && token.value === '&') {
                this.consume();
                const right = this.parseAddSub();
                left = new ASTNode(ASTNodeType.BINARY_OP, {
                    op: '&',
                    left,
                    right
                });
            } else {
                break;
            }
        }
        return left;
    }

    // Addition and Subtraction: +, -
    parseAddSub() {
        let left = this.parseMulDiv();

        while (true) {
            const token = this.peek();
            if (token.type === TokenType.OPERATOR && (token.value === '+' || token.value === '-')) {
                this.consume();
                const right = this.parseMulDiv();
                left = new ASTNode(ASTNodeType.BINARY_OP, {
                    op: token.value,
                    left,
                    right
                });
            } else {
                break;
            }
        }
        return left;
    }

    // Multiplication and Division: *, /
    parseMulDiv() {
        let left = this.parseExponent();

        while (true) {
            const token = this.peek();
            if (token.type === TokenType.OPERATOR && (token.value === '*' || token.value === '/')) {
                this.consume();
                const right = this.parseExponent();
                left = new ASTNode(ASTNodeType.BINARY_OP, {
                    op: token.value,
                    left,
                    right
                });
            } else {
                break;
            }
        }
        return left;
    }

    // Exponentiation: ^
    parseExponent() {
        let left = this.parseUnary();

        while (true) {
            const token = this.peek();
            if (token.type === TokenType.OPERATOR && token.value === '^') {
                this.consume();
                const right = this.parseUnary();
                left = new ASTNode(ASTNodeType.BINARY_OP, {
                    op: '^',
                    left,
                    right
                });
            } else {
                break;
            }
        }
        return left;
    }

    // Unary operators: +, -, %
    parseUnary() {
        const token = this.peek();
        if (token.type === TokenType.OPERATOR && (token.value === '-' || token.value === '+')) {
            this.consume();
            const expr = this.parseUnary();
            return new ASTNode(ASTNodeType.UNARY_OP, {
                op: token.value,
                expr
            });
        }

        let primary = this.parsePrimary();

        // Check for trailing % (percentage operator)
        if (this.peek().type === TokenType.OPERATOR && this.peek().value === '%') {
            this.consume();
            primary = new ASTNode(ASTNodeType.UNARY_OP, {
                op: '%',
                expr: primary
            });
        }

        return primary;
    }

    // Primary: literals, cell refs, ranges, functions, parenthesized expressions
    parsePrimary() {
        const token = this.peek();

        // Literals
        if (token.type === TokenType.NUMBER) {
            this.consume();
            return new ASTNode(ASTNodeType.LITERAL, { value: token.value, dataType: 'number' });
        }
        if (token.type === TokenType.STRING) {
            this.consume();
            return new ASTNode(ASTNodeType.LITERAL, { value: token.value, dataType: 'string' });
        }
        if (token.type === TokenType.BOOLEAN) {
            this.consume();
            return new ASTNode(ASTNodeType.LITERAL, { value: token.value, dataType: 'boolean' });
        }

        // Cell Reference: A1
        if (token.type === TokenType.CELL_REF) {
            this.consume();
            return new ASTNode(ASTNodeType.CELL_REF, { ref: token.value });
        }

        // Range Reference: A1:B10
        if (token.type === TokenType.RANGE_REF) {
            this.consume();
            return new ASTNode(ASTNodeType.RANGE_REF, { ref: token.value });
        }

        // Cross-sheet Reference: Sheet1!A1 or Sheet1!A1:B10
        if (token.type === TokenType.SHEET_REF) {
            this.consume();
            return new ASTNode(ASTNodeType.SHEET_REF, {
                sheet: token.value.sheet,
                ref: token.value.ref,
                isRange: token.value.isRange
            });
        }

        // Function call: SUM(A1:A10, 5)
        if (token.type === TokenType.FUNCTION) {
            this.consume();
            this.consume(TokenType.LPAREN);
            const args = [];
            if (this.peek().type !== TokenType.RPAREN) {
                while (true) {
                    args.push(this.parseExpression());
                    if (this.match(TokenType.COMMA)) {
                        continue;
                    }
                    break;
                }
            }
            this.consume(TokenType.RPAREN);
            return new ASTNode(ASTNodeType.FUNCTION_CALL, {
                name: token.value.toUpperCase(),
                args
            });
        }

        // Parentheses: ( expr )
        if (token.type === TokenType.LPAREN) {
            this.consume();
            const expr = this.parseExpression();
            this.consume(TokenType.RPAREN);
            return expr;
        }

        throw new Error(`Unexpected token "${token.value}" (${token.type}) in formula`);
    }
}
