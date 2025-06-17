const { query } = require("../db/dbPg");
const { handleError } = require("../errors/handleError");
const { BadRequestError, NotFoundError } = require("../errors/httpError");
const {CompositionService} = require('../service/compositionService.js');

class OrdersService {

    constructor() {
        this.compositionService = new CompositionService();
    }
    async createOrder(orderData, callback) {
        try{
            console.log("THIS IS ORDER SERVICE");
            
            const length = Object.keys(orderData).length;
            if(length < 6)
                throw new BadRequestError("Enter all fields to form an order")
            const status = 'pending';

            const { product_name, price_of_the_product, supplier_country, place_of_delivery, quantity_of_goods, compartment_name, } = orderData;
        

            const existsCompartment = await query(
                "SELECT * FROM compartment WHERE compartment_name = $1",
                [compartment_name]
            );
            
            if (!existsCompartment || !existsCompartment.rows || !existsCompartment.rows[0]) {

                console.error(" Compartment not found or query failed");
                throw new BadRequestError("Compartment not found or query failed");
            }
            const order = await query(
                'INSERT INTO orders (compartment_name, product_name, price_of_the_product, supplier_country, place_of_delivery, quantity_of_goods, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [
                    compartment_name,
                    product_name,
                    price_of_the_product,
                    supplier_country,
                    place_of_delivery,
                    quantity_of_goods,
                    status,
                ]
            );
            

            if (callback) await callback(order);

            console.log(" Order processed.");
        } catch (err) {
            const error = handleError(err)
            console.error(" Error in consumer:", err.message);
            throw new err;
        }
            
        
    }

    async ConfrimOrder(confrimdData, callback) {
        try{
            if(Object.keys(confrimdData).length < 2){
                throw new  BadRequestError("Enter all fields to form an order")
            }
            const {orderId, compartment_name} = confrimdData;
            console.log('This is orderID and compartment_name from ConfrimOrder', orderId, compartment_name);
            
            
            const existOrder = await query("SELECT * FROM orders WHERE id = $1", [orderId]);
            console.log('This Confrim order - existOrder:', existOrder.rows[0]);
            
            if(!existOrder.rows[0]){
                throw new NotFoundError('Order not found')
            }
            const existCompartment = await query("SELECT * FROM compartment WHERE compartment_name = $1", [compartment_name]);
            if(!existCompartment.rows[0]){
                throw new NotFoundError('Compartment not found');
            }

            const confrimedOrder = await query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", ['confirmed', orderId]);

            console.log(`Замовлення ${confrimedOrder.rows[0].id} успішно підтверджено, та очікує доставки.`);
            
            if(callback){
                await callback(confrimedOrder);
            }

        }catch(err){
            console.log(err.message);
            throw new err
            
        }
    }

    async OrderDelivered(deliveredData, callback){
        try{
        if(Object.keys(deliveredData).length < 2){
            throw new BadRequestError("Enter all fields to form an order");
        }
        const { orderId, compartment_name } = deliveredData;
        
        const existOder = await query("SELECT * FROM orders WHERE id = $1", [orderId]);
        if(!existOder) {
            throw new NotFoundError("Order not found");
        }

        if(existOder.rows[0].status !== 'confirmed'){
            throw new BadRequestError('Order status not confirmed');
        }
        const existCompartment = await query("SELECT * FROM compartment WHERE compartment_name = $1", [compartment_name]);
        
        if(!existCompartment){
            throw new NotFoundError("Compartment not found");
        }
        const price_pet_unit = existOder.rows[0].quantity_of_goods / existOder.rows[0].price_of_the_product
        
        const createProduct = {
            compartment_name: existCompartment.rows[0].compartment_name,
            product_name: existOder.rows[0].product_name,
            price_pet_unit: Math.round(price_pet_unit),
            total_cost: existOder.rows[0].price_of_the_product,
            total_number: existOder.rows[0].quantity_of_goods,
        }
        
        
        
        
        const deliveredProduct = await this.compositionService.createProduct(createProduct);
        const updateOrder = await query("UPDATE orders SET arrived = $1, status = $2 WHERE id = $3", [true, 'delivered', existOder.rows[0].id]);

        if(callback) callback(deliveredProduct);
        }catch(err){
            console.error(err.message);
            
        }
        

    }
}

module.exports = { OrdersService }