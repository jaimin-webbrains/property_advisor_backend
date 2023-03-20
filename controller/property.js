const PropertySchema = require('../models/propertyschema')
const StateSchema = require('../models/stateSchema')
const TsSchema = require('../models/tsSchema')
const XLSX = require('xlsx');
const propertyservice = require('../services/propertyservice')
const path = require('path')


class PropertyController {
    constructor() { }

    async getAllStates(req, res) {
        const response = await StateSchema.find({})
        res.status(200).send({
            success: true,
            message: 'States obtained !',
            data: response
        })
    }

    async addStates(req, res) {
        try {
            let req_data = req.body.state
            if (req_data !== undefined && req_data !== "") {
                const stateSchema = new StateSchema({ state_name: req_data })
                const response = await stateSchema.save()
                res.status(201).send({
                    success: true,
                    message: 'State added !.',
                    data: response
                })
            } else {
                res.status(400).send("City name is required!");
            }
        } catch (error) {
            res.status(500).send("Something went wrong");
        }
    }

    async addFile(req, res) {
        try {
            const response = await propertyservice.getAllPropertyDetails(req)
            res.status(201).send({
                success: true,
                message: 'Date imported from excel successfully.',
                data: response
            })
        } catch (error) {
            res.status(500).send("Something went wrong");

        }
    }

    async addAllTsData(req, res) {
        try {
            const is_existing_details_file = await TsSchema.find({ 'reraNumber': req.body.reraNumber, 'detailsFileName': path.resolve() + '/uploads/' + req.files.detailsFileName[0].filename })
            if (is_existing_details_file.length > 0) {
                return res.status(400).send({ message: `File already exist with rera no: ${req.body.reraNumber} and this modified date.` });
            }
            else {
                const workbook = XLSX.readFile(path.resolve() + '/uploads/' + req.files.detailsFileName[0].filename);
                const sheet_name_list = workbook.SheetNames;
                const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" });
                if (xlData[0]['TelanganaRERA Application'] === undefined) {
                    return res.status(400).send({
                        success: false,
                        message: 'File has invalid data!.',
                    })
                }
                const response = await propertyservice.addAllTsData(req, xlData)
                res.status(201).send({
                    success: true,
                    message: 'TS data added successfully.',
                    data: response
                })
            }
        }
        catch (error) {
            if (error.name === "ValidationError") {
                let errors = {};

                Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
                });

                return res.status(400).send(errors);
            }
            res.status(500).send("Something went wrong");
        }
    }

    async getAllTsData(req, res) {
        const response = await TsSchema.find({})
        res.status(200).send({
            success: true,
            message: 'Data obtained !',
            data: response
        })
    }

    async getAllProperties(req, res) {
        const page = req.query && req.query.page ? req.query.page : 1
        // const response = await PropertySchema.find({}).populate('tracks_details')
        const response = await PropertySchema.aggregate([
            {
                $group: { 
                    _id: "$reraNumber", 
                    property: { $push: "$$ROOT" } }
            },
            {
                $lookup: {
                    from: "tracks",
                    localField: "_id",
                    foreignField: "reraNumber",
                    as: "track"
                }
            },
            {
                $facet: {
                    metadata: [
                        {
                             $count: "total" 
                        }, 
                        { $addFields: { 
                            page: parseInt(page) 
                            } 
                        }
                    ],
                    data: [
                        { 
                            $skip: (page - 1) * 10 
                        }, 
                        { 
                            $limit: 10 
                        }
                    ]
                }
            }
        ])
        res.status(200).send({
            success: true,
            message: 'Data obtained !',
            data: response
        })
    }
}

module.exports = new PropertyController()