const { CompositionService } = require('../service/сompositionService');

class CompositionController{

    constructor() {
        this.compositionService = new CompositionService();
    }

    async createCompartment(req, res){       
            let body = '';

            req.on('data', chunk => {
                
                body += chunk.toString();
                
            });           
            req.on('end', async () => {
                try{
                    const productData = JSON.parse(body);                 
                    const result = await this.compositionService.createCompartmentForProduct(productData);
                    res.writeHead(201, {'Content-Type': "application/json"});
                    res.end(JSON.stringify({message: result}));
                }catch(err) {
                    res.writeHead(500),
                    res.end(JSON.stringify({error: err.message}));
                }
            })
    }

    async addProductFromCompartment(req, res) {
        let body = ''

        req.on('data', chunk => {
            body += chunk;
        })
        req.on('end', async () => {
            try{
                const productData = JSON.parse(body);        
                const result = await this.compositionService.addProductFromCompartment(productData);

                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                res.writeHead(500, {"Content-Type": 'application/json'}),
                res.end(JSON.stringify({error: err.message}));
            }
        })
    }

    async createProduct(req, res){
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try{
                console.log(body);
                
                const productData = JSON.parse(body);

                const result = await this.compositionService.createProduct(productData);
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                res.writeHead(500, {"Content-Type": 'application/json'}),
                res.end(JSON.stringify({error: err.message}));
            }
        })
    }


    async updateProduct(req, res) {
        let body = ''

        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try{
                const updateData = JSON.parse(body);

                const result = await this.compositionService.updateProduct(updateData);

                res.writeHead(201, {"Contnet-Type": 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                res.writeHead(500);
                res.end(JSON.stringify({errorr: err.message}));
            }
        })

    }

    async updateCompartment(req, res) { 
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        })

        req.on('end', async () => {
            try{
                const compartmentData = JSON.parse(body);

                const result = await this.compositionService.updateCompartment(compartmentData);

                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                return err.message;
            }
        })
    }

    async getProductComposition(req, res) {
        try{
            const product = await this.compositionService.getProductFromComposition();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: product}));
        }catch(err){
            res.writeHead(500, {"Content-Type": 'application/json'}),
            res.end(JSON.stringify({error: err.message}));
        }
    }

    async getProductCompartment(req, res) { 
        try{
            const product = await this.compositionService.getProductFromCompartment();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: product}));
        }catch(err){
            res.writeHead(500, {"Content-Type": 'application/json'}),
            res.end(JSON.stringify({error: err.message}));
        }
    }

    async deleteProduct(req, res) {
        let body = "";

        req.on('data', chunk => {
            body += chunk;     
        })
        req.on('end', async () => {
            try{
                const serial_number  = JSON.parse(body);
            
                const result = await this.compositionService.deleteProduct(serial_number);

                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                res.writeHead(500);
                res.end(JSON.stringify({error: err.message}));
            }
        })
    }

    async deleteCompartment(req, res) {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            try{
                const compartment_name = JSON.parse(body);

                const result = await this.compositionService.deleteCompartment(compartment_name);
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                res.writeHead(500);
                res.end(JSON.stringify({error: err.message}));
            }
        })
    }
}


module.exports = { CompositionController };