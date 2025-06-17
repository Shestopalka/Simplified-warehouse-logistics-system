const { sendToQueue } = require('../rabbitmq/rabbitProducer.js');
const { OrdersService } = require('../service/orderService.js')
const { handleError } = require('../errors/handleError.js')

class OrdersController {

    constructor() {
        this.ordersService = new OrdersService();
    }

    async createOrder(req, res) {
        let body = "";

        req.on('data', chunk => {
            body += chunk;
        })

        req.on('end', async () => {
            try{
                const orderData = JSON.parse(body);
                const result = await sendToQueue('order_processing_queue', orderData);
                res.writeHead(202, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Order has been queued and will be processed shortly."
                }));
            }catch(err){
                const error = handleError(err);
                res.writeHead(error.statusCode, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: error.message}));
            }
        })
    }
    async ConfrimOrder(req, res) {
        let body = "";

        req.on('data', chunk => {
            body += chunk;
        })

        req.on('end', async () => {
            try{
                let confrimData = JSON.parse(body);
                const result = await sendToQueue('order_confirmation_queue', confrimData);

                res.writeHead(202, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                const error = handleError(err);
                res.writeHead(error.statusCode),
                res.end(JSON.stringify({error: error.message}))
            }

        })
    }
    async DeliveredOrder(req, res) {
        let body = "";
        req.on('data', chunk => {
            body += chunk;
        })
        req.on('end', async () => {
            try{
            const productDelivered = JSON.parse(body);
            const result = await sendToQueue('delivery_queue', productDelivered);
            res.writeHead(202, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: result}));
            }catch(err){
                const error = handleError(err);
                res.writeHead(error.statusCode);
                res.end(JSON.stringify({error: error.message}));
            }
        })
    }
}

module.exports = { OrdersController }