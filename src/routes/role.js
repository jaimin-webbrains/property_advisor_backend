const role = require("../controller/role")
const { getUser } = require("../utils/jwt.utils");
const RoleRouter = require("express").Router()

RoleRouter.post(
    '/add_role',
    getUser,
    role.addRole
)

RoleRouter.get(
    '/get_role',
    getUser,
    role.getRole
)

RoleRouter.post(
    '/update_role',
    getUser,
    role.updateRole
)

RoleRouter.post(
    '/delete_role',
    getUser,
    role.deleteRole
)
module.exports = RoleRouter