const logger = require("../../../utils/logger.js")
const { query } = require("../../dbPg.js")


const createRoleTable = `
    CREATE TABLE IF NOT EXISTS role (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
        );
`

function initRoleTable(){
    return query(createRoleTable)
        .then(() => {
            logger.info("Table 'role' created!")
        })
        .catch((err) => {
            logger.error("Error creating Table", err);
        })
}

module.exports = { initRoleTable }