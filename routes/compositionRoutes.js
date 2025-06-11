import { CompositionController } from "../controller/compositionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const compositionController = new CompositionController;

export async function compositionRoutes(req, res) {
    if(req.url === '/composition/getAllproduct' && req.method =='GET'){
        authMiddleware(req, res, async () => {
            await compositionController.getProduct(req, res);
        })
    }else if(req.url === '/composition/getProductFromCompartment' && req.method == 'GET'){
        authMiddleware(req, res, async () => {
           await compositionController.getProductCompartment(req, res);
        })  
    }else if(req.url === '/composition/createCompartment' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            await compositionController.createCompartment(req, res);
        })
    }else if(req.url === '/composition/createProduct' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            await compositionController.createProduct(req, res);
        })
    }else if(req.url === '/composition/addProduct' && req.method == 'POST'){
        authMiddleware(req, res, async () => {
            await compositionController.addProductFromCompartment(req, res);
            
        });
    }else if(req.url === '/composition/updateProduct' && req.method === "PATCH"){
        authMiddleware(req, res, async () => {
            await compositionController.updateProduct(req, res);
        });
    }else if(req.url === '/composition/updateCompartment' && req.method == "PATCH"){
        authMiddleware(req, res, async () => {
            await compositionController.updateCompartment(req, res);
        })
    }else if(req.url === '/composition/deleteProduct' && req.method == "DELETE"){
        authMiddleware(req, res, async () => {
            await compositionController.deleteProduct(req, res);
        });
    }
}