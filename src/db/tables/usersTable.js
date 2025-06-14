const {query} = require("../dbPg.js");

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        password TEXT NOT NULL, 
        created_at TIMESTAMP DEFAULT NOW()
    );
`;

function initUserTable() {
    return query(createUsersTable)  // повертаємо проміс
        .then(() => {
            console.log("Table 'users' created!");
        })
        .catch((err) => {
            console.error("Error creating table", err);
        });
}

module.exports = { initUserTable };