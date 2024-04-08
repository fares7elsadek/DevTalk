const { default: mongoose } = require("mongoose")

const MongoConnect = ()=>{
    mongoose.connect(process.env.MONGO_URL).then((res:string)=>{
        console.log("database connected");
    }).catch((err:string)=>console.log(err));
}

export default MongoConnect;