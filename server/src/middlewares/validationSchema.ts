import { ExpressValidator, body, validationResult } from 'express-validator';


export const UsersRigister = () => {
    return [
        body('firstname').notEmpty().withMessage('firstname filed is required').isLength({ max: 30 }).withMessage('firstname max length is 30').isString().withMessage('firstname must be string value'),
        body('password').notEmpty().withMessage('password filed is required').isLength({ max: 30 }).withMessage('password max length is 30').isLength({ min: 8 }).withMessage('password max length is 8'),
        body('lastname').notEmpty().withMessage('lastname filed is required').isLength({ max: 30 }).withMessage('lastname max length is 30').isString().withMessage('lastname must be string value'),
        body('email').notEmpty().withMessage('email filed is required').isEmail().withMessage('Not a valid e-mail address').isLength({ max: 100 }).withMessage('email max length is 100'),
        body('title').notEmpty().withMessage('title filed is required').isString().withMessage('title must be string'),
        body('username').notEmpty().withMessage('username filed is required').isString().withMessage('username must be string')
    ];
};

export const UsersLogin = () => {
    return [
        body('email').notEmpty().withMessage('email filed is required').isEmail().withMessage('Not a valid e-mail address').isLength({ max: 100 }).withMessage('email max length is 100'),
        body('password').notEmpty().withMessage('password filed is required').isLength({ max: 30 }).withMessage('password max length is 30').isLength({ min: 8 }).withMessage('password max length is 8')
    ];
};


