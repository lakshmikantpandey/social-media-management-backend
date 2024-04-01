import { Request, Response, NextFunction } from "express";
import { jwtHelper } from "../helpers";
import { IJwtToken, IRequest } from "../interfaces";

export async function jwtMiddleware(req: IRequest, res: Response, next: NextFunction) {
    try {
        if (req.path === '/user/login') {
            return next();
        }else {
            // let token = req.headers['x-access-token'] || req.headers['authorization'];
            let token = req.headers['x-access-token'] || req.headers['authorization'] || extractTokenFromCookie(req.headers.cookie);
            
            function extractTokenFromCookie(cookieHeader: string | undefined) {
                if (!cookieHeader) return null;
                const cookies = cookieHeader.split(';');
                for (let cookie of cookies) {
                    const [name, value] = cookie.split('=');
                    if (name.trim() === 'accessToken' || name.trim() === 'ACCESS_TOKEN') {
                        return value.trim();
                    }
                }
                return null;
            }
            if(token) {
                // const authHeader = req.headers.authorization || '';
                const authHeader = req.headers.authorization || ('Bearer ' + (extractTokenFromCookie(req.headers.cookie) || ''));
                const isJwt = authHeader.includes('Bearer ');
                if(isJwt) {
                    const token = authHeader.replace('Bearer ', '');
                    const user = await jwtHelper.verifyToken(token);
                    req.user = user as IJwtToken;
                    next();
                } else {
                    res.status(500).json({
                        message: 'Invalid token (not Jwt)'
                    });
                }
            } else {
                res.status(500).json({
                    message: 'Invalid token (Token not present)'
                });
            }
        }
        
    } catch (error) {
        // throw new Error("Invalid token");
        res.status(500).json({
            message: 'Invalid token'
        });
    }
}