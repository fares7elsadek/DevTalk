class AppError extends Error {
    private statusCode:number = 200;
    constructor(){
        super();
    }
    Create(message:string,statusCode:number){
         this.message=message;
         this.statusCode=statusCode;
         return this;
    }
}

export default new AppError();