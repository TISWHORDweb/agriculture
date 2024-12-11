import {parentRequest}  from "../../hook/api";
import { AddChildProps, AddProgramProps } from "./_model";

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



class ParentService {

    async getDayTime() {
        try {
            const response = await parentRequest(
                '/common/program/daytime' ,
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

    async getCohort(){
        try {
            const response = await parentRequest(
                `/promo/parent/get/cohort/all` ,
                'GET',
                {},
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async getParentDashboardData(){
        try {
            const response = await parentRequest(
                `/promo/parent/get/dashboard/data` ,
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

    async addChild(payload: AddChildProps){
        try {
            const response = await parentRequest(
                `/promo/parent/child/add` ,
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

    async addChildWithId(payload: any, id:number){
        try {
            const response = await parentRequest(
                `/promo/parent/child/add/${id}` ,
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

    async getAllPackages() {
        try {
            const response = await parentRequest(
                '/common/package/all' ,
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

    async addProgram(payload: AddProgramProps, id: number, pid: number ){
        try {
            const response = await parentRequest(
                `/promo/parent/program/add/${id}/${pid}` ,
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

    async addProgramWithId(payload: AddProgramProps, id: number, pid: number, ppid: number ){
        try {
            const response = await parentRequest(
                `/promo/parent/program/add/${id}/${pid}/${ppid}` ,
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

    async getParentInvite(){
        try {
            const response = await parentRequest(
                `/promo/parent/invite` ,
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

    async getTimetable(timezone:any){
        try {
            const response = await parentRequest(
                `/promo/parent/get/promo/timegroup/${timezone}`,
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

    async getTimetableWithId(id:any,timezone:string){
        try {
            const response = await parentRequest(
                `/promo/parent/get/timegroup/${id}/${timezone}` ,
                'GET',
                {},
                false,
                false,
                false,
            )
            return response;
        }catch(err){
            throw err;
        }
    }

    async getAdditionalField(id:any){
        try {
            const response = await parentRequest(
                `/promo/parent/get/fields/${id}` ,
                'GET',
                {},
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


export default ParentService;
