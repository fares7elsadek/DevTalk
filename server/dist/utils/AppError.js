"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor() {
        super();
        this.statusCode = 200;
        this.errors = [];
    }
    Create(message, statusCode, errors = []) {
        this.message = message;
        this.statusCode = statusCode;
        this.errors = errors;
        return this;
    }
}
exports.default = AppError;
