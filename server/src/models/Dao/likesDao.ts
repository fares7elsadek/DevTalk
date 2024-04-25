import { Response, NextFunction } from 'express';
import AppError from '../../utils/AppError';
import { HttpMessage } from '../../utils/httpMessage';



class Like{

    async LikeHelper(userId:any,mainId:any,Like_Model:any,Main_model:any,Main_model_name:string,Like_Model_Name:string,next:NextFunction,res:Response){
        let alreadyLiked;
        if(Main_model_name=="post"){
            alreadyLiked = await Like_Model.findOne({$and:[{user:userId},{post:mainId}]});
        }else{
            console.log(userId,mainId);
            alreadyLiked = await Like_Model.findOne({$and:[{user:userId},{comment:mainId}]});
        }
        if(alreadyLiked!=null){
            console.log(2)

            const Lid = alreadyLiked._id;
            let done;
            if(Like_Model_Name == "Upvote"){
                done = await Main_model.findByIdAndUpdate(
                    {_id: mainId},
                    { $pull: { Upvote: Lid } },
                    { new: true }
                );
            }else{
                done = await Main_model.findByIdAndUpdate(
                    {_id: mainId},
                    { $pull: { Downvote: Lid } },
                    { new: true }
                );
            }
            if(!done){
                return next(new AppError().Create(`something wrong has happened`,400));
            }
            await Like_Model.deleteOne({_id:Lid});
            res.status(200).json({status:HttpMessage.SUCCESS});
        }else{
            let Like;
            if(Main_model_name=="post"){
                Like = new Like_Model({
                    user:userId,
                    post:mainId
                });
            }else{
                Like = new Like_Model({
                    user:userId,
                    comment:mainId
                });
            }
            await Like.save();
            let done;
            if(Like_Model_Name=="Upvote"){
                done = await Main_model.findByIdAndUpdate(
                    {_id: mainId},
                    { $push: { Upvote: Like._id } }, 
                    { new: true }
                );
            }else{
                done = await Main_model.findByIdAndUpdate(
                    {_id: mainId},
                    { $push: { Downvote: Like._id } }, 
                    { new: true }
                );
            }
            if(!done){
                return next(new AppError().Create(`something wrong has happened`,400));
            }
            res.status(200).json({status:HttpMessage.SUCCESS});
        }
    }
}


export default new Like();
