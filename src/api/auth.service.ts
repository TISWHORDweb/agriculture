import {request}  from "../hook/api";
import { SignInProps, SignUpProps } from "./_model";

/**
 *
 * @param {string} url
 * @param {string, [GET, POST, PATCH, PUT...]} method
 * @param {payload} payload
 * @param {boolean} token
 * @param {boolean} text
 * @param {boolean} form
 * @param {string | null} xHash
 * @returns Response Data;
 */



class AuthService {

    /**PROMO */
    async signIn(payload: SignInProps) {

        try {
            const response = await request(
                '/auth/login' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async signUp(payload: SignUpProps) {
        try {
            const response = await request(
                '/auth/register' , 
                'POST',
                payload,
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

}


export default AuthService;