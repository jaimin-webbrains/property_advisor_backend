const PropertySchema = require('../models/propertyschema')
const StateSchema = require('../models/stateSchema')
const TsSchema = require('../models/tsSchema')
const XLSX = require('xlsx');
const propertyservice = require('../services/propertyservice')
const path = require('path');
const propertyFieldHistorySchema = require('../models/propertyFieldHistorySchema');
const responseHandler = require('../Helper/responseHandler')



class PropertyController {
    constructor() { }

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
            let req_data = req.body.state
            if (req_data !== undefined && req_data !== "") {
                const stateSchema = new StateSchema({ state_name: req_data })
                const response = await stateSchema.save()
                return responseHandler.successResponse(res, 201, 'State added !.', response)
            } else {
                return responseHandler.errorResponse(res, 400, "State name is required!")
            }
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async addAllTsData(req, res) {
        try {
            //checking if data already present with same reraNumber and lastModifiedDate.
            const is_existing_details_file = await TsSchema.find({ 'reraNumber': req.body.reraNumber, 'detailsFileName': path.resolve() + '/uploads/' + req.files.detailsFileName[0].filename })
            if (is_existing_details_file.length > 0) {
                return responseHandler.errorResponse(res, 400, `File already exist with rera no: ${req.body.reraNumber} and this modified date.`)
            }
            else {
                //checking is already exist with same reraNumber.
                const isPresentWithSameReraNumber = await TsSchema.find({ 'reraNumber': req.body.reraNumber }).sort({ lastModifiedDate: -1 })
                if (isPresentWithSameReraNumber.length > 0) {
                    if (new Date(isPresentWithSameReraNumber[0]['_doc']['lastModifiedDate']) > new Date(req.body.lastModifiedDate)) {
                        return responseHandler.errorResponse(res, 400, `Please choose greater date than previous last modified date!.`)
                    }
                }
                //reading excel from specified path.
                const workbook = XLSX.readFile(path.resolve() + '/uploads/' + req.files.detailsFileName[0].filename);

                //taking th sheet.
                const sheet_name_list = workbook.SheetNames;

                //converting sheet to json.
                const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" });
                if (xlData[0]['TelanganaRERA Application'] === undefined) {
                    return responseHandler.errorResponse(res, 400, 'File has invalid data!.')
                }

                //converting req body data to tracks data payload.
                const response = await propertyservice.convertToTsPayload(req)

                const tsSchema = new TsSchema(response.payLoad)

                //saving track data to tracksSchema.
                const resp_data = await tsSchema.save()

                //converting excel json data to required format as per schema.
                const excel_data = await propertyservice.getAllPropertyDetails(xlData, resp_data)
                const propertySchema = new PropertySchema(excel_data.data)

                //saving property data to propertySchema.
                const res_data = await propertySchema.save()

                //if the data already present with the same rera number then
                if (isPresentWithSameReraNumber.length > 0 && isPresentWithSameReraNumber[0].id) {

                    //getting property data from propertySchema by tracks_details fields which is the id of track schema index.
                    const prev_proprty_data = await PropertySchema.find({ tracks_details: isPresentWithSameReraNumber[0].id })
                    if (prev_proprty_data.length > 0 && prev_proprty_data[0]['_doc']) {

                        //obtaining the old data by comparing old and new propertySchema details.
                        const prev_data = propertyservice.getTheNewChanges(res_data['_doc'], prev_proprty_data[0]['_doc'])

                        //obtaining the new data by comparing old and new propertySchema details.
                        const new_data = propertyservice.getTheNewChanges(prev_proprty_data[0]['_doc'], res_data['_doc'])

                        //saving history to historySchema.
                        const history = new propertyFieldHistorySchema({
                            reraNumber: req.body.reraNumber,
                            lastModifiedDate: req.body.lastModifiedDate,
                            history: {
                                prev_data: prev_data,
                                new_data: new_data,
                            }
                        })
                        await history.save()

                        //deleting the most recently property data ,just before this current data.
                        await PropertySchema.deleteOne({ '_id': prev_proprty_data[0].id })
                    }
                }
                return responseHandler.successResponse(res, 201, 'TS data added successfully.', { track_data: resp_data, property_data: res_data })
            }
        }
        catch (error) {
            if (error.name === "ValidationError") {
                let errors = {};

                Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
                });
                return responseHandler.errorResponse(res, 400, errors)
            }
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async getAllTsData(req, res) {
        try {
            const response = await TsSchema.find({})
            return responseHandler.successResponse(res, 200, 'Data Obtained !', response)
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async getAllProperties(req, res) {
        try {
            const page = req.query && req.query.page ? req.query.page : 1
            // getting data from propertySchema and grouping with historySchema by making common reraNumber
            // adding pagination and sorting by lastModifiedDate(descending) and removed unnecessary data from response.
            const response = await PropertySchema.aggregate([
                {
                    $lookup: {
                        from: "property_field_histories",
                        as: "history",
                        let: { i: "$reraNumber" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$reraNumber", "$$i"] } } },
                            { $project: { _id: 0, reraNumber: 0, __v: 0 } },
                            { $sort: { lastModifiedDate: -1 } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'tracks',
		 			 	localField: 'tracks_details',
		 			 	foreignField: '_id',
		 			 	as : "tracks_details"
                    }
                },
                { $project: { __v: 0 } },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            {
                                $addFields: {
                                    page: parseInt(page)
                                }
                            }
                        ],
                        data: [
                            { $skip: (page - 1) * 10 },
                            { $limit: 10 }
                        ]
                    }
                }
            ])
            return responseHandler.successResponse(res, 200, 'Data Obtained !', response)
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async getTracksByReraNumberOrPaId(req, res) {
        try {
            const num = req.query.num
            const response = await TsSchema.aggregate([
                { $match: { $or: [{ reraNumber: num }, { paId: parseInt(num) }] } },
                { $sort: { lastModifiedDate: -1 } }

            ]);
            return responseHandler.successResponse(res, 200, 'Data Obtained !', response)
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async getReraDetailsByNumber(req, res) {
        try {
            const reraNumber = req.query.reraNumber
            if (reraNumber !== "" && reraNumber !== undefined) {
                const response = await PropertySchema.find({ reraNumber: reraNumber }).select({
                    'tracks_details': 1,
                    'Promoter Information - Organization.Name': 1,
                    'Project address details.District': 1,
                    'Project address details.Mandal': 1,
                    'Project address details.Locality': 1,
                    'Project address details.Village/City/Town': 1,
                    'Land Details.Net Area(In sqmts)': 1,
                    'Built-Up Area Details': 1,
                }).populate('tracks_details', {
                    _id: 0,
                    state: 0,
                    detailsFileName: 0,
                    detailsURL: 0,
                    __v: 0
                })
                return responseHandler.successResponse(res, 200, 'Data Obtained !', response)
            }
            return responseHandler.errorResponse(res, 400, 'Rere number is required!!')
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async getPropertyDetailsByReraNumber(req,res) {
        try {
            const reraNumber = req.query.reraNumber
            const response = await PropertySchema.find({reraNumber:reraNumber}).populate('tracks_details')
            const histories = await propertyFieldHistorySchema.find({reraNumber:reraNumber})
            if(histories.length > 0){
                response[0]['_doc']['History'] = histories
            }
            return responseHandler.successResponse(res, 200, 'Data Obtained !', response)
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }

    async updateTrackPaId(req,res){
        const {reraNumber,paId} = req.body
        if(reraNumber === "" || reraNumber === undefined){
            return responseHandler.errorResponse(res, 400, 'reraNumber is required !!')
        }
        if(paId === "" || paId === undefined){
            return responseHandler.errorResponse(res, 400, 'PA ID is required !!')
        }
        const payLoad = await TsSchema.findOne({reraNumber:reraNumber}, null, { sort: { lastModifiedDate: -1 } })
        if(payLoad){
            payLoad.paId = paId
            const response = await payLoad.save()
            return responseHandler.successResponse(res, 200, 'Data updated !', response)
        }else{
            return responseHandler.errorResponse(res, 400, 'No data found by this rera number!!')
        }

    }
}

module.exports = new PropertyController()