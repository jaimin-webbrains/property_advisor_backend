const main_fields = [
    'General Information',
    'Promoter Information - Organization',
    'Address Details',
    'Organization Contact Details', 
    'Past Experience Details',
    'Member Information', 
    'Project Information',
    'Land Details', 
    'Built-Up Area Details',
    'Project address details',
    'Promoter(Land Owner/ Investor) Details',
    'Project Details',
    'Development Work',
    'Building Details',
    'Project Professional Information',
    'Uploaded Documents',
    'Promoter Information - Individual', 
    'Address For Official Communication',
    'Contact Details',
    'Other Organization Type Member Information',
    'Plot Details',
    'Litigations Details'
]
const parent_keys = [
    'Sr.No.',
    'Project Name',
    'Name',
    'Proposed Date of Completion (As approved by Competent Authority)',
    "Number of Basement's",
    'Number of Plinth',
    "Number of Podium's",
    'Number of Slab of Super Structure',
    'Number of Stilts',
    'Number of Open Parking',
    'Total Parking Area (In sqmts)'
]
const child_keys = [
    'Sr.No.',
    'Floor ID',
    'Mortgage Area',
    'Apartment Type',
    'Saleable Area (in Sqmts)',
    'Number of Apartment',
    'Number of Booked Apartment'
]
const grand_child_keys = [
    'Sr.No.', 
    'Tasks / Activity', 
    'Percentage of Work'
]

const gen_info_keys = [
    'Information Type'
]
const prom_info_keys = [
    'Name', 
    'Promoter Name', 
    'Middle Name', 
    'Last Name', 
    'Father Full Name',
    'Do you have any Past Experience ?', 
    'GST Number', 
    'Organization Type', 
    'Description For Other Type Organization',
    'Any criminal or police case/ cases pending ?', 
    'Do you have any registration in other States and Union Territories ?'
]
const address_keys = [
    'House No/Sy. No/Block No/Plot No', 
    'House Number', 
    'Building Name', 
    'Street Name', 
    'Street',
    'Locality', 
    'Landmark', 
    'Land mark',
    'State', 
    'District', 
    'Mandal', 
    'Village/City/Town', 
    'Pin Code'
]
const contact_details_keys = [
    'Office Number', 
    'Fax Number', 
    'Website URL'
]
const project_info_keys = [
    'Authority Name', 
    'Plan Approval Number', 
    'Project Name', 
    'Project Status',
    'Approved Date', 
    'Proposed Date of Completion', 
    'Revised Proposed Date of Completion',
    'Complition Date at the time of Registration in Telangana Rera',
    'Litigations related to the project ?', 
    'Project Type',
    'Are there any Promoter(Land Owner/ Investor) (as defined by Telangana RERA Order) in the project ?'
]
const land_details_keys = [
    'Sy.No/TS No.', 
    'Plot No./House No.', 
    'Total Area(In sqmts)',
    'Area affected in Road widening/FTL of Tanks/Nala Widening(In sqmts)',
    'Net Area(In sqmts)', 'Total Building Units (as per approved plan)', 
    'Proposed Building Units(as per agreement)',
    'Boundaries East', 
    'Boundaries West', 
    'Boundaries North', 
    'Boundaries South',
    "Plot of Open Land"
]
const build_up_details_keys = [
    'Approved Built up Area (In Sqmts)', 
    'Mortgage Area (In Sqmts)'
]
const org_cont_details_keys = [
    'Website URL', 
    "Fax Number", 
    'Office Number'
]

const ROLE_ADMIN = 'admin'

module.exports = {
    main_fields,
    parent_keys,
    child_keys,
    grand_child_keys,
    gen_info_keys,
    prom_info_keys,
    address_keys,
    contact_details_keys,
    project_info_keys,
    land_details_keys,
    build_up_details_keys,
    org_cont_details_keys,
    ROLE_ADMIN
}