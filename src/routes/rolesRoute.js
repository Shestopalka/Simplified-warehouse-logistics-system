const {RoleController} = require('../controller/createRoleController');
const { authMiddleware } = require('../middleware/authMiddleware')

const roleController = new RoleController();
function rolesRoute(req, res) {
    if(req.url === '/role/createRole' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            return await roleController.createRoleData(req, res);
        })
    }else if(req.url === '/role/createPermissions' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            return await roleController.createPermissions(req, res);
        })
    }else if(req.url === '/role/addRoleForUser' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            return await roleController.addRoleForUser(req, res);
        });
    }
}

module.exports = { rolesRoute };