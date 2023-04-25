const { default: mongoose } = require("mongoose");
const responseHandler = require("../Helper/responseHandler");
const User = require("../models/userSchema");
const RoleSchema = require("../models/role");
const bcrypt = require('bcryptjs');
const sendAccessKeyEmailTemplate = require("../mailHandler/sendAccessKeyEmailTemplate");
const emailHandler = require("../mailHandler/emailHandler");
const { ROLE_ADMIN } = require("../Helper/constants");
const ObjectId = require('mongoose').Types.ObjectId; 


class userController {
    constructor() { }

    async addUser(req, res) {
        try {
            const { name, mobile, email, role } = req.body
            const existUser = await User.exists({ 'email': email })
            if (existUser === null) {
                var length = 8,
                    charset =
                        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    password = "";
                for (var i = 0, n = charset.length; i < length; ++i) {
                    password += charset.charAt(Math.floor(Math.random() * n));
                }
                const roleData = await RoleSchema.find({name:role})
                const payload = {
                    name: name,
                    mobile: parseInt(mobile),
                    email: email,
                    role: roleData[0],
                    password: await bcrypt.hash(password, 10)
                }
                const newUser = new User(payload)
                const resetLink = `${process.env.FRONTEND_URL}/forgotPassword`
                const response = await newUser.save()
                delete response._doc.password
                const msg = sendAccessKeyEmailTemplate.MailSent({
                    username: name,
                    email: email,
                    resetLink: resetLink,
                    password: password,
                });
                const subject = "Login Credentials";
                await emailHandler.sendEmail(
                    email,
                    msg,
                    subject,
                );
                return responseHandler.successResponse(res, 201, 'User created. Credentials sent to user email.',response)
            } else {
                return responseHandler.errorResponse(res, 500, 'User already exists!')
            }
        } catch (error) {
            if (error.name === "ValidationError") {
                let errors = {};

                Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
                });
                return responseHandler.errorResponse(res, 400, errors)
            }
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async getUser(req, res) {
        try {
            const roleData = await RoleSchema.findOne({name:ROLE_ADMIN})
            return responseHandler.successResponse(res, 200, 'Data obtaained!', await User.find({status:true,role : {$ne : new ObjectId(roleData.id)}},{password:0}).populate("role"))
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async deleteUser(req, res) {
        try {
            const { _id } = req.body
            if (_id !== undefined) {
                const exist_user = await User.findById(_id)
                if (exist_user) {
                    exist_user.status = false
                    const response = await exist_user.save()
                    responseHandler.successResponse(res, 201, "Status updated", response)
                } else {
                    responseHandler.errorResponse(res, 400, "Status doesn't exist!")
                }
            } else {
                responseHandler.errorResponse(res, 400, "Id is required!")
            }
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async updateUser(req, res) {
        try {
            const { _id } = req.body
            if (_id) {
                req.body.mobile = parseInt(req.body.mobile)
                const roleData = await RoleSchema.find({name:req.body.role}) 
                req.body.role = roleData[0]
                const response = await User.findByIdAndUpdate(_id, req.body,{new:true})
                delete response._doc.password
                return responseHandler.successResponse(res,201,"Data updated!",response)
            }
            return responseHandler.errorResponse(res, 400, "Id is required!")
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
}
module.exports = new userController()