import { UsersController } from "../controller/usersController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const usersController = new UsersController;

export async function authRoutes(req, res) {
    if(req.url === '/auth/registration' && req.method == 'POST'){
        return await usersController.registration(req, res);
    }
    else if(req.url === '/auth/login' && req.method == "POST"){
        return await usersController.login(req, res);
    }
   
}

    
