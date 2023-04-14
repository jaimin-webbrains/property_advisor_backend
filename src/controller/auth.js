const User = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt.utils');
const responseHandler = require("../Helper/responseHandler");
const OTPSchema = require("../models/otpSchema");
const emailHandler = require("../mailHandler/emailHandler");
const resetPasswordTemplate = require("../mailHandler/resetPasswordTemplate");
const RoleSchema = require("../models/role");
const ObjectId = require('mongoose').Types.ObjectId; 



class authController {
    constructor() { }
    async login(req, res) {
        try {
            if (!req.body.email && !req.body.password) {
                return responseHandler.errorResponse(res, 400, 'Email and password is required !')
            }
            const roleAdmin = await RoleSchema.findOne({name:'admin'})
            const user = await User.findOne({
                email: req.body.email,
                role: new ObjectId(roleAdmin.id)
            });
            if (user) {
                const isMatched = await bcrypt.compare(req.body.password, user.password);
                if (isMatched) {
                    const token = jwt.createToken({ _id: user._id });
                    const response = {
                        access_token: token,
                        token_type: 'Bearer',
                    }
                    return responseHandler.successResponse(res, 200, 'Success!', response)
                }
            }
            return responseHandler.errorResponse(res, 400, 'Invalid credentials or not admin role!')
        } catch (error) {
            return responseHandler.errorResponse(res, 400, error.message)
        }
    }

    async resetPassword(req, res) {
        try {
            if (!req.body.email && !req.body.curr_pass && !req.body.new_pass) {
                return responseHandler.errorResponse(res, 400, 'Email,old password and new password is required!!')
            }
            const user = await User.findOne({
                email: req.body.email
            });
            if (user) {
                const isMatched = await bcrypt.compare(req.body.curr_pass, user.password);
                if (isMatched) {
                    if (req.body.new_pass.length > 4) {
                        user.password = await bcrypt.hash(req.body.new_pass, 10)
                        await user.save()
                        return responseHandler.successResponse(res, 200, 'Success!')

                    }
                    return responseHandler.errorResponse(res, 400, 'New password should have minimum 5 character!')
                }
            }
            return responseHandler.errorResponse(res, 400, 'Invalid credentials!')
        } catch (error) {
            return responseHandler.errorResponse(res, 400, error.message)
        }
    }

    async forgotPassword(req,res){
        try {
            const {email} = req.body
            const user = await User.findOne({'email':email})
            if(user){
              let random_otp = Math.trunc(Math.random()*10000)
              const OTP_Payload = new OTPSchema({
                email: email,
                otp: random_otp,
                createdAt: new Date()
              })             
              await OTP_Payload.save()
              let msg = resetPasswordTemplate.MailSent({
                otp:random_otp
              });
              
               await emailHandler.sendEmail(
                email,
                msg,
                "Reset password",
              );
              return responseHandler.successResponse(res, 200,'OTP sent to your email.' )  
            }else{
                return responseHandler.errorResponse(res, 400,'Email not found!' )  
            }
        } catch (error) {
            return responseHandler.errorResponse(res, 400,error.message )  
        }
    }

    async checkOtpForResetPassword(req,res){
        try {
            const{otp,email} = req.body
            const isExist = await OTPSchema.findOne({email:email}).sort({'createdAt':-1})
            if(isExist && isExist.otp === parseInt(otp)){
                const createOtpDate = new Date(isExist.createdAt)
                const diffMs = (new Date() - createOtpDate)
                const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                if(diffMins <= 5){
                    return responseHandler.successResponse(res,200,'Success',{email:email})
                }else{
                    return responseHandler.errorResponse(res, 400,'OTP expired !')   
                }
            }else{
                return responseHandler.errorResponse(res, 400,'Invalid OTP!')   
            }
        } catch (error) {
            return responseHandler.errorResponse(res, 400,error.message )  
        }
    }

    async resetForgottedPassword(req,res){
        try{
            const {email,pass,conf_pass} = req.body
            if(pass !== conf_pass){
                return responseHandler.errorResponse(res, 400,'Both passwords are not matching!' )    
            }
            const user = await User.findOne({email:email})
            if(!user){
                return responseHandler.errorResponse(res, 400,'Invalid email!' )    
            }
            const hashedPassword = await bcrypt.hash(pass, 10);
            user.password = hashedPassword
            await user.save()
            return responseHandler.successResponse(res,200,'Password changed!')
        } 
        catch(error){
            return responseHandler.errorResponse(res, 400,error.message )   
        }      
    }
}

module.exports = new authController()