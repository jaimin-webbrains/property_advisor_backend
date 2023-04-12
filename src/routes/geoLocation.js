const geoLocationRouter = require("express").Router();
const geoLocationController = require('../controller/geoLocation')

geoLocationRouter.get(
    '/get_states',
    geoLocationController.getAllStates
)
geoLocationRouter.post(
    '/add_states',
    geoLocationController.addStates
)

module.exports = geoLocationRouter