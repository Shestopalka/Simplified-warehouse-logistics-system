const logger = require('../../../utils/logger.js');
const { query } = require( "../../dbPg.js");

const createOrderTable = `
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        supplier_country VARCHAR(100) NOT NULL,
        place_of_delivery VARCHAR(100) NOT NULL,
        price_of_the_product INT NOT NULL,
        quantity_of_goods INT NOT NULL,
        compartment_name VARCHAR(100) NOT NULL,
        arrived BOOLEAN DEFAULT FALSE,
        status VARCHAR(100) NOT NULL
    );
`


function initOrderTable() {
    return query(createOrderTable)
        .then(() => {
            logger.info("Table 'order' created!");
        })
        .catch((err) => {
            logger.error('Error creating table', err);
        })
}

module.exports = { initOrderTable };