import { RegistrationService } from "../service/authService.js";

export class UsersController {
    
    registrationService = new RegistrationService

    async registration(req, res){
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try{
                const userData = JSON.parse(body);
                console.log(userData, 'Controller');
                
                const result = await this.registrationService.registrationUser(userData);
                console.log("True");
                
                res.writeHead(201, {"Content-Type": "application/json"});
                res.end(JSON.stringify({ message: result }))
            }catch(err){
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: err.message}));
            }
        })
        
    }

    async login(req, res, authMiddleware){
        let body = "";

        req.on('data', chunk => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            try{
                const userData = JSON.parse(body);
                const result = await this.registrationService.login(userData);
              
                res.writeHead(201, {"Content-Type": 'application/json'});
                res.end(JSON.stringify({message: result}));
            }catch(err){
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: err.message}));
            }
        })
    }

    

}