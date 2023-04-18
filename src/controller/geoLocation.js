const StateSchema = require("../models/geolocation/stateSchema")
const responseHandler = require("../Helper/responseHandler")
const CitySchema = require("../models/geolocation/citySchema");
const ZoneSchema = require("../models/geolocation/zoneSchema");
const ObjectId = require('mongoose').Types.ObjectId; 


class GeolocationController{
    constructor(){}
    async getAllStates(req, res) {
        try {
            const response = await StateSchema.find({status:true})
            return responseHandler.successResponse(res, 200, 'States obtained!', response)
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async addState(req, res) {
        try {
            if (req.body.name !== undefined ) {
                const isStateExists = await StateSchema.exists({name:req.body.name})
                if(isStateExists)return responseHandler.errorResponse(res,400,'Already exists!')
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
    async updateState(req,res) {
        try {
            const { id, name } = req.body
            if (id !== undefined && name !== undefined) {
                const exist_state = await StateSchema.findById(id)
                if (exist_state) {
                    exist_state.name = name
                    const response = await exist_state.save()
                    responseHandler.successResponse(res, 201, "State updated", response)
                } else {
                    responseHandler.errorResponse(res, 400, "State doesn't exist!")
                }
            } else {
                responseHandler.errorResponse(res, 400, "Id and name is required!")
            }
        } catch (error) {
            responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async deleteState(req,res) {
        try {
            const { id } = req.body
            if (id !== undefined) {
                const exist_state = await StateSchema.findById(id)
                if (exist_state) {
                    exist_state.status = false
                    const response = await exist_state.save()
                    await CitySchema.updateMany({state: new ObjectId(id)},{status:false})
                    responseHandler.successResponse(res, 201, "State deleted", response)
                } else {
                    responseHandler.errorResponse(res, 400, "State doesn't exist!")
                }
            } else {
                responseHandler.errorResponse(res, 400, "Id and name is required!")
            }
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async getAllCities(req, res) {
        try {
            let response
            let {id} = req.query
            if(id !== 'undefined'){
                response = await CitySchema.find({state : new ObjectId(id),status:true}).populate('state').sort({"name":"asc"})
            }else{
                response = await CitySchema.find({status:true}).populate('state').sort({"name":"asc"})
            }
            return responseHandler.successResponse(res, 200, 'States obtained!', response)
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message)
        }
    }
    async addOrUpdateCity(req,res) {
        try {
            let cityData
            const {name, state,_id} = req.body
            let stateIs = state
            if(typeof(state) !== 'string'){
                stateIs = state.name
            }
            const stateData = await StateSchema.findOne({name:stateIs})
            if(!name || !stateData) return responseHandler.errorResponse(res,400,'city and state is required!')
            if(_id){
                cityData = await CitySchema.findOne({_id : new ObjectId(_id)})
                if(!cityData){
                    return responseHandler.errorResponse(res,400,'No data found!')
                }
                cityData.name = name
                cityData.state = stateData
                cityData.updatedAt = new Date()
            }
            else{
                cityData = new CitySchema({
                    name: name,
                    state: stateData
                })
            }
            
            const response = await cityData.save()
            return responseHandler.successResponse(res,201,'Created!',response)
        } catch (error) {
            return responseHandler.errorResponse(res,500,error.message)
        }
    }
    async deleteCity(req,res) {
        try {
            const {id} = req.body
            if(!id) return responseHandler.errorResponse(res,400,'Id not found!')
            const cityData = await CitySchema.findOne({_id : new ObjectId(id)})
            if(!cityData) return responseHandler.errorResponse(res,400,'No data found!')
            cityData.status = false
            await cityData.save()
            return responseHandler.successResponse(res,200,'Item deleted!')
        } catch (error) {
            return responseHandler.errorResponse(res,500,error.message)
        }
    }

    async getZones(req,res){
        try {
            const {city} = req.query
            let response
            if(city){
                const cityData = await CitySchema.findOne({name:city})
                if(!cityData)return responseHandler.errorResponse(res,400,'City is not found!')
                response = await ZoneSchema.find({status:true,city:new ObjectId(cityData.id)}).populate(['city','state'])
                return responseHandler.successResponse(res,200,'Data obtained!',response)
            }
             response = await ZoneSchema.find({status:true}).populate(['city','state'])
            return responseHandler.successResponse(res,200,'Data obtained!',response)
        } catch (error) {
           return responseHandler.errorResponse(res,500,error.message) 
        }
    }
    async addOrUpdateZones(req,res){
        try {
            let {state,city,name,_id} = req.body
            let zoneData
            if(_id){
                zoneData = await ZoneSchema.findOne({_id: new ObjectId(_id)})
                if(!zoneData)return responseHandler.errorResponse(res,400,'No data found!')
            }else{
                zoneData = new ZoneSchema()
            }
            if(!state || !city)return responseHandler.errorResponse(res,400,'State and city is required!')
            if(!name || name === "")return responseHandler.errorResponse(res,400,'Name is required!')
            if(typeof(state) === 'string'){
                state = await StateSchema.findOne({name:state})
            }
            if(typeof(city) === 'string'){
                city = await CitySchema.findOne({name:city})
            }
            zoneData.name = name
            zoneData.state = state
            zoneData.city = city
            zoneData.updatedAt = new Date()
            const response = await zoneData.save()
            return responseHandler.successResponse(res,201,'Created!',response)
        } catch (error) {
            return responseHandler.errorResponse(res,500,error.message)
        }
    }

    async deleteZone(req,res){
        try {
            const {_id} = req.body
            if(!_id)return responseHandler.errorResponse(res,400,'Id is required!')
            const zoneData = await ZoneSchema.findOne({_id : new ObjectId(_id)})
            if(!zoneData)return responseHandler.errorResponse(res,400,'No data foound!')
            zoneData.status = false
            const response = await zoneData.save()
            return responseHandler.successResponse(res,200,'Zone deleted!',response)
        } catch (error) {
            return responseHandler.errorResponse(res,500,error.message)
        }
    }
}
module.exports = new GeolocationController()