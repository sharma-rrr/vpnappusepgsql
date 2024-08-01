import { hash, hashSync } from 'bcryptjs';
import { Request, Response } from 'express';
let referralCodeGenerator = require('referral-code-generator');
var otpGenerator = require('otp-generator');
const QRCode = require('qrcode');
const multer = require('multer');

import { v4 as uuidv4 } from "uuid";

import bcryptjs = require("bcryptjs");
bcryptjs.genSalt(10, function (err, salt) {
    bcryptjs.hash("B4c0/\/", salt, function (err, hash) {
        // Store hash in your password DB.
    });
});


// var bcryptjs= require('bcryptjs');

import db from "../../models"
const MyQuery = db.sequelize;
const { QueryTypes } = require('sequelize');
const { SECRET_KEY } = require('../../appconfig')
const jwt = require('jsonwebtoken')
import commonController from '../common/common.controller';
import { body, Result } from 'express-validator';
import { exists } from 'fs';
import { Encrypt } from '../common/encryptpassword';
import { error } from 'console';
import { TokenExpiredError } from 'jsonwebtoken';
import e = require('express');
import { escape } from 'querystring';
// import { USE } from 'sequelize/types/lib/index-hints';
class CodeController {

    ///Section User Start
    async addNewUser(payload: any, res: Response) {
        const { phoneId } = payload;
        try {
            let user = await db.Users.findOne({ 
               where:{
                phoneId
               } 
             });
            if (user) {
                const token = jwt.sign(
                    { phoneId, id: user.id,isPaid:false },
                    process.env.TOKEN_SECRET as string,
                  
                );
                commonController.successMessage(token, "User login", res);
            } else {
                user = await db.Users.create({
                     phoneId
                     });
    
                const token = jwt.sign(
                    { phoneId, id: user.id,isPaid:false },
                    process.env.TOKEN_SECRET as string,
                    // { expiresIn: '1h' }
                );
                commonController.successMessage({user,token}, "User created successfully", res);
            }
        } catch (error) {
            console.log(error,"error");
            commonController.errorMessage("An error occurred: " , res);
        }
    }


    
    // login user
    async loginUser(payload: any, res: Response) {
        const { Email, password} = payload;
        console.log(payload, "pa");
        try {
            
            const checkdata = await db.Users.findOne({
                where: {
                     Email
                     }
            });
            if (!checkdata) {
                return commonController.errorMessage("Email and password do not match", res);
            }
    
            const isPasswordValid = await Encrypt.comparePassword(password.toString(), checkdata.password.toString());
            if (!isPasswordValid) {
                return commonController.errorMessage("Invalid details", res);
            }

            const token = jwt.sign({ Email }, process.env.TOKEN_SECRET);
            return commonController.successMessage(token, "User login successful", res);
        } catch (err) {
            console.error("Error during login:", err);
            return commonController.errorMessage("An error occurred during login", res);
        }
    }
    

    // update - password
    async updatePassword(payload: any, res: Response) {
        const { password, UserpackId, phoneId, Email ,fromDate,toDate} = payload;
        try {
            const user = await db.Users.findOne({
                where: { 
                    phoneId 
                }
            });
    
            if (!user) {
                return commonController.errorMessage("User not found", res);
            }
            const hashedPassword = await bcryptjs.hash(password, 10);
            await user.update({
                password: hashedPassword,
                Email,
                UserpackId,
                fromDate,
                toDate
            });
            const token = jwt.sign(
                { Email, UserpackId, user: user.id,isPaid:true  },
                process.env.TOKEN_SECRET as string,
                 );
            commonController.successMessage({ user, token }, "Password updated successfully", res);
        } catch (error) {
            console.log(error, "errr");
            commonController.errorMessage("An error occurred: " ,res);
        }
    }
    

    // verify email
    async verifyMail(payload:any,res:Response){
        const{ Email,phoneId} =payload;
        try{
            const user =await db.Users.findOne({
                where:{
                    phoneId
                }
            })
            if(!user){
                commonController.errorMessage("user phoneid now exist",res)
            }else if(user.Email === Email ){
                commonController.successMessage({},"email verify succssfuly",res)
            }else{
                commonController.errorMessage("Invalid Email",res)
            }
        }catch(error){
            commonController.errorMessage("occured error",res)
        }

    }

  

    // delete accout
    async deleteAccount(payload: any, res: Response) {
        const { phoneId } = payload;
        try {
            const userAccount = await db.Users.findOne({
                where: {
                    phoneId
                }
            });
    
            if (!userAccount) {
                return commonController.errorMessage("Useraccount not found", res);
            }
              await userAccount.destroy();
           commonController.successMessage({},"User account deleted successfully",res)
        } catch (err) {
            console.error("Error occurred:", err); 
            commonController.errorMessage("An error occurred", res);
        }
    }
    
  
    // get - profile
   async getuser(payload:any,res:Response){
    const {phoneId} =payload;
    try{
        const sql = `SELECT * FROM users WHERE phoneId = ${phoneId}`;
       const data = await MyQuery.query(sql, { type: QueryTypes.SELECT });
        commonController.successMessage(data,"get data sucefully",res)
    }catch(error){
        commonController.errorMessage("occured error",res)
    }
   }



   async data(payload: any, res: Response) {
    const { email ,} = payload;
    try {
        const cars = [
            {
                "color": "purple",
                "type": "minivan",
                "registration": new Date('2017-01-03'),
                "capacity": 7
            },
        ];

        console.log(typeof cars, "cars.......,,,,.,.");
        for (let i = 0; i < cars.length; i++) {
            console.log("sghsgh", i); // Log the index directly

             if (cars[i].type === "minivan" && cars[i].capacity === 7) {    
                console.log("yes here hishjhsjdhsjhdjs");
            } else if (cars[i].color === "purple") {
                console.log("yes");
                cars[i].color = "red";
                console.log("yes, here is color red");
            } 
        }
    } catch (err) {
        console.log(err,"err");
        commonController.errorMessage("occurred error", res);
    }
}



async otp(payload:any,res:Response){
    const {phoneId,otpValue} =payload;
    try{
        const user =await db.Users.findOne({
            where:{
                phoneId
            }
        })
     if(!user){
        commonController.errorMessage("user not found",res)
     }else{
          const a =commonController.generateOtp();
        const otp =await db.UserOtps.create({
            otpValue:a,userId:user.id
        })
        commonController.successMessage(a," hfjhjhfjhj",res)
     }
    }catch(err){
        commonController.errorMessage("occured error",res)
    }
}



   
 
}
  
  

export default new CodeController();
// export default new hello();
