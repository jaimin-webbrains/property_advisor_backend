const propertyrouter = require("express").Router();
const property = require("../controller/property");
const { upload } = require('../Helper/multer')

propertyrouter.get(
    '/get_states',
    property.getAllStates
)
propertyrouter.post(
    '/add_states',
    property.addStates
)
propertyrouter.post(
    '/add_all_ts_data',
    upload.fields([
        { name: 'certFileName', maxCount: 1 },
        { name: 'certExtFileName', maxCount: 1 },
        { name: 'detailsFileName', maxCount: 1 },

    ]),
    property.addAllTsData
)
propertyrouter.get(
    '/get_all_ts_data',
    property.getAllTsData
)
propertyrouter.get(
    '/get_all_properties',
    property.getAllProperties
)
module.exports = propertyrouter;