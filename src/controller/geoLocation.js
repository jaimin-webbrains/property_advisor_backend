const StateSchema = require("../models/geolocation/stateSchema");
const responseHandler = require("../Helper/responseHandler");
const CitySchema = require("../models/geolocation/citySchema");
const ZoneSchema = require("../models/geolocation/zoneSchema");
const DistrictSchema = require("../models/geolocation/districtSchema");
const LocationSchema = require("../models/geolocation/locationSchema");
const SubLocationSchema = require("../models/geolocation/subLocationSchema");
const LandMarkSchema = require("../models/geolocation/landmark");
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
        const isStateExists = await StateSchema.exists({
          name: req.body.name.trim(),
          status: true,
        });
        if (isStateExists)
          return responseHandler.errorResponse(res, 400, "Already exists!");
        const stateSchema = new StateSchema({
          name: req.body.name.trim(),
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
          exist_state.name = name.trim();
          exist_state.description = description;
          const response = await exist_state.save();
          return responseHandler.successResponse(
            res,
            201,
            "State updated",
            response
          );
        } else {
          return responseHandler.errorResponse(
            res,
            400,
            "State doesn't exist!"
          );
        }
      } else {
        return responseHandler.errorResponse(
          res,
          400,
          "Id and name is required!"
        );
      }
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
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
          return responseHandler.successResponse(
            res,
            201,
            "State deleted",
            response
          );
        } else {
          return responseHandler.errorResponse(
            res,
            400,
            "State doesn't exist!"
          );
        }
      } else {
        return responseHandler.errorResponse(
          res,
          400,
          "Id and name is required!"
        );
      }
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getAllCities(req, res) {
    try {
      let { district } = req.query;
      district = await DistrictSchema.find({ name: district.trim() });
      const response = await CitySchema.find({
        district: district,
        status: true,
      }).populate("state district");
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
      const { name, state, _id, description, district } = req.body;
      let stateIs = state;
      if (typeof state !== "string") {
        stateIs = state.name;
      }
      let districtData = district;
      if (typeof district === "string") {
        districtData = await DistrictSchema.findOne({ name: district.trim() });
      }
      const stateData = await StateSchema.findOne({ name: stateIs.trim() });
      if (!name || !stateData)
        return responseHandler.errorResponse(
          res,
          400,
          "city and state is required!"
        );
      if (_id) {
        cityData = await CitySchema.findOne({
          _id: new ObjectId(_id),
        }).populate("district");
        if (!cityData) {
          return responseHandler.errorResponse(res, 400, "No data found!");
        }
        cityData.name = name.trim();
        cityData.state = stateData;
        cityData.district = districtData;
        cityData.description = description;
        cityData.updatedAt = new Date();
      } else {
        const isExist = await CitySchema.exists({ name: name.trim() });
        if (isExist)
          return responseHandler.errorResponse(
            res,
            400,
            "City already exists."
          );
        cityData = new CitySchema({
          name: name.trim(),
          state: stateData,
          description: description,
          district: districtData,
        });
      }

      const response = await cityData.save();
      return responseHandler.successResponse(res, 201, "Created!", {
        response,
        district: cityData.district,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteCity(req, res) {
    try {
      const { id } = req.body;
      if (!id) return responseHandler.errorResponse(res, 400, "Id not found!");
      const cityData = await CitySchema.findOne({
        _id: new ObjectId(id),
      }).populate("district");
      if (!cityData)
        return responseHandler.errorResponse(res, 400, "No data found!");
      cityData.status = false;
      await cityData.save();
      return responseHandler.successResponse(res, 200, "Item deleted!", {
        district: cityData.district,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }

  async getZones(req, res) {
    try {
      const { city } = req.query;
      let response;
      if (city) {
        const cityData = await CitySchema.findOne({ name: city.trim() });
        if (!cityData)
          return responseHandler.errorResponse(res, 400, "City is not found!");
        response = await ZoneSchema.find({
          status: true,
          city: new ObjectId(cityData.id),
        }).populate("city state district");
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
      let { state, city, name, _id, description, district } = req.body;
      let zoneData;
      let districtData = district;
      if (typeof district === "string") {
        districtData = await DistrictSchema.findOne({ name: district.trim() });
      }
      if (_id) {
        zoneData = await ZoneSchema.findOne({ _id: new ObjectId(_id) });
        if (!zoneData)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        const isExist = await ZoneSchema.exists({
          name: name.trim(),
          status: true,
        });
        if (isExist)
          return responseHandler.errorResponse(
            res,
            400,
            "Zone already exists."
          );
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
        state = await StateSchema.findOne({ name: state.trim() });
      }
      if (typeof city === "string") {
        city = await CitySchema.findOne({ name: city.trim() });
      }
      zoneData.name = name.trim();
      zoneData.state = state;
      zoneData.city = city;
      zoneData.district = districtData;
      zoneData.description = description;
      zoneData.updatedAt = new Date();
      const response = await zoneData.save();
      return responseHandler.successResponse(res, 201, "Created!", {
        zoneData,
        city,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }

  async deleteZone(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const zoneData = await ZoneSchema.findOne({
        _id: new ObjectId(_id),
      }).populate("city");
      if (!zoneData)
        return responseHandler.errorResponse(res, 400, "No data foound!");
      zoneData.status = false;
      const response = await zoneData.save();
      return responseHandler.successResponse(res, 200, "Zone deleted!", {
        response,
        city: zoneData.city,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getDistricts(req, res) {
    try {
      const { state } = req.query;
      const stateData = await StateSchema.findOne({ name: state.trim() });
      const response = await DistrictSchema.find({
        status: true,
        state: stateData,
      }).populate("state");
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
      const { name, _id, description, state } = req.body;
      let dis_data;
      let stateData = state;
      if (typeof state === "string") {
        stateData = await StateSchema.findOne({ name: state.trim() });
        if (!stateData)
          return responseHandler.errorResponse(res, 400, "State is required!");
      }
      if (_id) {
        dis_data = await DistrictSchema.findOne({ _id: new ObjectId(_id) });
        if (!dis_data)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        const isExist = await DistrictSchema.exists({
          name: name.trim(),
          status: true,
        });
        if (isExist)
          return responseHandler.errorResponse(
            res,
            400,
            "District already exists."
          );
        dis_data = new DistrictSchema();
      }
      dis_data.name = name.trim();
      dis_data.state = stateData;
      dis_data.description = description;
      dis_data.updatedAt = new Date();
      const response = await dis_data.save();
      return responseHandler.successResponse(res, 201, "Success", {
        response,
        state,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteDistrict(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const dis_data = await DistrictSchema.findOne({
        _id: new ObjectId(_id),
      }).populate("state");
      if (!dis_data)
        return responseHandler.errorResponse(res, 400, "No data found!");
      dis_data.status = false;
      const response = await dis_data.save();
      return responseHandler.successResponse(res, 200, "Data deleted!", {
        state: dis_data.state,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getLandmarks(req, res) {
    try {
      let { subLocation } = req.query;
      if (typeof subLocation === "string") {
        subLocation = await SubLocationSchema.find({
          name: subLocation.trim(),
          status: true,
        });
      }
      const response = await LandMarkSchema.find({
        subLocation: subLocation,
        status: true,
      }).populate("state district city zone location subLocation");
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
  async add_or_update_landmark(req, res) {
    try {
      let {
        state,
        district,
        city,
        zone,
        location,
        subLocation,
        name,
        _id,
        description,
      } = req.body;
      if (typeof district === "string") {
        district = await DistrictSchema.findOne({ name: district.trim() });
      }
      let dis_data;
      if (_id) {
        dis_data = await LandMarkSchema.findOne({ _id: new ObjectId(_id) });
        if (!dis_data)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        const isExist = await LandMarkSchema.exists({
          name: name.trim(),
          status: true,
        });
        if (isExist)
          return responseHandler.errorResponse(
            res,
            400,
            "Sub district already exist."
          );
        dis_data = new LandMarkSchema();
      }
      dis_data.name = name.trim();
      dis_data.state =
        typeof state === "string"
          ? await StateSchema.findOne({ name: state })
          : state;
      dis_data.district = district;
      dis_data.city =
        typeof city === "string"
          ? await CitySchema.findOne({ name: city })
          : city;
      dis_data.zone =
        typeof zone === "string"
          ? await ZoneSchema.findOne({ name: zone })
          : zone;
      dis_data.location =
        typeof location === "string"
          ? await LocationSchema.findOne({ name: location })
          : location;
      dis_data.subLocation =
        typeof subLocation === "string"
          ? await SubLocationSchema.findOne({
              name: subLocation.trim(),
            })
          : subLocation;
      dis_data.description = description;
      dis_data.updatedAt = new Date();
      const response = await dis_data.save();
      return responseHandler.successResponse(res, 201, "Success", {
        response,
        subLocation: subLocation,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deletelandmark(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const dis_data = await LandMarkSchema.findOne({
        _id: new ObjectId(_id),
      }).populate("subLocation");
      if (!dis_data)
        return responseHandler.errorResponse(res, 400, "No data found!");
      dis_data.status = false;
      const response = await dis_data.save();
      return responseHandler.successResponse(res, 200, "Data deleted!", {
        response,
        subLocation: dis_data.subLocation,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async getLocations(req, res) {
    try {
      const { zone } = req.query;
      let response;
      let zoneData;
      if (zone) zoneData = await ZoneSchema.findOne({ name: zone });
      if (zoneData) {
        response = await LocationSchema.find({
          status: true,
          zone: zoneData,
        }).populate("state district city zone");
      } else {
        response = await LocationSchema.find({ status: true }).populate(
          "state city zone"
        );
      }

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
      let {
        name,
        description,
        state,
        city,
        zone,
        locationGrade,
        _id,
        district,
      } = req.body;
      let locationData;
      if (_id) {
        locationData = await LocationSchema.findOne({ _id: new ObjectId(_id) });
        if (!locationData)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        const isExist = await LocationSchema.exists({
          name: name.trim(),
          status: true,
        });
        if (isExist)
          return responseHandler.errorResponse(
            res,
            400,
            "Location already exists"
          );
        locationData = new LocationSchema();
      }
      if (typeof state === "string") {
        state = await StateSchema.findOne({ name: state });
        if (!state)
          return responseHandler.errorResponse(res, 400, "State is required!");
      }
      if (typeof city === "string") {
        city = await CitySchema.findOne({ name: city });
        if (!city)
          return responseHandler.errorResponse(res, 400, "City is required!");
      }
      if (typeof zone === "string") {
        zone = await ZoneSchema.findOne({ name: zone });
        if (!zone)
          return responseHandler.errorResponse(res, 400, "Zone is required!");
      }
      let districtData = district;
      if (typeof district === "string") {
        districtData = await DistrictSchema.findOne({ name: district });
      }
      locationData.name = name.trim();
      locationData.description = description;
      locationData.state = state;
      locationData.district = districtData;
      locationData.city = city;
      locationData.zone = zone;
      locationData.locationGrade = locationGrade;
      const response = await locationData.save();
      return responseHandler.successResponse(res, 201, "Success", {
        response,
        zone,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
  async deleteLocation(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return responseHandler.errorResponse(res, 400, "Id is required!");
      const loc_data = await LocationSchema.findOne({
        _id: new ObjectId(_id),
      }).populate("zone");
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
      const { location } = req.query;
      const locationData = await LocationSchema.findOne({ name: location });
      let response;
      if (location)
        response = await SubLocationSchema.find({
          location: locationData,
          status: true,
        }).populate("state district city zone location");
      else
        response = await SubLocationSchema.find({ status: true }).populate(
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
      let { name, description, state, city, zone, location, _id, district } =
        req.body;
      let sublocationData;
      if (_id) {
        sublocationData = await SubLocationSchema.findOne({
          _id: new ObjectId(_id),
        });
        if (!sublocationData)
          return responseHandler.errorResponse(res, 400, "No data found!");
      } else {
        const isExist = await SubLocationSchema.exists({
          name: name.trim(),
          status: true,
        });
        if (isExist)
          return responseHandler.errorResponse(
            res,
            400,
            "Sub location already exists."
          );
        sublocationData = new SubLocationSchema();
      }
      if (typeof state === "string") {
        state = await StateSchema.findOne({ name: state });
        if (!state)
          return responseHandler.errorResponse(res, 400, "State is required!");
      }
      if (typeof city === "string") {
        city = await CitySchema.findOne({ name: city });
        if (!city)
          return responseHandler.errorResponse(res, 400, "City is required!");
      }
      if (typeof zone === "string") {
        zone = await ZoneSchema.findOne({ name: zone });
        if (!zone)
          return responseHandler.errorResponse(res, 400, "Zone is required!");
      }
      if (typeof location === "string") {
        location = await LocationSchema.findOne({ name: location });
        if (!location)
          return responseHandler.errorResponse(
            res,
            400,
            "Location is required!"
          );
      }
      let districtData = district;
      if (typeof district === "string") {
        districtData = await DistrictSchema.findOne({ name: district });
      }
      sublocationData.name = name.trim();
      sublocationData.description = description;
      sublocationData.district = districtData;
      sublocationData.state = state;
      sublocationData.city = city;
      sublocationData.zone = zone;
      sublocationData.location = location;
      const response = await sublocationData.save();
      return responseHandler.successResponse(res, 201, "Success", {
        response,
        location,
      });
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
      }).populate("location");
      if (!loc_data)
        return responseHandler.errorResponse(res, 400, "No data found!");
      loc_data.status = false;
      const response = await loc_data.save();
      return responseHandler.successResponse(res, 200, "Data deleted!", {
        response,
      });
    } catch (error) {
      return responseHandler.errorResponse(res, 500, error.message);
    }
  }
}
module.exports = new GeolocationController();
