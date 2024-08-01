import { Request, Response } from 'express';
import codeController from './service/code.controller';
import commonController from './common/common.controller';
import { sign, verify } from 'crypto';
// import userController from "../controllers/user.controller";
import { body } from 'express-validator';
class UserController {
    async register(req: Request, res: Response) {
        try {
            const {phoneId } = req.body;

                await codeController.addNewUser({
                 phoneId
                }, res)
            
        } catch (e) {
            console.log(e)
            commonController.errorMessage("user not register", res)
        }
    }



    async login(req: Request, res: Response) {
        try {
            const { Email, password } = req.body;
            await codeController.loginUser({
                Email, password

            }, res)
        } catch (e) {
            commonController.errorMessage("user not login", res)

        }
    }

    // update password 
    async updatepassword(req,res){
        var phoneId=req?.user?.phoneId
        const {password,Email,UserpackId,fromDate,toDate} =req.body;
        try{
            await codeController.updatePassword({
                password,phoneId,UserpackId,Email,fromDate,toDate
            },res)
    
        }catch(Error){
            commonController.errorMessage("occured error",res)
            
        }
       
    }

    // verify email
    async verifyMail(req,res){
        var phoneId=req?.user?.phoneId
        const {Email} =req.body;
        try{
            await codeController.verifyMail({
            phoneId,Email
            },res)
    
        }catch(Error){
            commonController.errorMessage("occured error",res)
            
        }
       
    }

    // delete account
    async delete(req,res){
        var phoneId=req?.user?.phoneId
   
        try{
            await codeController.deleteAccount({
            phoneId
            },res)
    
        }catch(Error){
            commonController.errorMessage("occured error",res)
            
        }
       
    }

    
    // get profile
async getUser(req,res){
    var phoneId=req?.user?.phoneId
    try{
        await codeController.getuser({
        phoneId
        },res)

    }catch(Error){
        commonController.errorMessage("occured error",res)
        
    }

}

async data(req,res){
    const{email}=req.body;
    await codeController.data({
     email
    },res)
}

async otp(req,res){
    const {phoneId,otpValue} =req.body
    try{
await codeController.otp({
    phoneId,otpValue
},res)
    }catch(err){
        commonController.errorMessage("occured error",res)
    }
}

}




export default new UserController();