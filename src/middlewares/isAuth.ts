import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {

       try {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            const err = new Error("Not authenticated");
            // err.statusCode = 401;
            throw err;
        }
       
        const token = authHeader.split(' ')[1];
        let decodedToken:{userId:String, iat:Number, exp: Number};
        try {
            decodedToken = <any>jwt.verify(token, "secretmyverysecretkey");
        } catch (error) {
            const err = new Error("Not authenticated");
            // err.statusCode = 401;
            throw err;
        }
    
        if (!decodedToken) {
            const err = new Error("Not authenticated");
            // err.statusCode = 401;
            throw err;
        }
        // userId
        req.userId = decodedToken.userId;
        next();
       } catch (error) {
           next(error)
       }
}

export { isAuthenticated };