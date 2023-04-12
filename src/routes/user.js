const user = require("../controller/user")
const { getUser } = require("../utils/jwt.utils")

const userRouter = require("express").Router()

userRouter.post(
    '/add_user',
    user.addUser
)
userRouter.get(
    '/get_user',
    user.getUser
)
userRouter.delete(
    '/delete_user',
    user.deleteUser
)
userRouter.post(
    '/update_user',
    user.updateUser
)
module.exports = userRouter