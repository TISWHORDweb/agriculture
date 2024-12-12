import { toast } from 'react-toastify';
import baseUrl from './Network';

const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
  toast.error('Session expired!');
};

export const requestHeader: Record<string, string> = {
  Accept: "application/json",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
};

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

const API_USER_URL = baseUrl()

export async function request(url: string, method: string, payload: any, token: boolean, text: boolean, form: boolean): Promise<any> {
  const bearerToken = localStorage.getItem('authToken');

  if (token) {
    requestHeader['Authorization'] = `Bearer ${bearerToken}`;
  }

  requestHeader["Content-Type"] = form === true ? "multipart/form-data" : "application/json";

  if (method === "GET") {
    return fetch(API_USER_URL + url, {
      method,
      headers: Object.assign(requestHeader),
    })
      .then((res: Response) => {
        if (res.status === 403 || res.status === 401) {
          // Redirect to the login page
          logout();
          throw new Error("Access forbidden. Redirecting to login page.");
          // Redirect to the login page
          // window.location.href = "/auth/login";
        } else if (text === true) {
          return res.text();
        } else {
          return res.json();
        }
      })
      .catch((err: any) => {
        console.error(`Request Error ${url}: `, err);
        throw new Error(err);
        // return err;
      });
  } else {
    return fetch(API_USER_URL + url, {
      method,
      headers: Object.assign(requestHeader),
      body: form === true ? payload : JSON.stringify(payload),
    })
      .then((res: Response) => {
        if (res.status === 403 || res.status === 401) {
          logout();
          throw new Error("Access forbidden. Redirecting to login page.");
          // Redirect to the login page
          // window.location.href = "/auth/login";
        } else if (text === true) {
          return res.text();
        } else {
          return res.json();
        }
      })
      .catch((err: any) => {
        console.error(`Request Error ${url}: `, err);
        throw new Error(err);
      });
  }
}