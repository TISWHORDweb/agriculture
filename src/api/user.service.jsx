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

class UserService {
    async land(payload) {
        try {
            const response = await request(
                `/farmer/land`,
                'POST',
                payload,
                true,
                false,
                false
            );
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getLands() {
        try {
            const response = await request(
                `/farmer/lands`,
                'GET',
                {},
                true,
                false,
                false
            );
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getFarmerAnalytics() {
        try {
            const response = await request(
                `/farmer/analytics`,
                'GET',
                {},
                true,
                false,
                false
            );
            return response;
        } catch (err) {
            throw err;
        }
    }

        async getAgentAnalytics() {
        try {
            const response = await request(
                `/agent/analytics`,
                'GET',
                {},
                true,
                false,
                false
            );
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getAgentAnalytics() {
        try {
            const response = await request(
                `/agent/analytics`,
                'GET',
                {},
                true,
                false,
                false
            );
            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default UserService;