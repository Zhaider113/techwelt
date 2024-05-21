import axios from 'axios';
import { API_URL } from '../constants/url';
import { toastr } from "../services/navRef";

function getManageEmail(token) {
    return new Promise((resolve, reject) => {
  
      console.log("@@@ getManageEmail",token);
      axios.post(`${API_URL}/utils/manageemail`, { token })
        .then(async (response) => {
          try {
            resolve(response);
          } catch (e) {
            console.log("getManageEmail then::::", e)
            reject(e)
          }
        }).catch((err) => {
          console.log("getManageEmail catch::::", err)
          reject(err)
        });
    });
  }

  export const configService = {
    getManageEmail
  };