const logger = require("../../utils/logger.js");
const {query} = require("../dbPg.js");

const createCompositionTable = `
   CREATE TABLE IF NOT EXISTS composition (
        id SERIAL PRIMARY KEY,
        compartment_id INT NOT NULL,
        supplier_country VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (compartment_id) REFERENCES compartment(id)
    );
`;


function initCompositionTable() {
    return query(createCompositionTable)
        .then(() => {
            logger.info("Table 'composition' created!");
        })
        .catch((err) => {
            logger.error("Error creating table", err);
        });
}

module.exports = { initCompositionTable };

