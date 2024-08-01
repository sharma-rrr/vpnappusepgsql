import { verify } from 'crypto';
import express from 'express';

 import userController from "../controllers/user.controller";
 

const router=express.Router();
// update password
router.post("/Update-Password",userController.updatepassword);
// verify email
router.post("/verify-Email",userController.verifyMail);

router.post("/delete-account",userController.delete);
   
// get profile data
router.post("/get-Profile",userController.getUser);





  
export default router;  