import { ExpressValidator, body,validationResult} from 'express-validator';

class AppError extends Error {
    public statusCode:number = 200;
    public errors: any = [];
    constructor(){
        super();
    }
    Create(message:string ,statusCode:number,errors:any=[]){
         this.message=message;
         this.statusCode=statusCode;
         this.errors=errors;
         return this;
    }
}

export default AppError;