"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersLogin = exports.UsersRigister = void 0;
const express_validator_1 = require("express-validator");
const UsersRigister = () => {
    return [
        (0, express_validator_1.body)('firstname').notEmpty().withMessage('firstname filed is required').isLength({ max: 30 }).withMessage('firstname max length is 30').isString().withMessage('firstname must be string value'),
        (0, express_validator_1.body)('lastname').notEmpty().withMessage('lastname filed is required').isLength({ max: 30 }).withMessage('lastname max length is 30').isString().withMessage('lastname must be string value'),
        (0, express_validator_1.body)('email').notEmpty().withMessage('email filed is required').isEmail().withMessage('Not a valid e-mail address').isLength({ max: 100 }).withMessage('email max length is 100'),
        (0, express_validator_1.body)('title').notEmpty().withMessage('title filed is required').isString().withMessage('title must be string'),
        (0, express_validator_1.body)('username').notEmpty().withMessage('username filed is required').isString().withMessage('username must be string')
    ];
};
exports.UsersRigister = UsersRigister;
const UsersLogin = () => {
    return [
        (0, express_validator_1.body)('email').notEmpty().withMessage('email filed is required').isEmail().withMessage('Not a valid e-mail address').isLength({ max: 100 }).withMessage('email max length is 100'),
        (0, express_validator_1.body)('password').notEmpty().withMessage('password filed is required').isLength({ max: 30 }).withMessage('password max length is 30').isLength({ min: 8 }).withMessage('password max length is 8')
    ];
};
exports.UsersLogin = UsersLogin;
