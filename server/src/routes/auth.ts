import express from 'express'
const router = express.Router();
import {UsersRigister , UsersLogin, ResetPassword, ResetPassword2} from '../middlewares/validationSchema';
import authControler from '../controllers/authController';

//register
router.post('/register',UsersRigister(),authControler.registerUser);
//login
router.post('/login',UsersLogin(),authControler.loginUser);
//reset password
router.post('/reset-password',ResetPassword(),authControler.ResetPasswordToken);
//reset password
router.post('/reset-password/:token',ResetPassword2(),authControler.resetPassword);

//logout
router.get('/logout',authControler.Logout_GET);



//verify Email
router.put('/email_confirmation/:token',authControler.verifyEmail);






export default router;




