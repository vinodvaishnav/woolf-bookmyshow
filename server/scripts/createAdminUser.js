const userModel = require('../models/userModel');
const userRole = require('../models/userRoleModel');
const ROLES = require('../constants/roles');
const encryptPassword = require('../utils/encryptPassword');

async function createAdminUser(email, password, phone) {
    try {
        const existingAdmin = await userModel.findOne({ email: email });
        if (!existingAdmin) {
            const hashedPassword = await encryptPassword(password);
            const role = await userRole.findOne({ name: ROLES.ADMIN });
            const adminUser = new userModel({
                first_name: 'Admin',
                email: email,
                password: hashedPassword,
                phone: phone,
                role: role._id
            });

            await adminUser.save();
            console.log('Admin user created successfully!');
        } else {
            console.log('Admin user already exists!');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
}

function validateEmail(email) {
    return true;
}

function validatePassword(password) {
    return true;
}

module.exports = { createAdminUser, validateEmail, validatePassword };
