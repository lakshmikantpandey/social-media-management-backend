import { Request, Response, NextFunction } from "express";
import { jwtHelper } from "../helpers";
import { IJwtToken, IRequest } from "../interfaces";

export async function jwtMiddleware(req: IRequest, res: Response, next: NextFunction) {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if(token) {
            const authHeader = req.headers.authorization || '';
            const isJwt = authHeader.includes('Bearer ');
            if(isJwt) {
                const token = authHeader.replace('Bearer ', '');
                const user = await jwtHelper.verifyToken(token);
                req.user = user as IJwtToken;
                next();
            } else {
                res.status(500).json({
                    message: 'Invalid token'
                });
            }
        } else {
            res.status(500).json({
                message: 'Invalid token'
            });
        }
        
    } catch (error) {
        // throw new Error("Invalid token");
        res.status(500).json({
            message: 'Invalid token'
        });
    }
}