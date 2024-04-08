"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor() {
        super();
        this.statusCode = 200;
    }
    Create(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
        return this;
    }
}
exports.default = new AppError();
