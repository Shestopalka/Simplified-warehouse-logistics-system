const logger = require('../../../utils/logger.js');
const { query } = require('../../dbPg.js');

const createRolePermissionsTable = `
    CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        FOREIGN KEY (role_id) REFERENCES role(id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
        );
`

function initRolePermissionsTable() {
    return query(createRolePermissionsTable)
        .then(() => {
            logger.info("Table 'role_permissions' created!");
        })
        .catch((err) => {
            logger.error("Error created table", err);
        });
}

module.exports = { initRolePermissionsTable };