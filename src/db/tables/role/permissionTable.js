const logger = require('../../../utils/logger.js');
const { query } = require( "../../dbPg.js");

const createPermissionsTable = `
    CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        recource_type VARCHAR(100),
        description TEXT
        );
`


function initPemissionsTable(){
    return query(createPermissionsTable)
        .then(() => {
            logger.info("Table 'permissions' created!");
        })
        .catch((err) => {
            logger.error("Error creating table", err);
        });
}

module.exports = { initPemissionsTable };
