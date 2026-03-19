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

        console.log('Permissions synced successfully!');

        const allPermissionIds = savedPermissions.map(permission => permission._id);

        await UserRole.findOneAndUpdate(
            { name: ROLES.ADMIN },
            { name: ROLES.ADMIN, permissions: allPermissionIds },
            { upsert: true, new: true }
        );

        console.log('Admin role created successfully!');

        for (const role in ROLES) {
            if (ROLES[role] !== ROLES.ADMIN) {
                await UserRole.findOneAndUpdate(
                    { name: ROLES[role] },
                    { name: ROLES[role], permissions: [] },
                    { upsert: true, new: true }
                );
                console.log(`${ROLES[role]} role created successfully!`);
            }
        }
    } catch (error) {
        console.error('Error syncing permissions:', error);
        throw error;
    }
}

module.exports = seedPermissions;