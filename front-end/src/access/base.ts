const axios = require('axios');

const headers = {
    'Authorization' : 'Basic Og==',
    'Content-Type': 'application/json',
    'accept': "*/*",
    "Access-Control-Allow-Origin": '*'
}
const BASE_URL = 'http://192.168.1.196:5000';

const APIPost = async (url: string, data: string) => {
    return await axios({
        method: 'POST',
        url: `${BASE_URL}/${url}`,
        headers: headers,
        data: data
    });
}

const APIGet = async (url: string) => {
    const token = localStorage.getItem('token');
    return await axios({
        method: 'GET',
        url: `${BASE_URL}/${url}`,
        headers: token ? {...headers, 'Authorization' : `Bearer ${token}`} : headers,
    });
}

const APIDelete = async (url: string, data?: string) => {
    return await axios({
        method: 'DELETE',
        url: `${BASE_URL}/${url}`,
        headers: headers,
        data: data
    });
}

export const DataAccess = {
    Get: APIGet,
    Post: APIPost,
    Delete: APIDelete,
};
