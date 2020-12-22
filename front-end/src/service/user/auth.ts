import { UserContext } from './../../context/index';
import axios from "axios";

const API_URL = "http://192.168.1.197:5000/";
const headers = {
   'Content-Type': 'application/json',
   'accept': "*/*",
   "Access-Control-Allow-Origin": '*'
};

const register = (username: string, password: string) => {
   return axios.post(`${API_URL}register`, {
      "username": username,
      "password": password
   }, { headers });
};
const login = (username: string, password: string) => {
   return axios
     .post(`${API_URL}login`,  {
      "username": username,
      "password": password
   }, { headers })
     .then((response) => {
       if (response.data.token) {
         localStorage.setItem("user", JSON.stringify(response.data));
       }
 
       return response.data;
     });
 };
function authHeader() {
   const user = JSON.parse(localStorage.getItem('user') + "");

   if (user && user.token) {
      return {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + user.token
      };
   } else {
      return {};
   }
}

export default {
   register,
   authHeader,
   login
}