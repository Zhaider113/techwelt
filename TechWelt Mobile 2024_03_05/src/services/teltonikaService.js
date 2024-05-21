import axios from 'axios';
import { API_URL } from '../constants/url';


function teltonika(token, userId, deviceImei) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/teltonika/trackmode`, {
      token, 
      userId,
      deviceImei
    }).then(async (response) => {
      try {
        //await setAuthAsyncStorage(response);
        resolve(response);
      } catch (e) { 
        console.log("teltonika::::", e)        
        reject(e) }
    }).catch((err) => {
      console.log("teltonika::::", err)
      reject(err)
    });
  });
}

export const teltonikaService = {
  teltonika
};
