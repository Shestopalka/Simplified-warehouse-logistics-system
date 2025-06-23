const { query } = require('../db/dbPg.js');
const { BadRequestError } = require('../errors/httpError.js');


async function accessMiddleware(req, res, description, next) {
    try {
        const userId = req.user.id;
        const roleId = req.user.role;

        const permission = await query('SELECT * FROM permissions WHERE description = $1', [description]);
        const role_permission = await query('SELECT * FROM role_permissions WHERE role_id = $1 AND permission_id = $2', [roleId, permission.rows[0].id]);
        if(!role_permission.rows[0]){
            throw new BadRequestError('You role does not have this permission or your role do not exists');
        }

        if (description !== permission.rows[0].description) {
            throw new BadRequestError('You do not have permission');
        }

        next();
    } catch (err) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Access denied: no permission." }));
    }
}

module.exports = { accessMiddleware };
