import { request } from "../hook/api";

/**
 *
 * @param {string} url
 * @param {string} method - [GET, POST, PATCH, PUT...]
 * @param {object} payload
 * @param {boolean} token
 * @param {boolean} text
 * @param {boolean} form
 * @param {string | null} xHash
 * @returns Response Data;
 */

class AuthService {
    async signIn(payload) {
        try {
            const response = await request(
                '/auth/login',
                'POST',
                payload,
                false,
                false,
                false
            );
            return response;
        } catch (err) {
            throw err;
        }
    }

    async signUp(payload) {
        try {
            const response = await request(
                '/auth/register',
                'POST',
                payload,
                false,
                false,
                false
            );
            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default AuthService;