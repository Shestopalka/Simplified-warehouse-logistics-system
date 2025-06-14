const http = require('http');
const { initUserTable } = require('./db/tables/usersTable.js');
const authRoutes = require('./routes/authRoutes.js'); // тут без деструктуризації, бо ти експортуєш функцію як default
const { compositionRoutes } = require('./routes/compositionRoutes.js');
const { initProductTable } = require('./db/tables/productTable.js');
const { initCompositionTable } = require( './db/tables/compositionTable.js');
const { initCompartmentTable } = require ('./db/tables/compartmentTable.js');
const PORT = 3000;

async function startApp() {
    await initCompartmentTable();
    await initCompositionTable();
    await initProductTable();
    await initUserTable();
    console.log("DB started!");

    const server = http.createServer(async (req, res) => {
        try {
            if(req.url.startsWith('/auth')){
                await authRoutes(req, res);  // <-- додаємо await
            }
            else if(req.url.startsWith('/composition')){
                await compositionRoutes(req, res);  // <-- додаємо await
            }
            else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found');
            }
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Server error: ' + error.message);
        }
    });

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startApp();
