const axios = require('axios');

const headers = {
    'Authorization' : 'Basic Og==',
    'Content-Type': 'application/json',
    'accept': "*/*",
    "Access-Control-Allow-Origin": '*'
}
const BASE_URL = 'http://192.168.1.197:5000';

const APIPost = async (url: string, data: string) => {
    return await axios({
        method: 'POST',
        url: `${BASE_URL}/${url}`,
        headers: headers,
        data: data
    });
}

const APIGet = async (url: string) => {
    return await axios({
        method: 'GET',
        url: `${BASE_URL}/${url}`,
        headers: headers,
    });
}
export const DataAccess = {
    Get: APIGet,
    Post: APIPost,
};
