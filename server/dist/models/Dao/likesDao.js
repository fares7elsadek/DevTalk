"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../utils/AppError"));
const httpMessage_1 = require("../../utils/httpMessage");
class Like {
    LikeHelper(userId, mainId, Like_Model, Main_model, Main_model_name, Like_Model_Name, next, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let alreadyLiked;
            if (Main_model_name == "post") {
                alreadyLiked = yield Like_Model.findOne({ $and: [{ user: userId }, { post: mainId }] });
            }
            else {
                console.log(userId, mainId);
                alreadyLiked = yield Like_Model.findOne({ $and: [{ user: userId }, { comment: mainId }] });
            }
            if (alreadyLiked != null) {
                console.log(2);
                const Lid = alreadyLiked._id;
                let done;
                if (Like_Model_Name == "Upvote") {
                    done = yield Main_model.findByIdAndUpdate({ _id: mainId }, { $pull: { Upvote: Lid } }, { new: true });
                }
                else {
                    done = yield Main_model.findByIdAndUpdate({ _id: mainId }, { $pull: { Downvote: Lid } }, { new: true });
                }
                if (!done) {
                    return next(new AppError_1.default().Create(`something wrong has happened`, 400));
                }
                yield Like_Model.deleteOne({ _id: Lid });
                res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS });
            }
            else {
                let Like;
                if (Main_model_name == "post") {
                    Like = new Like_Model({
                        user: userId,
                        post: mainId
                    });
                }
                else {
                    Like = new Like_Model({
                        user: userId,
                        comment: mainId
                    });
                }
                yield Like.save();
                let done;
                if (Like_Model_Name == "Upvote") {
                    done = yield Main_model.findByIdAndUpdate({ _id: mainId }, { $push: { Upvote: Like._id } }, { new: true });
                }
                else {
                    done = yield Main_model.findByIdAndUpdate({ _id: mainId }, { $push: { Downvote: Like._id } }, { new: true });
                }
                if (!done) {
                    return next(new AppError_1.default().Create(`something wrong has happened`, 400));
                }
                res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS });
            }
        });
    }
}
exports.default = new Like();
