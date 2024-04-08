"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dbconnect_1 = __importDefault(require("./config/dbconnect"));
const auth_1 = __importDefault(require("./routes/auth"));
const comments_1 = __importDefault(require("./routes/comments"));
const likes_1 = __importDefault(require("./routes/likes"));
const posts_1 = __importDefault(require("./routes/posts"));
const httpMessage_1 = require("./utils/httpMessage");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
(0, dbconnect_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// auth route
app.use('/api/auth', auth_1.default);
// comments route
app.use('/api/comments', comments_1.default);
// likes route
app.use('/api/likes', likes_1.default);
// posts route
app.use('/api/posts', posts_1.default);
app.all('*', (req, res, next) => {
    res.status(404).json({ message: httpMessage_1.HttpMessage.NOTFOUND, code: 404 });
});
app.use((error, req, res, next) => {
    res.status(error.statusCode).json({ code: error.statusCode, message: error.message, errors: error.errors });
});
app.listen(PORT, () => {
    console.log(`app lisen on port ${PORT}`);
});
