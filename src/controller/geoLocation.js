const StateSchema = require("../models/stateSchema")
const responseHandler = require("../Helper/responseHandler")

class GeolocationController{
    constructor(){}
    async getAllStates(req, res) {
        try {
            const response = await StateSchema.find({})
            return responseHandler.successResponse(res, 200, 'States obtained!', response)
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async addStates(req, res) {
        try {
            if (req.body.name !== undefined ) {
                const stateSchema = new StateSchema({ name: req.body.name, desc: req.body.desc })
                const response = await stateSchema.save()
                return responseHandler.successResponse(res, 201, 'State added !.', response)
            } else {
                return responseHandler.errorResponse(res, 400, "State name is required!")
            }
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
}
module.exports = new GeolocationController()