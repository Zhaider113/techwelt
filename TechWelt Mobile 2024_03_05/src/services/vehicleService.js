import axios from 'axios';
import { API_URL} from '../constants/url';
import { toastr } from "../services/navRef";
import user from '../reducers/user';

function addVehicles(data) {
  return new Promise((resolve, reject) => {

    axios.post(`${API_URL}/vehicles/create`, data)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          console.log("addVehicles::::", e)
          reject(e)
        }
      }).catch((err) => {
        console.log("addVehicles::::", err)
        reject(err)
      });
  });
}

function updateVehicles(data) {
  return new Promise((resolve, reject) => {

    axios.post(`${API_URL}/vehicles/update`, data)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          console.log("addVehicles::::", e)
          reject(e)
        }
      }).catch((err) => {
        console.log("addVehicles::::", err)
        reject(err)
      });
  });
}

function realtimeVehiclesData(token, userId) {

  //console.log("@@realtimeVehiclesData", token, userId)
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/maps`, {
      token, userId
    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("realtimeVehiclesData then::::", e)
        reject(e) 
      }
    }).catch((err) => {
      console.log("realtimeVehiclesData catch::::", err)
      reject(err)
    });
  });
}

function deleteVehicle(token, imei) {
  console.log(" token and imei are ", token, imei);
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/remove`, {
      token: token,
      deviceImei: imei
    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("deleteVehicle:::: then", e)
        reject(e) }
    }).catch((err) => {
      console.log("deleteVehicle:::: catch", err)
      reject(err)
    });
  });
}

function deletePolygonData(token, deviceImei, index) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/removePolygon`, {
      token: token,
      deviceImei: deviceImei,
      index: index
    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("deletePolygonData::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("deletePolygonData::::", err)
      reject(err)
    });
  });
}

function setTrackingMode(token, deviceImei, onStop, onMove) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/trackingMode`, {
      token: token,
      deviceImei: deviceImei,
      onStop: onStop,
      onMove: onMove

    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("setLimitSpeed::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("setLimitSpeed::::", err)
      reject(err)
    });
  });
}

function setLimitSpeed(token, deviceImei, speed) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/limitSpeed`, {
      token: token,
      deviceImei: deviceImei,
      speed: speed

    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("setLimitSpeed::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("setLimitSpeed::::", err)
      reject(err)
    });
  });
}

function setLimitFuel(token, deviceImei, fuel) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/limitFuel`, {
      token: token,
      deviceImei: deviceImei,
      fuel: fuel

    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("setLimitFuel::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("setLimitFuel::::", err)
      reject(err)
    });
  });
}

function setLimitTemp(token, deviceImei, highTemp, lowTemp) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/limitTemp`, {
      token: token,
      deviceImei: deviceImei,
      highTemp: highTemp,
      lowTemp: lowTemp

    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("setLimitFuel::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("setLimitFuel::::", err)
      reject(err)
    });
  });
}

function vehicleList(token, userId) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/show`, {
      token, userId
    })
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) { 
          console.log("vehicleList::::", e)
          reject(e) }
      })
      .catch((err) => {
        console.log("vehicleList::::", err)
        reject(err)
      });
  });
}

function vehicleHistory(token, deviceImei, firstDate, secondDate) {

  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/history`, {
      token, deviceImei, firstDate, secondDate
    })
      .then(
        async (response) => {
          try {
            resolve(response);
          }
          catch (e) {
            console.log("vehicleList::::", e)
            reject(e)
          }
        }
      )
      .catch((error) => {
        console.log("API ERROR",error)
        reject(error)
      });
  });
}

function confirmNotificationSettings(token, deviceImei,
  isVibration, isMovement, isStop, isEnterZone, isSortZone, isOverspeed, isDetachment) {

    //     console.log("🚀 ~ file: vehicles.js:259 ~ deviceImei:", deviceImei)
    // console.log("user: ", user)
    // console.log("isVibration: ", isVibration)
    // console.log("isMovement: ", isMovement)
    // console.log("isStop: ", isStop)
    // console.log("isEnterZone: ", isEnterZone)
    // console.log("isSortZone: ", isSortZone)
    // console.log("isOverspeed: ", isOverspeed)
    // console.log("isDetachment: ", isDetachment)


    return new Promise((resolve, reject) => {
      axios.put(`${API_URL}/vehicles/update`, {
        token, deviceImei,
        isVibration, isMovement, isStop, isEnterZone, isSortZone, isOverspeed, isDetachment
      }).then(async (response) => {
        try {
          resolve(response);
        } catch (e) { 
          console.log("confirmNotificationSettings::::", e)
          reject(e) 
        }
      }).catch((err) => {
        console.log("confirmNotificationSettings::::", err)
        reject(err) 
    });
  });
}

function updateDriverInfo(token, deviceImei, newVehicleName) {

    // console.log("🚀 ~ file: vehicles.js:259 ~ deviceImei:", deviceImei)
    // console.log("deviceImei: ", deviceImei)
    // console.log("newDeviceImei: ", newDeviceImei)
    // console.log("newVehicleName: ", newVehicleName)


    return new Promise((resolve, reject) => {
      axios.put(`${API_URL}/vehicles/driverinfo`, {
        token, deviceImei, newVehicleName
      }).then(async (response) => {
        try {
          resolve(response);
        } catch (e) { 
          console.log("updateDriverInfo::::", e)
          reject(e) 
        }
      }).catch((err) => {
        console.log("updateDriverInfo::::", err)
        reject(err) 
    });
  });
}

function updateDeviceName(token, deviceImei, newDeviceName) {

  // console.log("🚀 ~ file: vehicles.js:259 ~ deviceImei:", deviceImei)
  // console.log("deviceImei: ", deviceImei)
  // console.log("newDeviceImei: ", newDeviceImei)
  // console.log("newDeviceName: ", newDeviceName)


  return new Promise((resolve, reject) => {
    axios.put(`${API_URL}/vehicles/devicename`, {
      token, deviceImei, newDeviceName
    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("updateDeviceName then::::", e)
        reject(e) 
      }
    }).catch((err) => {
      console.log("updateDeviceName catch::::", err)
      reject(err) 
  });
});
}


function getCmdResult(token,deviceImei,command) {

  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/cmdresult`, {
      token,deviceImei,command
    }).then(async (response) => {
      try {
        //resolve(response.data.data);
        console.log("getcmdresult func",response.data)
        let isCallRepeat = false;
        if(response.data.cmdResult != ''){
          console.log("getcmdresult func not blank",response.data.cmdResult)
          if(response.data.cmdResult){
            if(response.data.cmdResult == "true")
              toastr(response.data.cmdResStr);
            else
              toastr("Get Command Result failed");
          }else{
            isCallRepeat = true;
          }
        }else{
          isCallRepeat = true;
        }
        if(isCallRepeat){
          // repeat send request to server
          //console.log("getcmdresult func reapeat ",global.g_CntGetCmdResult,new Date());
          setTimeout(() => {
          }, 1000*45);

          //console.log(new Date())
          global.g_CntGetCmdResult++;
          if(global.g_CntGetCmdResult < 35) 
            getCmdResult(token,deviceImei,command);
          else
            console.log("getcmdresult func reapeat limit",global.g_CntGetCmdResult)
        }
      } catch (e) { 
        console.log("getCmdResult then::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("getCmdResult catch::::", err)
      reject(err)
    });
    console.log("🚀 ~ file: getCmdResult func : ", deviceImei,command)
  });
}


function sendGprsBluetooth(token,deviceImei,command,param) {
  //console.log("🚀 ~ file: vehicleService.js:110 ~ sendGprsBluetooth ~ token, ip, port:", token, ip, port)

  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/bluetooth`, {
      token,deviceImei,command,param
    }).then(async (response) => {
      try {
        resolve(response.data.data);
        toastr("Command Send Succes");
        getCmdResult(token,deviceImei,command);
      } catch (e) { 
        console.log("sendGprsBluetooth then::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("sendGprsBluetooth catch::::", err)
      reject(err)
    });
    console.log("🚀 ~ file: sendGprsBluetooth : ", token, deviceImei,command,param)
  });
}

function sendGprsIgnition(token,deviceImei,command,param) {
  console.log("^^^", token, deviceImei, command, param)
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/ignition`, {
      token,deviceImei,command,param
    }).then(async (response) => {
      try {
        resolve(response.data.data);
        toastr("Command Send Succes")
        //console.log("sendGprsIgnition::::")
      } catch (e) { 
        console.log("sendGprsIgnition then::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("sendGprsIgnition catch::::", err)
      reject(err)
    });
    console.log("🚀 ~ file: sendGprsIgnition func token : ", token, deviceImei,command,param);
  });
}

function sendGprsReset(token,deviceImei,command,param) {
  //console.log("🚀 ~ file: vehicleService.js:126 ~ sendGprsReset ~ token, ip, port:", token, ip, port)
  
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/reset`, {
      token,deviceImei,command,param
    }).then(async (response) => {
      try {
        resolve(response);
        toastr("Command Send Succes");
      } catch (e) { 
        console.log("sendGprsReset::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("sendGprsReset::::", err)
      reject(err)
    });
  });
}

function sendSetTrackMode(token, deviceImei,command,param) {
  //console.log("🚀 ~ file: vehicleService.js:126 ~ sendGprsReset ~ token, ip, port:", token, ip, port)
  //console.log("@@@@@@@@@sendSetTrackMode ve ",value)
  
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/settrackmode`, {
      token,deviceImei,command,param
    }).then(async (response) => {
      try {
        resolve(response);
        toastr("Command Send Succes");
      } catch (e) { 
        console.log("sendSetTrackMode::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("sendSetTrackMode::::", err)
      reject(err)
    });
  });
}

function sendGprsRestart(token, deviceImei,command,param) {

  //console.log("🚀 ~ file: vehicleService.js:201 ~ sendGprsRestart ~ token, ip, port:", token)
  
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/vehicles/reset`, {
      token, deviceImei,command,param
    }).then(async (response) => {
      try {
        resolve(response);
        toastr("Command Send Succes")
      } catch (e) { 
        console.log("sendGprsRestart::::", e)
        reject(e) }
    }).catch((err) => {
      console.log("sendGprsRestart::::", err)
      reject(err)
    });
  });
}

function sendCommand(data) {
  return new Promise((resolve, reject) => {
    // axios.post(`${API_URL}/vehicles/sendCommand`, data).then(async (response) => {
    axios.post(`${API_URL}/vehicles/ignition`, data).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        reject(e) }
    }).catch((err) => {
      reject(err)
    });
  });
}

export const vehicleService = {
  addVehicles,
  updateVehicles,
  realtimeVehiclesData,
  vehicleList,
  vehicleHistory,
  deleteVehicle,
  sendGprsBluetooth,
  sendGprsIgnition,
  sendGprsRestart,
  sendGprsReset,
  sendSetTrackMode,
  confirmNotificationSettings,
  updateDeviceName,
  updateDriverInfo,
  setTrackingMode,
  setLimitSpeed,
  setLimitFuel,
  setLimitTemp,
  deletePolygonData,
  sendCommand
};
