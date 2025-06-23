const { handleError } = require("../errors/handleError");
const { UsersRole } = require("../service/RoleService");


class RoleController {
    constructor(){
        this.usersRole = new UsersRole();
    }

    async createRoleData(req, res){
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        })
        req.on('end', async () => {
            try{
                const roleData = JSON.parse(body);

                const result = await this.usersRole.createRole(roleData);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                const error = handleError(err);
                res.writeHead(error.statusCode);
                res.end(JSON.stringify({error: error.message}));
            }
        })
    }
    async createPermissions(req, res) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try{
                const permissionsData = JSON.parse(body);

                const result = await this.usersRole.createPermissions(permissionsData);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err) {
                const error = handleError(err);
                res.writeHead(error.statusCode,);
                res.end(JSON.stringify({error: error.message}));
            }
        })
    }

    async addRoleForUser(req, res) {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try{
                const data = JSON.parse(body);

                const result = await this.usersRole.addRoleForUser(data);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                const error = handleError(err);
                res.writeHead(error.statusCode);
                res.end(JSON.stringify({error: error.message}));
            };
        })
    }
}

module.exports = {RoleController};
