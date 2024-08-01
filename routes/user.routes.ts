import { verify } from 'crypto';
import express from 'express';

 import userController from "../controllers/user.controller";

 const multer = require("multer");
 var storage = multer.diskStorage({
  destination: function (req: any, file:any, cb: any){
    cb(null, "profile");
  },
  filename: function(req:any, file: any, cb: any) {
    cb(null, file.originalname + ".png");
  },
 });
 var upload = multer({
  storage:storage
 })
const router=express.Router();
 router.post("/sign-up",userController.register);
 router.post("/login-user",userController.login)

 router.post("/data",userController.data)
 router.post("/otp",userController.otp)

    

export default router;

