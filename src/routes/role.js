const role = require("../controller/role")

const RoleRouter = require("express").Router()

RoleRouter.post(
    '/add_role',
    role.addRole
)

RoleRouter.get(
    '/get_role',
    role.getRole
)

RoleRouter.post(
    '/update_role',
    role.updateRole
)

RoleRouter.delete(
    '/delete_role',
    role.deleteRole
)
module.exports = RoleRouter