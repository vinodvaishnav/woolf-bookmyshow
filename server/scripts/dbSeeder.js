const readline = require('readline');

const connectDB = require('../utils/db_connect');
const seedPermissions = require('./permissionDataSync');
const { createAdminUser, validateEmail, validatePassword } = require('./createAdminUser');

require('dotenv').config();

(async () => {
    try {
        await connectDB(process.env.DB_NAME);
        console.log('Connected to MongoDB successfully!');

        // Seed permissions and admin role
        await seedPermissions();

        // accept user input
        const rI = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (prompt) => new Promise((resolve) => rI.question(prompt, resolve));

        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password: ');
        const phone = await question('Enter admin phone number: ');

        // // Create admin user
        // const email = 'vaishnav.vinod484@gmail.com';
        // const adminPassword = 'admin@123';
        // const phone = "9461641427";


        if (!validateEmail(email)) {
            throw new Error('Given email Id is invalid!');
        }

        if (!validatePassword(password)) {
            throw new Error('Please provide a strong password with minimum 8 characters, including uppercase, lowercase, number, and special character!');
        }

        await createAdminUser(email, password, phone);

        rI.close();
        process.exit(0);
    } catch (error) {
        console.error('Error while seeding database:', error);
        if (typeof rI !== 'undefined') rI.close();
        process.exit(1);
    }
})();
