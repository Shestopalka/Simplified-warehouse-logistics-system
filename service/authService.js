import { query } from "../db/dbPg.js";
import bcrypt from 'bcrypt';
import { JwtStrategy } from "../utils/jwt.js";

export class RegistrationService{

    jwtStrategy = new JwtStrategy;

    async registrationUser(userData){
        const { email, password, username } = userData;

        console.log(email, username, password);
        
        const existEmail = await query("SELECT * FROM users WHERE email = $1", [email])
        console.log(existEmail.rows[0], "TEST SERVICE");
        
        if(existEmail.rows[0]){
            throw new Error("This email alredy exist!");
        }
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const result = await query("INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *", [email, username, hashedPassword]);
        const payload = {
            username: username,
            email: email,
            password: password
        }
        const token = this.jwtStrategy.generateToken(payload)
        
        return {user: result.rows[0], token: token};
    }

    async login(userData){
        const { email, password } = userData
        

        const existUser = await query('SELECT * FROM users WHERE email = $1', [email]);
        if(!existUser.rows[0]){
            throw new Error("User not found");
        }
        const comparePassworld = await bcrypt.compare(password, existUser.rows[0].password);
        if(!comparePassworld){
            throw new Error("Passworlds do not match")
        }

        const payload = {
            username: existUser.username,
            email: existUser.email,
            password: existUser.password
        };
        const userToken = await this.jwtStrategy.generateToken(payload);

        return {message: "Welcome!", token: userToken };

    }
}