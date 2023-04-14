const User = require("../models/userSchema")
const Role = require("../models/role")
const bcrypt = require('bcryptjs');
const ObjectId = require('mongoose').Types.ObjectId; 


const getSuperAdmin = async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    let role = await Role.findOne({name:'admin'})
    if(!role){
        roleDate = new Role({name:'admin'})
        role = await roleDate.save()
    }
    await User.findOne({ 'role': new ObjectId(role.id) })
        .then(data => {
            if (!data) {
                User.create({
                    name: 'admin',
                    email: process.env.SUPER_ADMIN_EMAIL,
                    password: hashedPassword,
                    status: true,
                    role: role,
                    mobile: 1234567890
                })
            }
        })
        .catch(e => console.log(e))
}

module.exports = getSuperAdmin