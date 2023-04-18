const auth = require("../controller/auth");
const { getUser } = require("../utils/jwt.utils");
const authRouter = require("express").Router();

authRouter.post(
    '/login',
    auth.login
)

authRouter.post(
    '/reset_password',
    getUser,
    auth.resetPassword
)

authRouter.post(
    '/forgot_password',
    auth.forgotPassword
)

authRouter.post(
    '/reset_password_check_otp',
    auth.checkOtpForResetPassword
)

authRouter.post(
    '/reset_forgotted_password',
    auth.resetForgottedPassword
)

module.exports = authRouter