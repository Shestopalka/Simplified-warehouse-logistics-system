const {OrdersController} = require('../controller/orderController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

let ordersController = new OrdersController();

async function orderRoutes(req, res) {
    if(req.url === '/orders/createOrder' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            return await ordersController.createOrder(req, res);
        })
    }
    else if(req.url === '/orders/confrimOrder' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            return await ordersController.ConfrimOrder(req, res);
        });
    }
    else if(req.url === '/orders/deliveredProduct' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            return await ordersController.DeliveredOrder(req, res);
        });
    }
    
}

module.exports = { orderRoutes };
