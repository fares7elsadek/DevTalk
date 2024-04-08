"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const dbconnect_1 = __importDefault(require("./config/dbconnect"));
dotenv_1.default.config();
const auth_1 = __importDefault(require("./routes/auth"));
const comments_1 = __importDefault(require("./routes/comments"));
const likes_1 = __importDefault(require("./routes/likes"));
const posts_1 = __importDefault(require("./routes/posts"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
(0, dbconnect_1.default)();
app.use(body_parser_1.default.json());
// auth route
app.use('/auth', auth_1.default);
// comments route
app.use('/comments', comments_1.default);
// likes route
app.use('/likes', likes_1.default);
// posts route
app.use('/posts', posts_1.default);
app.listen(PORT, () => {
    console.log(`app lisen on port ${PORT}`);
});
