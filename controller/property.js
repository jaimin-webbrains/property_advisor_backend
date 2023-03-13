const StateSchema = require('../models/stateSchema')
const TsSchema = require('../models/tsSchema')
const propertyservice = require('../services/propertyservice')


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
            const response = await propertyservice.addAllTsData(req)
            res.status(201).send({
                success: true,
                message: 'TS data added successfully.',
                data: response
            })
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
}

module.exports = new PropertyController()