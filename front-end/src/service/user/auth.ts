import axios from "axios";

const API_URL = "http://localhost:5000/";

const register = (username: string, password: string) => {
   return axios.post(API_URL + "register", {
      username, password
   });
};

function authHeader() {
   const user = JSON.parse(localStorage.getItem('user') + "");

   if (user && user.accessToken) {
      return { 'x-access-token': user.accessToken };
   } else {
      return {};
   }
}

export default {
   register,
   authHeader
}