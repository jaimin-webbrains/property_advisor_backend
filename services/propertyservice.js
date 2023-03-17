const path = require('path')

const PropertySchema = require('../models/propertyschema');
const TsSchema = require('../models/tsSchema');
const const_fields = require('../Helper/constants');
const { ExcelSerialDateToJSDate } = require('../Helper/helper');


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
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
        proper_data.set(main_fields[0], converted_data)
      }
      //setting promoter information 
      if (key === main_fields[1]) {
        const val_keys = const_fields.prom_info_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
        proper_data.set(main_fields[1], converted_data)
      }
      //setting address details. 
      if (key === main_fields[2]) {
        const val_keys = const_fields.address_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
        proper_data.set(main_fields[2], converted_data)
      }
      // setting organization contact details.
      if (key === main_fields[3]) {
        const val_keys = const_fields.org_cont_details_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
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
            if (values[row][curr_key] === 'Approved Date' || values[row][curr_key] === 'Proposed Date of Completion') {
              newObj[values[row][curr_key]] = ExcelSerialDateToJSDate(values[row + 1][curr_key])
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
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
        proper_data.set(main_fields[7], converted_data)
      }
      // setting built up information.
      if (key === main_fields[8]) {
        const val_keys = const_fields.build_up_details_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
        proper_data.set(main_fields[8], converted_data)
      }
      //setting address information.
      if (key === main_fields[9]) {
        const val_keys = const_fields.address_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
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
            if (result[result.length - 1]['floor_details'] === undefined) {
              result[result.length - 1]['floor_details'] = []
            }
            let obj = {}
            for (let k_name = 0; k_name < child_keys.length; k_name++) {
              if (ext_data[row][2] !== 'Sr.No.') {
                obj[child_keys[k_name]] = ext_data[row][k_name + 2]
              }
            }
            if(Object.keys(obj).length > 0){
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
            if(Object.keys(obj).length > 0){
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
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
        proper_data.set(main_fields[16], converted_data)
      }
      //setting Address For Official Communication. 
      if (key === main_fields[17]) {
        const val_keys = const_fields.address_keys
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
        proper_data.set(main_fields[17], converted_data)
      }
      // setting Contact Details.
      if (key === main_fields[18]) {
        const converted_data = this.excelConvertLineByLineToObj(val_keys,curr_key,values)
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
        if(current_key !== main_fields[2]){
          dataMap.set(current_key, [...dataMap.get(current_key), xlData[row]])
        }
          if(current_key === main_fields[2]){
            if(row < 50){
              dataMap.set(current_key, [...dataMap.get(current_key), xlData[row]])
            }else{
              if(dataMap.has('Project address details')){
                dataMap.set('Project address details', [...dataMap.get('Project address details'), xlData[row]])
              }else{
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
    const propertySchema = new PropertySchema(response)
    const res_data = await propertySchema.save()
    return ({ 'data': res_data })
  }
  async addAllTsData(req, xlData) {
    const files = req.files
    const body = req.body
    const certExt = files.certExtFileName && files.certExtFileName[0] ? path.resolve() + '/uploads/' + files.certExtFileName[0].filename : ''
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
      paId : body.paId
    }
    const tsSchema = new TsSchema(payload)
    const res = await tsSchema.save()
    //extracting data from excel
    await this.getAllPropertyDetails(xlData, res)

    return ({ 'data': res })
  }
   excelConvertLineByLineToObj(val_keys,curr_key,values){
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
  excelConvertRowsAndColumnsToArray(values){
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

}

module.exports = new PropertyServices()