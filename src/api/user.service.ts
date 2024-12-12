import { request } from "../hook/api";

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



class UserService {

    async land(payload: any){
        try {
            const response = await request(
                `/farmer/land` ,
                'POST',
                payload,
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }
    async getLands() {
        try {
            const response = await request(
                `/farmer/lands` ,
                'GET',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }
    async getFarmerAnalytics() {
        try {
            const response = await request(
                `/farmer/analytics` ,
                'GET',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }
    async getAgentAnalytics() {
        try {
            const response = await request(
                `/agent/analytics` ,
                'GET',
                {},
                true,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }
}


export default UserService;
