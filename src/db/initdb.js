const User = require("../models/superUserSchema")
const bcrypt = require('bcrypt');

const getSuperAdmin = async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.findOne({ 'role': 'admin' })
        .then(data => {
            if (!data) {
                User.create({
                    email: process.env.SUPER_ADMIN_EMAIL,
                    password: hashedPassword,
                    status: true,
                    role: 'admin'
                })
            }
        })
        .catch(e => console.log(e))
}

module.exports = getSuperAdmin