const user = require("../controller/user")
const { getUser } = require("../utils/jwt.utils")

const userRouter = require("express").Router()

userRouter.post(
    '/add_user',
    getUser,
    user.addUser
)
userRouter.get(
    '/get_user',
    getUser,
    user.getUser
)
userRouter.post(
    '/delete_user',
    getUser,
    user.deleteUser
)
userRouter.post(
    '/update_user',
    getUser,
    user.updateUser
)
module.exports = userRouter