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
propertyrouter.get(
    '/get_tracks_by_rera_number_or_pa_id',
    property.getTracksByReraNumberOrPaId
)
propertyrouter.get(
    '/get_all_rera_details_by_rera_number',
    property.getReraDetailsByNumber
)
propertyrouter.get(
    '/get_property_details_by_rera_number',
    property.getPropertyDetailsByReraNumber
)
propertyrouter.post(
    '/update_property_pa_id',
    property.updateTrackPaId
)
module.exports = propertyrouter;