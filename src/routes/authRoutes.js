const { UsersController } = require('../controller/usersController.js');

const usersController = new UsersController();

async function authRoutes(req, res) {
    if(req.url === '/auth/registration' && req.method == 'POST'){
        console.log('test', usersController);
        return await usersController.registration(req, res);
    }
    else if(req.url === '/auth/login' && req.method == "POST"){
        return await usersController.login(req, res);
    }
}

module.exports = authRoutes;
