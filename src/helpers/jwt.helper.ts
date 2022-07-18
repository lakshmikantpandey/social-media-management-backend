import { sign, verify } from "jsonwebtoken";
import { nanoid } from "nanoid";
import config from "../config";
const { security } = config;
const { jwt } = security;

class JwtHelper {
    generateToken(payload = {}) {
        let jti = nanoid(15);
        let token = sign(
            payload,
            jwt.secret,
            {
                expiresIn: jwt.expiresIn,
                issuer: jwt.issuer,
                algorithm: 'HS512',
                jwtid: jti
            }
        );
        return {
            jti: jti,
            token: token
        };
    }
    
    verifyToken(token: string = '') {
        return new Promise((resolve, reject) => {
            try {
                let decoded = verify(token, jwt.secret);
                resolve(decoded);
            } catch (err) {
                reject(err);
            }
        });
    }
    
    generateOtpToken(payload: object = {}) {
        let jti = nanoid();
        let token = sign(
            payload,
            jwt.secret,
            {
                expiresIn: '1h',
                issuer: jwt.issuer,
                algorithm: 'HS512',
                jwtid: jti
            }
        );
        return {
            jti: jti,
            token: token
        };
    }
    
    createVerifyToken(payload: object = {}) {
        return sign(
            payload,
            jwt.secret,
            {
                expiresIn: '24h',
                issuer: jwt.issuer,
                algorithm: 'HS512'
            }
        );
    }
}

export default new JwtHelper();