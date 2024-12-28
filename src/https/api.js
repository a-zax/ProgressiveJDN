//import axios from 'axios';
//import * as SecureStore from 'expo-secure-store';
//import { BACKEND_URL } from "@env";
//
//const api = axios.create({
//    baseURL: BACKEND_URL,
//    headers: {
//        'Content-type': 'application/json',
//        Accept: 'application/json',
//    },
//});
//
//// Axios Interceptors
//api.interceptors.response.use(
//    (config) => {
//        return config;
//    },
//    async (error) => {
//        const refreshToken = await SecureStore.getItemAsync('refreshToken');
//        console.log(refreshToken, 'api axios');
//        const originalRequest = error.config;
//        if(error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
//            originalRequest._isRetry = true;
//
//            try {
//                const { data } = await axios.post(`${BACKEND_URL}api/token/refresh/`, { refresh: refreshToken });
//                console.log(data, 'coming refresh');
//                await SecureStore.setItemAsync('accessToken', data.access);
//
//                originalRequest.headers['Authorization'] = 'Bearer ' + data.access;
//
//                console.log('Refresh used setted');
//                return api.request(originalRequest);
//
//            } catch(err) {
//                console.log(err.message);
//            }
//        }
//    throw error;
//});
//
//
//export default api;



import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from "@env";

// Create Axios instance
const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
});

// Axios Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;  // If response is successful, just return it
    },
    async (error) => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        // Debugging: Check if refreshToken is null or undefined
        if (!refreshToken) {
            console.log('Refresh token is null or undefined.');
            return Promise.reject(error);
        }
        console.log('Retrieved refresh token:', refreshToken);

        const originalRequest = error.config;

        // Check if it's a 401 error and retry hasn't been attempted yet
        if (error.response && error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
            originalRequest._isRetry = true;

            try {
                // Attempt to refresh the access token
                const { data } = await axios.post(`${BACKEND_URL}/api/token/refresh/`, { refresh: refreshToken });

                // Log the refreshed token for debugging purposes
                console.log('Refreshed access token:', data.access);

                // Store the new access token securely
                await SecureStore.setItemAsync('accessToken', data.access);

                // Update the Authorization header with the new token
                originalRequest.headers['Authorization'] = 'Bearer ' + data.access;

                console.log('New access token set in the header.');

                // Retry the original request with the new access token
                return api.request(originalRequest);

            } catch (err) {
                console.log('Error refreshing access token:', err.message);
            }
        }

        // If the error is not due to an expired access token, throw the original error
        return Promise.reject(error);
    }
);

// Export the configured Axios instance
export default api;
