import axios from 'axios';
import { API_URL } from '../constants/url';

function recharge(token, email, username, cardName,
  cardNumber, cardCVV, deviceExpirateDate, amount, deviceImei, expiryMonth, expiryYear) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/payment/charge`, {
      token, 
      email, 
      name: username, 
      cardName,
      cardNumber, 
      cardCVC:cardCVV,
      amount, 
      deviceImei,
      cardExpMonth:expiryMonth,
      cardExpYear: expiryYear,
      expirateDate: deviceExpirateDate
    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("recharge::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("recharge", err.response.data);
      reject(err)
    });
  });
}
export const membershipService = {
  recharge
};
