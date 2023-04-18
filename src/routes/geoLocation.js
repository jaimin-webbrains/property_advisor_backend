const geoLocationRouter = require("express").Router();
const geoLocationController = require('../controller/geoLocation')

geoLocationRouter.get(
    '/get_states',
    geoLocationController.getAllStates
)
geoLocationRouter.post(
    '/add_states',
    geoLocationController.addState
)
geoLocationRouter.post(
    '/update_states',
    geoLocationController.updateState
)
geoLocationRouter.delete(
    '/delete_state',
    geoLocationController.deleteState
)
geoLocationRouter.get(
    '/get_cities',
    geoLocationController.getAllCities
)
geoLocationRouter.post(
    '/add_or_update_city',
    geoLocationController.addOrUpdateCity
)
geoLocationRouter.delete(
    '/delete_city',
    geoLocationController.deleteCity
)
geoLocationRouter.get(
    '/get_zones',
    geoLocationController.getZones
)
geoLocationRouter.post(
    '/add_or_update_zone',
    geoLocationController.addOrUpdateZones
)
geoLocationRouter.delete(
    '/delete_zone',
    geoLocationController.deleteZone
)

module.exports = geoLocationRouter