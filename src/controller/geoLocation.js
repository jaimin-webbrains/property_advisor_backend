const StateSchema = require("../models/geolocation/stateSchema");
const responseHandler = require("../Helper/responseHandler");
const CitySchema = require("../models/geolocation/citySchema");
const ZoneSchema = require("../models/geolocation/zoneSchema");
const DistrictSchema = require("../models/geolocation/districtSchema");
const SubDistrictSchema = require("../models/geolocation/subDistrictSchema");
const LocationSchema = require("../models/geolocation/locationSchema");
const SubLocationSchema = require("../models/geolocation/subLocationSchema");
const ObjectId = require("mongoose").Types.ObjectId;

class GeolocationController {
  constructor() {}
  async getAllStates(req, res) {
    try {
      const response = await StateSchema.find({ status: true });
      return responseHandler.successResponse(
        res,
        200,
        "States obtained!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async addState(req, res) {
    try {
      if (req.body.name !== undefined) {
        const isStateExists = await StateSchema.exists({ name: req.body.name });
        if (isStateExists)
          return responseHandler.errorResponse(res, 400, "Already exists!");
        const stateSchema = new StateSchema({
          name: req.body.name,
          description: req.body.description,
        });
        const response = await stateSchema.save();
        return responseHandler.successResponse(
          res,
          201,
          "State added !.",
          response
        );
      } else {
        return responseHandler.errorResponse(
          res,
          400,
          "State name is required!"
        );
      }
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async updateState(req, res) {
    try {
      const { id, name, description } = req.body;
      if (id !== undefined && name !== undefined) {
        const exist_state = await StateSchema.findById(id);
        if (exist_state) {
          exist_state.name = name;
          exist_state.description = description;
          const response = await exist_state.save();
          responseHandler.successResponse(res, 201, "State updated", response);
        } else {
          responseHandler.errorResponse(res, 400, "State doesn't exist!");
        }
      } else {
        responseHandler.errorResponse(res, 400, "Id and name is required!");
      }
    } catch (error) {
      responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteState(req, res) {
    try {
      const { id } = req.body;
      if (id !== undefined) {
        const exist_state = await StateSchema.findById(id);
        if (exist_state) {
          exist_state.status = false;
          const response = await exist_state.save();
          await CitySchema.updateMany(
            { state: new ObjectId(id) },
            { status: false }
          );
          responseHandler.successResponse(res, 201, "State deleted", response);
        } else {
          responseHandler.errorResponse(res, 400, "State doesn't exist!");
        }
      } else {
        responseHandler.errorResponse(res, 400, "Id and name is required!");
      }
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getAllCities(req, res) {
    try {
      let response;
      let { id } = req.query;
      if (id !== "undefined") {
        if (ObjectId.isValid(id)) {
          response = await CitySchema.find({
            state: new ObjectId(id),
            status: true,
          })
            .populate("state")
            .sort({ name: "asc" });
        }
        if (!response) {
          const state = await StateSchema.findOne({ name: id, status: true });
          if (state) {
            response = await CitySchema.find({ state: state, status: true })
              .populate("state")
              .sort({ name: "asc" });
          }
        }
      } else {
        response = await CitySchema.find({ status: true })
          .populate("state")
          .sort({ name: "asc" });
      }
      return responseHandler.successResponse(
        res,
        200,
        "States obtained!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async addOrUpdateCity(req, res) {
    try {
      let cityData;
      const { name, state, _id, description } = req.body;
      let stateIs = state;
      if (typeof state !== "string") {
        stateIs = state.name;
      }
      const stateData = await StateSchema.findOne({ name: stateIs });
      if (!name || !stateData)
        return responseHandler.errorResponse(
          res,
          400,
          "city and state is required!"
        );
      if (_id) {
        cityData = await CitySchema.findOne({ _id: new ObjectId(_id) });
        if (!cityData) {
          return responseHandler.errorResponse(res, 400, "No data found!");
        }
        cityData.name = name;
        cityData.state = stateData;
        cityData.description = description;
        cityData.updatedAt = new Date();
      } else {
        cityData = new CitySchema({
          name: name,
          state: stateData,
          description: description,
        });
      }

      const response = await cityData.save();
      return responseHandler.successResponse(res, 201, "Created!", response);
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteCity(req, res) {
    try {
      const { id } = req.body;
      if (!id) return responseHandler.errorResponse(res, 400, "Id not found!");
      const cityData = await CitySchema.findOne({ _id: new ObjectId(id) });
      if (!cityData)
        return responseHandler.errorResponse(res, 400, "No data found!");
      cityData.status = false;
      await cityData.save();
      return responseHandler.successResponse(res, 200, "Item deleted!");
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }

  async getZones(req, res) {
    try {
      const { city } = req.query;
      let response;
      if (city) {
        const cityData = await CitySchema.findOne({ name: city });
        if (!cityData)
          return responseHandler.errorResponse(res, 400, "City is not found!");
        response = await ZoneSchema.find({
          status: true,
          city: new ObjectId(cityData.id),
        }).populate(["city", "state"]);
        return responseHandler.successResponse(
          res,
          200,
          "Data obtained!",
          response
        );
      }
      response = await ZoneSchema.find({ status: true }).populate([
        "city",
        "state",
      ]);
      return responseHandler.successResponse(
        res,
        200,
        "Data obtained!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async addOrUpdateZones(req, res) {
    try {
      let { state, city, name, _id, description } = req.body;
      let zoneData;
      if (_id) {
        zoneData = await ZoneSchema.findOne({ _id: new ObjectId(_id) });
        if (!zoneData)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        zoneData = new ZoneSchema();
      }
      if (!state || !city)
        return responseHandler.errorResponse(
          res,
          400,
          "State and city is required!"
        );
      if (!name || name === "")
        return responseHandler.errorResponse(res, 400, "Name is required!");
      if (typeof state === "string") {
        state = await StateSchema.findOne({ name: state });
      }
      if (typeof city === "string") {
        city = await CitySchema.findOne({ name: city });
      }
      zoneData.name = name;
      zoneData.state = state;
      zoneData.city = city;
      zoneData.description = description;
      zoneData.updatedAt = new Date();
      const response = await zoneData.save();
      return responseHandler.successResponse(res, 201, "Created!", response);
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }

  async deleteZone(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const zoneData = await ZoneSchema.findOne({ _id: new ObjectId(_id) });
      if (!zoneData)
        return responseHandler.errorResponse(res, 400, "No data foound!");
      zoneData.status = false;
      const response = await zoneData.save();
      return responseHandler.successResponse(
        res,
        200,
        "Zone deleted!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getDistricts(req, res) {
    try {
      const response = await DistrictSchema.find({ status: true });
      return responseHandler.successResponse(
        res,
        200,
        "Data obtained!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async add_or_update_district(req, res) {
    try {
      const { name, _id, description } = req.body;
      let dis_data;
      if (_id) {
        dis_data = await DistrictSchema.findOne({ _id: new ObjectId(_id) });
        if (!dis_data)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        dis_data = new DistrictSchema();
      }
      dis_data.name = name;
      dis_data.description = description;
      dis_data.updatedAt = new Date();
      const response = await dis_data.save();
      return responseHandler.successResponse(res, 201, "Success", response);
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteDistrict(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const dis_data = await DistrictSchema.findOne({ _id: new ObjectId(_id) });
      if (!dis_data)
        return responseHandler.errorResponse(res, 400, "No data found!");
      dis_data.status = false;
      const response = await dis_data.save();
      return responseHandler.successResponse(
        res,
        200,
        "Data deleted!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getSubDistricts(req, res) {
    try {
      const response = await SubDistrictSchema.find({ status: true }).populate(
        "district"
      );
      return responseHandler.successResponse(
        res,
        200,
        "Data obtained!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async add_or_update_sub_district(req, res) {
    try {
      let { district, name, _id, description } = req.body;
      if (typeof district === "string") {
        district = await DistrictSchema.findOne({ name: district });
      }
      let dis_data;
      if (_id) {
        dis_data = await SubDistrictSchema.findOne({ _id: new ObjectId(_id) });
        if (!dis_data)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        dis_data = new SubDistrictSchema();
      }
      dis_data.name = name;
      dis_data.district = district;
      dis_data.description = description;
      dis_data.updatedAt = new Date();
      const response = await dis_data.save();
      return responseHandler.successResponse(res, 201, "Success", response);
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteSubDistrict(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const dis_data = await SubDistrictSchema.findOne({
        _id: new ObjectId(_id),
      });
      if (!dis_data)
        return responseHandler.errorResponse(res, 400, "No data found!");
      dis_data.status = false;
      const response = await dis_data.save();
      return responseHandler.successResponse(
        res,
        200,
        "Data deleted!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getLocations(req, res) {
    try {
      const response = await LocationSchema.find({ status: true }).populate(
        "state city zone"
      );
      return responseHandler.successResponse(
        res,
        200,
        "Data obtained!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async add_or_update_location(req, res) {
    try {
      let { name, description, state, city, zone, locationGrade, _id } =
        req.body;
      let locationData;
      if (_id) {
        locationData = await LocationSchema.findOne({ _id: new ObjectId(_id) });
        if (!locationData)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        locationData = new LocationSchema();
      }
      if (typeof state === "string") {
        state = await StateSchema.findOne({ name: state });
        if (!state)
          responseHandler.errorResponse(res, 400, "State is required!");
      }
      if (typeof city === "string") {
        city = await CitySchema.findOne({ name: city });
        if (!city) responseHandler.errorResponse(res, 400, "City is required!");
      }
      if (typeof zone === "string") {
        zone = await ZoneSchema.findOne({ name: zone });
        if (!zone) responseHandler.errorResponse(res, 400, "Zone is required!");
      }
      locationData.name = name;
      locationData.description = description;
      locationData.state = state;
      locationData.city = city;
      locationData.zone = zone;
      locationData.locationGrade = locationGrade;
      const response = await locationData.save();
      return responseHandler.successResponse(res, 201, "Success", response);
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteLocation(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const loc_data = await LocationSchema.findOne({ _id: new ObjectId(_id) });
      if (!loc_data)
        return responseHandler.errorResponse(res, 400, "No data found!");
      loc_data.status = false;
      const response = await loc_data.save();
      return responseHandler.successResponse(
        res,
        200,
        "Data deleted!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getSubLocations(req, res) {
    try {
      const response = await SubLocationSchema.find({ status: true }).populate(
        "state city zone location"
      );
      return responseHandler.successResponse(
        res,
        200,
        "Data obtained!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async add_or_update_sub_location(req, res) {
    try {
      let { name, description, state, city, zone, location, _id } = req.body;
      let sublocationData;
      if (_id) {
        sublocationData = await SubLocationSchema.findOne({
          _id: new ObjectId(_id),
        });
        if (!sublocationData)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        sublocationData = new SubLocationSchema();
      }
      if (typeof state === "string") {
        state = await StateSchema.findOne({ name: state });
        if (!state)
          responseHandler.errorResponse(res, 400, "State is required!");
      }
      if (typeof city === "string") {
        city = await CitySchema.findOne({ name: city });
        if (!city) responseHandler.errorResponse(res, 400, "City is required!");
      }
      if (typeof zone === "string") {
        zone = await ZoneSchema.findOne({ name: zone });
        if (!zone) responseHandler.errorResponse(res, 400, "Zone is required!");
      }
      if (typeof location === "string") {
        location = await ZoneSchema.findOne({ name: zone });
        if (!location)
          responseHandler.errorResponse(res, 400, "Location is required!");
      }
      sublocationData.name = name;
      sublocationData.description = description;
      sublocationData.state = state;
      sublocationData.city = city;
      sublocationData.zone = zone;
      sublocationData.location = location;
      const response = await sublocationData.save();
      return responseHandler.successResponse(res, 201, "Success", response);
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteSubLocation(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const loc_data = await SubLocationSchema.findOne({
        _id: new ObjectId(_id),
      });
      if (!loc_data)
        return responseHandler.errorResponse(res, 400, "No data found!");
      loc_data.status = false;
      const response = await loc_data.save();
      return responseHandler.successResponse(
        res,
        200,
        "Data deleted!",
        response
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
}
module.exports = new GeolocationController();
