"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const verifyId = (id) => {
    const valid = mongoose_1.default.Types.ObjectId.isValid(id);
    if (!valid) {
        throw new Error("invalid");
    }
};
exports.default = verifyId;
