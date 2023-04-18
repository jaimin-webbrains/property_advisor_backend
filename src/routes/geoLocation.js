const geoLocationRouter = require("express").Router();
const geoLocationController = require('../controller/geoLocation');
const { getUser } = require("../utils/jwt.utils");

geoLocationRouter.get(
    '/get_states',
    getUser,
    geoLocationController.getAllStates
)
geoLocationRouter.post(
    '/add_states',
    getUser,
    geoLocationController.addState
)
geoLocationRouter.post(
    '/update_states',
    getUser,
    geoLocationController.updateState
)
geoLocationRouter.post(
    '/delete_state',
    getUser,
    geoLocationController.deleteState
)
geoLocationRouter.get(
    '/get_cities',
    getUser,
    geoLocationController.getAllCities
)
geoLocationRouter.post(
    '/add_or_update_city',
    getUser,
    geoLocationController.addOrUpdateCity
)
geoLocationRouter.post(
    '/delete_city',
    getUser,
    geoLocationController.deleteCity
)
geoLocationRouter.get(
    '/get_zones',
    getUser,
    geoLocationController.getZones
)
geoLocationRouter.post(
    '/add_or_update_zone',
    getUser,
    geoLocationController.addOrUpdateZones
)
geoLocationRouter.post(
    '/delete_zone',
    getUser,
    geoLocationController.deleteZone
)

module.exports = geoLocationRouter