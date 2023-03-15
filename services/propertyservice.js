const path = require('path')
const XLSX = require('xlsx');
const fs = require('fs')

const PropertySchema = require('../models/propertyschema');
const TsSchema = require('../models/tsSchema');
const const_fields = require('../Helper/constants')


const main_fields = const_fields.main_fields
const parent_keys = const_fields.parent_keys
const child_keys = const_fields.child_keys
const grand_child_keys = const_fields.grand_child_keys

const proper_data = new Map()
class PropertyServices {
  constructor() { }
  async dataConverter(key, values) {

    //setting file_type.
    if (key === 'file_type') {
      proper_data.set('file_type', values)
    }
    if (Array.isArray(values) && values.length > 1) {
      //setting general information
      if (key === main_fields[0]) {
        let newObj = {}
        const gen_keys = const_fields.gen_info_keys
        const curr_key = Object.keys(values[0])[0]
        for (let row = 0; row < values.length; row++) {
          if (gen_keys.includes(values[row][curr_key]) && !gen_keys.includes(values[row+1][curr_key])) {
            newObj[values[row][curr_key]] = values[row+1][curr_key]
          }
          if (gen_keys.includes(values[row]) && gen_keys.includes(values[row+1])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set('gen_info', newObj)
      }
      //setting promoter information 
      if (key === main_fields[1] || key === 'Promoter Information - Individual') {
        let newObj = {}
        const prom_keys = const_fields.prom_info_keys
        const curr_key = Object.keys(values[0])[0]
        for (let row = 0; row < values.length; row++) {
          if (prom_keys.includes(values[row][curr_key]) && values[row+1] !== undefined &&!prom_keys.includes(values[row+1][curr_key])) {
            newObj[values[row][curr_key]] = values[row+1][curr_key]
          }
          if (prom_keys.includes(values[row][curr_key]) && values[row+1] !== undefined && prom_keys.includes(values[row+1][curr_key])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
          if(values[row+1] === undefined){
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set('prom_info', newObj)
      }
      //setting address details. 
      if (key === main_fields[2] || key === 'Address For Official Communication') {
        let newObj = {}
        const addr_keys = const_fields.address_keys
        const curr_key = Object.keys(values[0])[0]

        for (let row = 0; row < values.length; row++) {
          if (addr_keys.includes(values[row][curr_key]) && !addr_keys.includes(values[row+1][curr_key])) {
            newObj[values[row][curr_key]] = values[row+1][curr_key]
          }
          if (addr_keys.includes(values[row][curr_key]) && addr_keys.includes(values[row+1][curr_key])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set('addr_details', newObj)
      } 
      // setting organization contact details.
      if (key === main_fields[3]) {
        let newObj = {}
        const org_cont_keys = const_fields.org_cont_details_keys
        const curr_key = Object.keys(values[0])[0]

        for (let row = 0; row < values.length; row++) {
          if (org_cont_keys.includes(values[row][curr_key]) && !org_cont_keys.includes(values[row+1][curr_key])) {
            newObj[values[row][curr_key]] = values[row+1][curr_key]
          }
          if (org_cont_keys.includes(values[row][curr_key]) && org_cont_keys.includes(values[row+1][curr_key])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set('org_cont_details', newObj)
      } 
      //setting past experience details.
      if (key === main_fields[4]) {
        let ext_keys = Object.values(values[0])
        let ext_values = []
        let final_data = []
        for (let rows = 1; rows < values.length; rows++) {
          ext_values.push(Object.values(values[rows]))
        }

        for (let val = 0; val < ext_values.length; val++) {
          let newObj = {};
          for (let key = 0; key < ext_keys.length; key++) {
            newObj[ext_keys[key]] = ext_values[val][key]
          }
          final_data.push(newObj)
        }
        proper_data.set('past_exp_details', final_data)
      } 
      //setting members details.
      if (key === main_fields[5]) {
        let ext_keys = Object.values(values[0])
        let ext_values = []
        let final_data = []
        for (let rows = 1; rows < values.length; rows++) {
          ext_values.push(Object.values(values[rows]))
        }

        for (let val = 0; val < ext_values.length; val++) {
          let newObj = {};
          for (let key = 0; key < ext_keys.length; key++) {
            newObj[ext_keys[key]] = ext_values[val][key]
          }
          final_data.push(newObj)
        }
        proper_data.set('member_info', final_data)
      } 
      //setting project information
      if (key === main_fields[6]) {
        let newObj = {}
        const proj_keys = const_fields.project_info_keys
        const curr_key = Object.keys(values[0])[0]

        for (let row = 0; row < values.length; row++) {
          if (proj_keys.includes(values[row][curr_key]) && !proj_keys.includes(values[row+1][curr_key])) {
            newObj[values[row][curr_key]] = values[row+1][curr_key]
          }
          if (proj_keys.includes(values[row][curr_key]) && proj_keys.includes(values[row+1][curr_key])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set('project_info', newObj)
      } 
      // setting land details
      if (key === main_fields[7]) {
        let newObj = {}
        const land_keys = const_fields.land_details_keys
        const curr_key = Object.keys(values[0])[0]

        for (let row = 0; row < values.length; row++) {
          if (land_keys.includes(values[row][curr_key]) && !land_keys.includes(values[row+1][curr_key])) {
            newObj[values[row][curr_key]] = values[row+1][curr_key]
          }
          if (land_keys.includes(values[row][curr_key]) && land_keys.includes(values[row+1][curr_key])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set('land_info', newObj)
      } 
      // setting built up information.
      if (key === main_fields[8]) {
        let newObj = {}
        const built_up_keys = const_fields.build_up_details_keys
        const curr_key = Object.keys(values[0])[0]

        for (let row = 0; row < values.length; row++) {
          if (built_up_keys.includes(values[row][curr_key]) && !built_up_keys.includes(values[row+1][curr_key])) {
            newObj[values[row][curr_key]] = values[row+1][curr_key]
          }
          if (built_up_keys.includes(values[row][curr_key]) && built_up_keys.includes(values[row+1][curr_key])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set('built_up_info', newObj)
      } 
      //setting address information.
      if (key === main_fields[9]) {
        let newObj = {}
        const addr_keys = const_fields.address_keys
        const curr_key = Object.keys(values[0])[0]

        for (let row = 0; row < values.length; row++) {
          if (addr_keys.includes(values[row][curr_key]) && !addr_keys.includes(values[row+1][curr_key])) {
            newObj[values[row][curr_key]] = values[row+1][curr_key]
          }
          if (addr_keys.includes(values[row][curr_key]) && addr_keys.includes(values[row+1][curr_key])) {
            const curr_key = Object.keys(values[0])[0]
            newObj[values[row][curr_key]] = ''
          }
        }
        proper_data.set('address_details', newObj)
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
        proper_data.set('promoter_details', final_data)
      } 
      // setting project details.
      if (key === main_fields[11]) {
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
        proper_data.set('project_details', result)
      } 
      //setting development work details.
      if (key === main_fields[12]) {
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
        proper_data.set('developmet_work_details', result)
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
            }
            result.push(obj)
          }
          if (ext_data[row][0] === '' && ext_data[row][1] === '' && ext_data[row][5] !== '' && ext_data[row][9] === '' && ext_data[row][10] === '') {
            if (result[result.length - 1]['floor_details'] === undefined) {
              result[result.length - 1]['floor_details'] = []
            }
            let obj = {}
            for (let k_name = 0; k_name < child_keys.length; k_name++) {
              obj[child_keys[k_name]] = ext_data[row][k_name + 2]
            }
            result[result.length - 1]['floor_details'] = [...result[result.length - 1]['floor_details'], obj]
          }
          if (ext_data[row][0] === '' && ext_data[row][1] === '' && ext_data[row][5] === '' && ext_data[row][6] === '' && ext_data[row][7] === '' && ext_data[row][8] === '' && ext_data[row][9] === '' && ext_data[row][10] === '') {
            if (result[result.length - 1]['task_details'] === undefined) {
              result[result.length - 1]['task_details'] = []
            }
            let obj = {}
            for (let k_name = 0; k_name < grand_child_keys.length; k_name++) {
              obj[grand_child_keys[k_name]] = ext_data[row][k_name + 2]
            }
            result[result.length - 1]['task_details'] = [...result[result.length - 1]['task_details'], obj]
          }
        }
        proper_data.set('building_info', result)
      } 
      // setting project professionals info.
      if (key === main_fields[14]) {
        let ext_keys = Object.values(values[0])
        let ext_values = []
        let final_data = []
        for (let rows = 1; rows < values.length; rows++) {
          ext_values.push(Object.values(values[rows]))
        }

        for (let val = 0; val < ext_values.length; val++) {
          let newObj = {};
          for (let key = 0; key < ext_keys.length; key++) {
            newObj[ext_keys[key]] = ext_values[val][key]
          }
          final_data.push(newObj)
        }
        proper_data.set('project_prof_info', final_data)
      } 
      //setting uploaded doc info.
      if (key === main_fields[15]) {
        let ext_keys = Object.values(values[0])
        let ext_values = []
        let final_data = []
        for (let rows = 1; rows < values.length; rows++) {
          ext_values.push(Object.values(values[rows]))
        }

        for (let val = 0; val < ext_values.length; val++) {
          let newObj = {};
          for (let key = 0; key < ext_keys.length; key++) {
            newObj[ext_keys[key]] = ext_values[val][key]
          }
          final_data.push(newObj)
        }
        proper_data.set('uploaded_doc', final_data)
      }
    }
  }
  async getAllPropertyDetails(name, k, tracks_data) {
    // reading excel file
    const workbook = XLSX.readFile(path.resolve() + '/uploads/' + name);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "" });

    //taking a map to store the data after grouping.
    const dataMap = new Map()

    //adding file name to identify [detailsFile,certFile or certExtFile]
    dataMap.set('file_type', k)
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
          dataMap.set(current_key, [...dataMap.get(current_key), xlData[row]])
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
    response['tracks_id'] = tracks_data.id
    const propertySchema = new PropertySchema(response)
    const res_data = await propertySchema.save()
    return ({ 'data': res_data })
  }
  async addAllTsData(req) {
    const files = req.files
    const body = req.body
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
      certExtFileName: path.resolve() + '/uploads/' + files.certExtFileName[0].filename,
      detailsFileName: path.resolve() + '/uploads/' + files.detailsFileName[0].filename,
    }
    const tsSchema = new TsSchema(payload)
    const res = await tsSchema.save()
    //extracting data from excel
    await this.getAllPropertyDetails(files.detailsFileName[0].filename, 'detailsFileName', res)

    return ({ 'data': res })
  }

}

module.exports = new PropertyServices()