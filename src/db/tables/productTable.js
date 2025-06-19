const logger = require("../../utils/logger.js");
const { query } = require( "../dbPg.js");


const createProductTable = `
    CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        compartment_id INT,
        product_name VARCHAR(100) NOT NULL,
        price_pet_unit INT NOT NULL,
        unit_weight INT NOT NULL,
        total_cost INT NOT NULL,
        serial_number INT NOT NULL,
        total_number INT NOT NULL,
        FOREIGN KEY (compartment_id) REFERENCES compartment(id)
    );
`

function initProductTable() {
    return query(createProductTable)
        .then(() => {
            logger.info("Table 'product' created!");
        })
        .catch((err) => {
            logger.error("Error creating rable", err);
            
        })
}

module.exports = { initProductTable };