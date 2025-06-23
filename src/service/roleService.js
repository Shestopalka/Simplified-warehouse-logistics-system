const { query } = require("../db/dbPg.js");
const { BadRequestError, NotFoundError } = require("../errors/httpError.js");
const { JwtStrategy } = require("../utils/jwt.js");

class UsersRole { 

    constructor(){
        this.jwtStrategy = new JwtStrategy()
    }

    async createRole(roleData) {
        if(Object.keys(roleData).length < 2){
            throw new BadRequestError("You have not filled in all the columns!");
        }
        const {name, description} = roleData 
        
        const createRole = await query("INSERT INTO role (name, description) VALUES ($1, $2) RETURNING *", [name, description]);
        

        return {message: "Role created successfuly!"}; 
    }

    async createPermissions(permissionsData){
        if(Object.keys(permissionsData).length < 4){
            throw new BadRequestError("You have not filled in all the colums!");
        }
        const { roleId } = permissionsData; 
        const { name, recource_type, description } = permissionsData;

        const createPermissions = await query("INSERT INTO permissions (name, recource_type, description) VALUES ($1, $2, $3) RETURNING *", [name, recource_type, description]);
        await query("INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) RETURNING *", [roleId, createPermissions.rows[0].id]);

        return {message: "Permissions for role created successfuly!"};
    }
    async addRoleForUser(data) {
        if(Object.keys(data).length < 2){
            throw new BadRequestError("You habe not filled in all the colums!")
        }
        const {userId, roleId} = data;
        const user = await query('SELECT * FROM users WHERE id = $1', [userId]);
        
        const roleIsReady = await query('SELECT * FROM users_role WHERE user_id = $1', [userId]);
        if(roleIsReady.rows[0]){
            throw new BadRequestError("You have a role!");
        }

        if(!user.rows[0]){
            throw new NotFoundError("User not found");
        };
        
        const role = await query('SELECT * FROM role WHERE id = $1', [roleId]);
        
        if(!role.rows[0]){
            throw new NotFoundError('Role not found');
        };

        const addRole = await query('INSERT INTO users_role (role_id, user_id) VALUES ($1, $2) RETURNING *', [role.rows[0].id, user.rows[0].id]);
        

        const payload = {
            username: user.rows[0].username,
            email: user.rows[0].email,
            password: user.rows[0].password,
            role: role.rows[0].id,
        }
        
        
        
        
        const token = await this.jwtStrategy.generateToken(payload);

        
        

        return {message: `Rolle for user ${user.rows[0].username}, added successfuly!`, token: token};
    }
}

module.exports = { UsersRole }