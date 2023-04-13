const { default: mongoose } = require("mongoose")
const responseHandler = require("../Helper/responseHandler")
const Role = require("../models/role")

class RoleController {
    constructor() { }

    async addRole(req, res) {
        try {
            if (req.body.name !== undefined && req.body.name !== "") {
                const { name, desc } = req.body
                const isExist = await Role.exists({name:name})
                if(isExist){
                    return responseHandler.errorResponse(res,400,'Role already exists')
                }
                const role = new Role({ name, desc })
                const response = await role.save()
                return responseHandler.successResponse(res, 201, "Role created", response)
            } else {
                return responseHandler.errorResponse(res, 400, "Role name is required!")
            }
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }

    async getRole(req, res) {
        try {
            responseHandler.successResponse(res, 200, "Data obtained!", await Role.find({'status':true}).select({_id:1,name:1}))
        } catch (error) {
            responseHandler.errorResponse(res, 500, error.message)
        }
    }

    async updateRole(req, res) {
        try {
            const { id, name } = req.body
            if (id !== undefined && name !== undefined) {
                const exist_role = await Role.findById(id)
                if (exist_role) {
                    exist_role.name = name
                    const response = await exist_role.save()
                    responseHandler.successResponse(res, 201, "Role updated", response)
                } else {
                    responseHandler.errorResponse(res, 400, "Role doesn't exist!")
                }
            } else {
                responseHandler.errorResponse(res, 400, "Id and name is required!")
            }
        } catch (error) {
            responseHandler.errorResponse(res, 500, error.message)
        }
    }

    async deleteRole(req, res) {
        try {
            const { id } = req.body
            if (id !== undefined) {
                const exist_role = await Role.findById(id)
                if (exist_role) {
                    exist_role.status = false
                    const response = await exist_role.save()
                    responseHandler.successResponse(res, 201, "Role updated", response)
                } else {
                    responseHandler.errorResponse(res, 400, "Role doesn't exist!")
                }
            } else {
                responseHandler.errorResponse(res, 400, "Id and name is required!")
            }
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
}
module.exports = new RoleController()