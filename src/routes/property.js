const propertyrouter = require("express").Router();
const property = require("../controller/property");
const { upload } = require('../Helper/multer')
const { getUser } = require("../utils/jwt.utils");



propertyrouter.post(
    '/add_all_ts_data',
    getUser,
    upload.fields([
        { name: 'certFileName', maxCount: 1 },
        { name: 'certExtFileName', maxCount: 1 },
        { name: 'detailsFileName', maxCount: 1 },

    ]),
    property.addAllTsData
)
propertyrouter.post(
    '/add_all_new_ts_data',
    getUser,
    upload.fields([
        { name: 'certFileName', maxCount: 1 },
        { name: 'certExtFileName', maxCount: 1 },
        { name: 'detailsFileName', maxCount: 1 },
        { name: 'image', maxCount: 1 },
        { name: 'mainImage', maxCount: 1 },
    ]),
    property.addAllTsData
)
propertyrouter.get(
    '/get_all_ts_data',
    getUser,
    property.getAllTsData
)
propertyrouter.get(
    '/get_all_properties',
    getUser,
    property.getAllProperties
)
propertyrouter.get(
    '/get_tracks_by_rera_number_or_pa_id',
    getUser,
    property.getTracksByReraNumberOrPaId
)
propertyrouter.get(
    '/get_all_rera_details_by_rera_number',
    getUser,
    property.getReraDetailsByNumber
)
propertyrouter.get(
    '/get_property_details_by_rera_number',
    getUser,
    property.getPropertyDetailsByReraNumber
)
propertyrouter.post(
    '/update_property_pa_id',
    getUser,
    property.updateTrackPaId
)
propertyrouter.post(
    '/bulk_add_properties',
    getUser,
    upload.fields([
        { name: 'bulkfile', maxCount: 1 },
    ]),
    property.bulkAddProperties
)
module.exports = propertyrouter;