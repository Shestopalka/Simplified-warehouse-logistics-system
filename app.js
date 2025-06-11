import http from 'http';
import { initUserTable } from './db/tables/usersTable.js';
import { authRoutes } from './routes/authRoutes.js';
import { compositionRoutes } from './routes/compositionRoutes.js';
import { initProductTable } from './db/tables/productTable.js';
import { initCompositionTable } from './db/tables/compositionTable.js';
import { initCompartmentTable } from './db/tables/compartmentTable.js';
const PORT = 3000;

async function startApp() {
    await initCompartmentTable();
    await initCompositionTable();
    await initProductTable();
    await initUserTable(); 
     // Чекаємо, поки БД ініціалізується
    console.log("DB started!");

    const server = http.createServer((req, res) => {
        if(req.url.startsWith('/auth')){
            return authRoutes(req, res);
        }
        else if(req.url.startsWith('/composition')){
            return compositionRoutes(req, res);
        }
    });

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startApp();