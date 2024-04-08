"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { default: mongoose } = require("mongoose");
const MongoConnect = () => {
    mongoose.connect(process.env.MONGO_URL).then((res) => {
        console.log("database connected");
    }).catch((err) => console.log(err));
};
exports.default = MongoConnect;
