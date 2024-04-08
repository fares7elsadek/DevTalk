const nodemailer = require('nodemailer');
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
   }
});


export default transporter;