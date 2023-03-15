const main_fields = ['General Information', 'Promoter Information - Organization', 'Address Details', 'Organization Contact Details',
    'Past Experience Details', 'Member Information', 'Project Information', 'Land Details', 'Built-Up Area Details',
    'Address Details', 'Promoter(Land Owner/ Investor) Details', 'Project Details', 'Development Work', 'Building Details',
    'Project Professional Information', 'Uploaded Documents',

    'Promoter Information - Individual', 'Address For Official Communication', 'file_type'
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

const grand_child_keys = ['Sr.No.', 'Tasks / Activity', 'Percentage of Work']

module.exports = {
    main_fields,
    parent_keys,
    child_keys,
    grand_child_keys
}