import axios from 'axios';
import { API_URL } from '../constants/url';

function addNotification(token, userId, type, vehicle, time) {
  //console.log("@@@@@@@@@@@@ addNotification",token, userId, type, vehicle, time)
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/notifications/createNotify`, {
      token, userId, type, vehicle, time
    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) {
        console.log("addNotification then::::", e)
        reject(e)
      }
    }).catch((err) => {
      console.log("addNotification catch::::", err)
      reject(err)
    });
  });
}

function showNotifications(token, userId) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/notifications/showNotify `, {
      token, userId
    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("showNotifications::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("showNotifications::::", err)
      reject(err)
    });
  });
}

function getNotifications(token, userId,startDate, endTime) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/notifications/getNotify `, {
      token, userId, startDate, endTime
    }).then(async (response) => {
      try {
        console.log(response);
        resolve(response);
      } catch (e) { 
        console.log("getNotifications then::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("getNotifications catch::::", err)
      reject(err)
    });
  });
}

export const notificationService = {
  addNotification,
  showNotifications,
  getNotifications
};
