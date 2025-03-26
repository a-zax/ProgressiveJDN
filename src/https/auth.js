import api from './api';

export const sendOtp = async (body) => {
    try {
        console.log(body, 'body');
        const { data } = await api.post('/users/signup/', body);
        console.log(data, 'auth:');
        return data;
    } catch (error) {
        // Log full error details for debugging
        console.log('OTP Error:', error.response ? error.response.data : error.message);
        return { success: false, message: error.response?.data?.message || 'OTP Sent Successfully' };
    }
};


export const verifyOtp = async (body) => {
    console.log(body,'hello eolr')
    const { data } = await api.post('/users/verify/', body);
    console.log(data, 'verify');
    return data;
}

export const updateProfile = async ({ userId, accessToken, ...body}) => {
    console.log(body,'hello eolr')
    const config = {
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken}`,
        }
    }
    const { data } = await api.patch(`/users/update/${userId}`, body, config);
    console.log(data, 'verify');
    return data;
}