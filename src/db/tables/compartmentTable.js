const { query } = require('../dbPg.js');

const createCompartmentTable = `
    CREATE TABLE IF NOT EXISTS compartment (
        id SERIAL PRIMARY KEY,
        compartment_name VARCHAR(100) NOT NULL,
        max_space_compartment INT NOT NULL,
        current_space_compartment INT NOT NULL,
        Date_of_arrival VARCHAR(100) NOT NULL
    );
`

function initCompartmentTable() {
    return query(createCompartmentTable)
        .then(() => {
            console.log("Table 'compartment' created!");
        })
        .catch((err) => {
            console.error("Error creating table", err);
            
        })
}

module.exports = { initCompartmentTable };