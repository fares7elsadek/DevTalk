"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const DeleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
};
exports.default = DeleteFile;
