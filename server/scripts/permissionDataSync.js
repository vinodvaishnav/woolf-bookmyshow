const MODULES = require('../constants/modules');
const ACTIONS = require('../constants/actions');
const ROLES = require('../constants/roles');

const Permission = require('../models/permissionModel');
const UserRole = require('../models/userRoleModel');

async function seedPermissions() {
    try {
        const requests = [];
        for (const module in MODULES) {
            for (const action in ACTIONS) {
                const permissionData = {
                    module: MODULES[module],
                    action: ACTIONS[action],
                    description: `${ACTIONS[action]} permission for ${MODULES[module]}`
                }
                requests.push(Permission.findOneAndUpdate(
                    { module: permissionData.module, action: permissionData.action },
                    permissionData,
                    { upsert: true, new: true }
                ));
            }
        }

        const savedPermissions = await Promise.all(requests);

        console.log('Added all modules and actions as permissions successfully!');

        const allPermissionIds = savedPermissions.map(permission => permission._id);

        for (const role in ROLES) {
            await UserRole.findOneAndUpdate(
                { name: ROLES[role] },
                { name: ROLES[role], permissions: [] },
                { upsert: true, new: true }
            );
            console.log(`${ROLES[role]} role created successfully!`);
        }

        await UserRole.findOneAndUpdate(
            { name: ROLES.ADMIN },
            { name: ROLES.ADMIN, permissions: allPermissionIds },
            { upsert: true, new: true }
        );
        console.log('All the permissions added to the Admin role successfully!');
    } catch (error) {
        console.error('Error syncing permissions:', error);
        throw error;
    }
}

module.exports = seedPermissions;