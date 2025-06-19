const http = require('http');
const { initUserTable } = require('./db/tables/usersTable.js');
const authRoutes = require('./routes/authRoutes.js'); // тут без деструктуризації, бо ти експортуєш функцію як default
const { compositionRoutes } = require('./routes/compositionRoutes.js');
const { initProductTable } = require('./db/tables/productTable.js');
const { OrdersService } = require('../src/service/orderService.js');
const { initCompositionTable } = require( './db/tables/compositionTable.js');
const { initCompartmentTable } = require ('./db/tables/compartmentTable.js');
const { initOrderTable } = require('./db/tables/orderTable.js');
const { startConsumer } = require('../src/rabbitmq/rabbitConsumer.js')
const { orderRoutes } = require('./routes/orderRoutes.js');
const logger = require('./utils/logger.js');
const PORT = 3000;

let ordersService = new OrdersService();
async function startApp() {
    await initCompartmentTable();
    await initCompositionTable();
    await initProductTable();
    await initOrderTable();
    await initUserTable();
    logger.info("DB started!");

    await startConsumer('order_processing_queue', ordersService.createOrder.bind(ordersService));
    await startConsumer('order_confirmation_queue', ordersService.ConfrimOrder.bind(ordersService));
    await startConsumer('delivery_queue', ordersService.OrderDelivered.bind(ordersService));

    const server = http.createServer(async (req, res) => {
        try {
            if(req.url.startsWith('/auth')){
                await authRoutes(req, res);  // <-- додаємо await
            }
            else if(req.url.startsWith('/composition')){
                await compositionRoutes(req, res);  // <-- додаємо await
            }
            else if(req.url.startsWith('/orders')){
                await orderRoutes(req, res);
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
        logger.info(`Server running on http://localhost:${PORT}`);
    });
}

startApp();
