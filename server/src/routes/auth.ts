import express from 'express'
const router = express.Router();
import {UsersRigister , UsersLogin} from '../middlewares/validationSchema';
import authControler from '../controllers/authController';

//register
router.post('/register',UsersRigister(),authControler.registerUser);
//login
router.post('/login',UsersLogin(),authControler.loginUser);
//verify Email
router.post('/email_confirmation/:token',authControler.verifyEmail);






export default router;




