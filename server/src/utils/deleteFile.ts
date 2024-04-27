const fs = require('fs');

const DeleteFile = (filePath:string)=>{
    fs.unlink(filePath,(err:any)=>{
        if(err){
            console.log(err);
        }

    })
}

export default DeleteFile;