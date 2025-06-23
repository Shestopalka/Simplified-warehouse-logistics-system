const logger = require('../../../utils/logger.js');
const { query } = require( "../../dbPg.js");


const createUsersRoleTable = `
    CREATE TABLE IF NOT EXISTS users_role (
    role_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
    );
`

function initUsersRoleTable() {
    return query(createUsersRoleTable)
        .then(() => {
            logger.info("Table `users_role' created!");
        })
        .catch((err) => {
            logger.error("Error creating table", err);
        })
}

module.exports = { initUsersRoleTable };