const path = require('path')
const const_fields = require('../Helper/constants');
const { ExcelSerialDateToJSDate } = require('../Helper/helper');
const _ = require('lodash');
require("dotenv").config();
const axios = require('axios');
const { json } = require('express');



const main_fields = const_fields.main_fields
const parent_keys = const_fields.parent_keys
const child_keys = const_fields.child_keys
const grand_child_keys = const_fields.grand_child_keys

const proper_data = new Map()
class PropertyServices {
  constructor() { }
  async dataConverter(key, values) {
    if (Array.isArray(values) && values.length > 1) {
      const curr_key = Object.keys(values[0])[0]
      //setting general information
      if (key === main_fields[0]) {
        const val_keys = const_fields.gen_info_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[0], converted_data)
      }
      //setting promoter information 
      if (key === main_fields[1]) {
        const val_keys = const_fields.prom_info_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[1], converted_data)
      }
      //setting address details. 
      if (key === main_fields[2]) {
        const val_keys = const_fields.address_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[2], converted_data)
      }
      // setting organization contact details.
      if (key === main_fields[3]) {
        const val_keys = const_fields.org_cont_details_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[3], converted_data)
      }
      //setting past experience details.
      if (key === main_fields[4]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[4], result)
      }
      //setting members details.
      if (key === main_fields[5]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[5], result)
      }
      //setting project information
      if (key === main_fields[6]) {
        let newObj = {}
        const proj_keys = const_fields.project_info_keys
        const curr_key = Object.keys(values[0])[0]

        for (let row = 0; row < values.length; row++) {
          if (proj_keys.includes(values[row][curr_key]) && values[row + 1] !== undefined && !proj_keys.includes(values[row + 1][curr_key])) {
            newObj[values[row][curr_key]] = values[row + 1][curr_key]
            if (values[row][curr_key] === 'Approved Date' || values[row][curr_key] === 'Proposed Date of Completion' || values[row][curr_key] === 'Revised Proposed Date of Completion' || values[row][curr_key] === 'Complition Date at the time of Registration in Telangana Rera') {
              newObj[values[row][curr_key]] = ExcelSerialDateToJSDate((values[row + 1][curr_key]) + 1)
            }
          }
          if (proj_keys.includes(values[row][curr_key]) && values[row + 1] !== undefined && proj_keys.includes(values[row + 1][curr_key])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
          if (values[row + 1] === undefined && proj_keys.includes(values[row][curr_key])) {
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set(main_fields[6], newObj)
      }
      // setting land details
      if (key === main_fields[7]) {
        const val_keys = const_fields.land_details_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[7], converted_data)
      }
      // setting built up information.
      if (key === main_fields[8]) {
        const val_keys = const_fields.build_up_details_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[8], converted_data)
      }
      //setting address information.
      if (key === main_fields[9]) {
        const val_keys = const_fields.address_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[9], converted_data)
      }
      //setting promoter details.
      if (key === main_fields[10]) {
        let ext_keys = Object.values(values[0])
        const ext_values = []
        let final_data = []
        for (let val in values) {
          if (((Object.values(values[val]))[0]) !== 'Project Name')
            ext_values.push(Object.values(values[val]))
        }
        for (let val = 0; val < ext_values.length; val++) {
          let newObj = {};
          for (let key = 0; key < ext_keys.length; key++) {
            newObj[ext_keys[key]] = ext_values[val][key]
          }
          final_data.push(newObj)
        }
        proper_data.set(main_fields[10], final_data)
      }
      // setting project details.
      if (key === main_fields[11]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[11], result)
      }
      //setting development work details.
      if (key === main_fields[12]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[12], result)
      }
      //setting building information
      if (key === main_fields[13]) {
        let ext_data = []
        let result = []
        for (let data in values) {
          if (Object.values(values[data])[0] !== 'Sr.No.')
            ext_data.push(Object.values(values[data]))
        }
        for (let row = 0; row < ext_data.length; row++) {
          if (ext_data[row][0] !== '' && ext_data[row][1] !== '') {
            let obj = {}
            for (let k_name = 0; k_name < parent_keys.length; k_name++) {
              obj[parent_keys[k_name]] = ext_data[row][k_name]
              if (parent_keys[k_name] === 'Proposed Date of Completion (As approved by Competent Authority)') {
                obj[parent_keys[k_name]] = ExcelSerialDateToJSDate(ext_data[row][k_name])
              }
            }
            result.push(obj)
          }
          if (ext_data[row][0] === '' && ext_data[row][1] === '' && ext_data[row][5] !== '' && ext_data[row][9] === '' && ext_data[row][10] === '') {
            try {
              if (result[result.length - 1]['floor_details'] === undefined) {
                result[result.length - 1]['floor_details'] = []
              }
            } catch (error) {
              result[result.length - 1]['floor_details'] = []
            }
            let obj = {}
            for (let k_name = 0; k_name < child_keys.length; k_name++) {
              if (ext_data[row][2] !== 'Sr.No.') {
                obj[child_keys[k_name]] = ext_data[row][k_name + 2]
                if (child_keys[k_name] === 'Mortgage Area') {
                  if (ext_data[row][k_name + 2] === 0) {
                    obj[child_keys[k_name]] = false
                  }
                  if (ext_data[row][k_name + 2] === 1) {
                    obj[child_keys[k_name]] = true
                  }
                }
              }
            }
            if (Object.keys(obj).length > 0) {
              result[result.length - 1]['floor_details'] = [...result[result.length - 1]['floor_details'], obj]
            }
          }
          if (ext_data[row][0] === '' && ext_data[row][1] === '' && ext_data[row][5] === '' && ext_data[row][6] === '' && ext_data[row][7] === '' && ext_data[row][8] === '' && ext_data[row][9] === '' && ext_data[row][10] === '') {
            if (result[result.length - 1]['task_details'] === undefined) {
              result[result.length - 1]['task_details'] = []
            }
            let obj = {}
            for (let k_name = 0; k_name < grand_child_keys.length; k_name++) {
              if (ext_data[row][2] !== 'Sr.No.') {
                obj[grand_child_keys[k_name]] = ext_data[row][k_name + 2]
              }
            }
            if (Object.keys(obj).length > 0) {
              result[result.length - 1]['task_details'] = [...result[result.length - 1]['task_details'], obj]
            }
          }
        }
        proper_data.set(main_fields[13], result)
      }
      // setting project professionals info.
      if (key === main_fields[14]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[14], result)
      }
      //setting uploaded doc info.
      if (key === main_fields[15]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[15], result)
      }
      //setting Promoter Information - Individual 
      if (key === main_fields[16]) {
        const val_keys = const_fields.prom_info_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[16], converted_data)
      }
      //setting Address For Official Communication. 
      if (key === main_fields[17]) {
        const val_keys = const_fields.address_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[17], converted_data)
      }
      // setting Contact Details.
      if (key === main_fields[18]) {
        const val_keys = const_fields.contact_details_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys, curr_key, values)
        proper_data.set(main_fields[18], converted_data)
      }
      //setting Other Organization Type Member Information
      if (key === main_fields[19]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[19], result)
      }
      //setting plot details
      if (key === main_fields[20]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[20], result)
      }
      //setting Litigations Details
      if (key === main_fields[21]) {
        const result = this.excelConvertRowsAndColumnsToArray(values)
        proper_data.set(main_fields[21], result)
      }
    }
  }
  async getAllPropertyDetails(xlData, tracks_data) {

    //taking a map to store the data after grouping.
    const dataMap = new Map()
    let current_key = 'General Information'

    //iteration on each row.
    for (let row = 1; row < xlData.length; row++) {

      //setting where the current row's data will be store in Map's key.
      if (main_fields.indexOf(xlData[row]['TelanganaRERA Application']) > -1) {
        current_key = xlData[row]['TelanganaRERA Application']
      }
      // if already present store then add data in it else create new store key in Map.
      if (current_key !== xlData[row]['TelanganaRERA Application']) {
        if (dataMap.has(current_key)) {
          if (current_key !== main_fields[2]) {
            dataMap.set(current_key, [...dataMap.get(current_key), xlData[row]])
          }
          if (current_key === main_fields[2]) {
            //there are two address details in some excel which has same key name.(address details)
            //categorizing it on the basis of row value and renaming to second one.
            if (row < 50) {
              dataMap.set(current_key, [...dataMap.get(current_key), xlData[row]])
            } else {
              if (dataMap.has('Project address details')) {
                dataMap.set('Project address details', [...dataMap.get('Project address details'), xlData[row]])
              } else {
                dataMap.set('Project address details', [xlData[row]])
              }
            }
          }
        } else {
          dataMap.set(current_key, [xlData[row]])
        }
      }
    }

    for (let field = 0; field < main_fields.length; field++) {
      // converting excel data to required json.
      this.dataConverter(main_fields[field], dataMap.get(main_fields[field]))
    }

    // converting Map to object.
    let response = Object.fromEntries(proper_data)
    response['reraNumber'] = tracks_data.reraNumber
    response['tracks_details'] = tracks_data.id
    proper_data.clear()
    return ({ 'data': response })
  }
  async convertToTsPayload(req) {
    const files = req.files
    const body = req.body
    const certExt = files.certExtFileName && files.certExtFileName[0] ? path.resolve() + '/uploads/' + files.certExtFileName[0].filename : ''
    const image = files.image && files.image[0] ? path.resolve() + '/uploads/' + files.image[0].filename : ""
    const mainImage = files.mainImage && files.mainImage[0] ? path.resolve() + '/uploads/' + files.mainImage[0].filename : ""

    // task details schema payload.
    const payload = {
      state: body.state,
      reraNumber: body.reraNumber,
      lastModifiedDate: body.lastModifiedDate,
      reraApprovedDate: body.reraApprovedDate,
      reraProjectStartDate: body.reraProjectStartDate,
      projectEndDate: body.projectEndDate,
      detailsURL: body.detailsURL,
      certFileName: path.resolve() + '/uploads/' + files.certFileName[0].filename,
      certExtFileName: certExt,
      detailsFileName: path.resolve() + '/uploads/' + files.detailsFileName[0].filename,
      paId: body.paId,
      city: body.city,
      location: body.location,
      subAreaName: body.subAreaName,
      propertyType: body.propertyType,
      colonyName: body.colonyName,
      sellerMobile : body.sellerMobile !== "" ? body.sellerMobile : 0 ,
      propertyInsert : body.propertyInsert,
      propertyStatus : body.propertyStatus,
      propertyFor : body.propertyFor,
      propertyCategory : body.propertyCategory,
      propertyName : body.propertyName,
      newsPaperName : body.newsPaperName,
      surveyBy : body.surveyBy,
      surveyDate : body.surveyDate ? body.surveyDate : 0,
      occupencyDate : body.occupencyDate ? body.occupencyDate : 0,
      propertySpoc : body.propertySpoc,
      gatedCommunityType : body.gatedCommunityType,
      propertyStatus2 : body.propertyStatus2,
      loanBanks : body.loanBanks,
      totalFloors : body.totalFloors ? body.totalFloors : 0,
      openSpaceArea : body.openSpaceArea ? body.openSpaceArea : 0,
      dataEntryBy : body.dataEntryBy,
      newOrResale : body.newOrResale,
      reraStatus : body.reraStatus,
      price : body.price ? body.price : 0,
      projectGrade : body.projectGrade,
      propertyDescription : body.propertyDescription,
      propertySubType : body.propertySubType,
      facing : body.facing,
      sizePerUnit : body.sizePerUnit ? body.sizePerUnit : 0 ,
      amenitiesCharges : body.amenitiesCharges ? body.amenitiesCharges : 0,
      otherCharges : body.otherCharges ? body.otherCharges : 0,
      totalUnits : body.totalUnits ? body.totalUnits : 0,
      totalAvailableUnits : body.totalAvailableUnits ? body.totalAvailableUnits : 0,
      plotLayoutDescription : body.plotLayoutDescription,
      dimensionsRooms : body.dimensionsRooms,
      description : body.description,
      length : body.length ? body.length : 0,
      width : body.width ? body.width : 0,
      nearByPlaces : body.nearByPlaces,
      amenities : body.amenities,
      selletComments : body.selletComments,
      advisorComments : body.advisorComments,
      image : image,
      mainImage : mainImage
    }
    return ({ 'payLoad': payload })
  }
  excelConvertLineByLineToObj(val_keys, curr_key, values) {
    let newObj = {}
    for (let row = 0; row < values.length; row++) {
      if (val_keys.includes(values[row][curr_key]) && values[row + 1] !== undefined && !val_keys.includes(values[row + 1][curr_key])) {
        newObj[values[row][curr_key]] = values[row + 1][curr_key]
      }
      if (val_keys.includes(values[row][curr_key]) && values[row + 1] !== undefined && val_keys.includes(values[row + 1][curr_key])) {
        const curr_key = Object.keys(values[0])[0]
        newObj[values[row][curr_key]] = ''
      }
      if (values[row + 1] === undefined && val_keys.includes(values[row][curr_key])) {
        newObj[values[row][curr_key]] = ''
      }
    }
    return newObj
  }
  excelConvertRowsAndColumnsToArray(values) {
    const ext_data = []
    let result = []
    for (let data in values) {
      ext_data.push(Object.values(values[data]))
    }
    for (let row = 1; row < ext_data.length; row++) {
      let newObj = {}
      for (let data = 0; data < ext_data[row].length; data++) {
        newObj[ext_data[0][data]] = ext_data[row][data]
      }
      result.push(newObj)
    }
    return result
  }
  getTheNewChanges(prev_record, new_record) {
    //getting the difference between two json objects by using lodash.
    let difference = this.differenceObjectDeep(
      prev_record,
      new_record
    );

    //cleaning the objects which has no key and values.
    const clean_un_necessary_data = this.clean(difference)

    //removing unwanted data. and storing to a object and return it.
    const filtered_data = Object.keys(clean_un_necessary_data).filter((key) => (key !== '_id') && (key !== 'tracks_details'))
      .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: clean_un_necessary_data[key]
        });
      }, {});
    return filtered_data
  }

  differenceObjectDeep(source, other) {
    var self = this;
    return _.reduce(source, function (result, value, key) {
      if (_.isObject(value) && _.isObject(other[key])) {
        result[key] = self.differenceObjectDeep(
          value,
          other[key]
        );
      } else if (!_.isEqual(value, other[key])) {
        result[key] = other[key];
      }
      return result;
    }, _.omit(other, _.keys(source)));
  }
  clean(object) {
    var self = this;
    Object
      .entries(object)
      .forEach(([k, v]) => {
        if (v && typeof v === 'object') {
          self.clean(v);
        }
        if (v && typeof v === 'object' && !Object.keys(v).length || v === null || v === undefined) {
          if (Array.isArray(object)) {
            object.splice(k, 1);
          } else {
            delete object[k];
          }
        }
      });
    return object;
  }

  async postDataToPropertyAdvisor(data) {
    const post_response = await axios.post(process.env.PROPERTY_ADVISOR_DOMAIN_NAME+'/Apis/StaticPagesApi/update_property_data', JSON.stringify(data),{
      auth: {
        username: process.env.PROPERTY_ADVISOR_UAT_USERNAME,
        password: process.env.PROPERTY_ADVISOR_UAT_PASSWORD
      }
    }
  ).then((res) => res)
      .catch((e) => {
        console.log(e)
      })
    return post_response
  }

  async postDataToPropertyAdvisorForNewRera(data) {
    const post_response = await axios.post(process.env.PROPERTY_ADVISOR_DOMAIN_NAME+'/Apis/ReviewPropertyApi/review_property_data', JSON.stringify(data[0]),{
      auth: {
        username: process.env.PROPERTY_ADVISOR_UAT_USERNAME,
        password: process.env.PROPERTY_ADVISOR_UAT_PASSWORD
      }
    }
  ).then((res) => res)
      .catch((e) => {
        console.log(e)
      })
    return post_response
  }
  
  convertToTrackDataFromExcel(data){
    let payLoad = {}
    payLoad.state = 'Telangana'
    payLoad.certExtFileName = data['Certificate Ext File Name'] && data['Certificate Ext File Name'] !== 'NA' && data['Certificate Ext File Name'] !== ""? path.resolve() + '/uploads/'+ data['Certificate Ext File Name'] : ''
    payLoad.certFileName = path.resolve() + '/uploads/'+ data['Certificate File Name']
    payLoad.detailsFileName = path.resolve() + '/uploads/'+ data['Details File Name']
    payLoad.detailsURL = data['Details URL']
    payLoad.lastModifiedDate = typeof(data['Last Modified Date']) !== 'string' ? ExcelSerialDateToJSDate(data['Last Modified Date']) : new Date(data['Last Modified Date'].trim())
    payLoad.projectEndDate = typeof(data['Project End Date']) !== 'string' ? ExcelSerialDateToJSDate(data['Project End Date']) : new Date(data['Project End Date'].trim())
    payLoad.reraProjectStartDate = typeof(data['RERA Project Start Date']) !== 'string' ? ExcelSerialDateToJSDate(data['RERA Project Start Date']) : new Date(data['RERA Project Start Date'].trim())
    payLoad.reraApprovedDate = typeof(data['RERA Approved Date']) !== 'string' ? ExcelSerialDateToJSDate(data['RERA Approved Date']) : new Date(data['RERA Approved Date'].trim())
    payLoad.reraNumber = data['RERA No']
    payLoad.paId = data['PA ID']
    payLoad.sellerMobile = data['Seller Mobile:']
    payLoad.propertyInsert = data['Property Insert']
    payLoad.propertyStatus = data['Property Status']
    payLoad.propertyFor = data['Property For: ']
    payLoad.propertyCategory = data['Property Category:']
    payLoad.propertyName = data['Property Type']
    payLoad.newsPaperName = data['Property Name:']
    payLoad.surveyBy = data['Survey By:']
    payLoad.surveyDate = data['Survey Date: ']
    payLoad.occupencyDate = data['Occupency Date']
    payLoad.propertySpoc = data['Property Spoc: ']
    payLoad.gatedCommunityType = data['Gated Community Type:']
    payLoad.propertyStatus2 = data['Property Status']
    payLoad.loanBanks = data['Loan Banks']
    payLoad.totalFloors = data['Total Floors']
    payLoad.openSpaceArea = data['Project Open Space Area (%): *']
    payLoad.commonArea = data['Common Area(%)']
    payLoad.dataEntryBy = data['Data Entry By:']
    payLoad.newOrResale = data['New/Resale:']
    payLoad.reraStatus = data['Select Rera Status:']
    payLoad.price = data['Price:']
    payLoad.projectGrade = data['Project Grade']
    payLoad.propertyDescription = data['Property Description']
    payLoad.propertySubType = data['Property sub type:']
    payLoad.facing = data['Facing']
    payLoad.sizePerUnit = data['Size/Unit']
    payLoad.amenitiesCharges = data['Amenities Charges']
    payLoad.otherCharges = data['Other Charges (Rs/-):']
    payLoad.totalUnits = data['Total Units']
    payLoad.totalAvailableUnits = data['Total Available Units']
    payLoad.plotLayoutDescription = data['Floor Plan/Plot Layout Discription']
    payLoad.dimensionsRooms = data['Dimensions/Rooms']
    payLoad.description = data['Description']
    payLoad.length = data['Length']
    payLoad.width = data['Width']
    payLoad.nearByPlaces = data['Nearby Places']
    payLoad.amenities = data['Amenities']
    payLoad.selletComments = data['Seller Comments']
    payLoad.advisorComments = data['Adviser Comments']
    payLoad.image = path.resolve() + '/uploads/'+ data['Image']
    payLoad.mainImage = path.resolve() + '/uploads/'+ data['Property Main Photo']
    return payLoad
  }
}

module.exports = new PropertyServices()