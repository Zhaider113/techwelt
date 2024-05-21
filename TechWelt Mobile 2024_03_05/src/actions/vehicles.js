import axios from 'axios';
import {
  VEHICLE_ADDING,
  VEHICLE_UPDATING,
  VEHICLE_UPDATING_SUCCESS,
  VEHICLE_REMOVING,
  VEHICLE_SHOWING,
  VEHICLE_ADDING_FAILED,
  VEHICLE_UPDATING_FAILED,
  VEHICLE_ADDING_SUCCESS,
  VEHICLE_REMOVE_FAILED,
  VEHICLE_REMOVE_SUCCESS,
  VEHICLE_SHOWING_FAILED,
  VEHICLE_SHOWING_SUCCESS,
  VEHICLE_UPDATE_DRIVERINFO,
  VEHICLE_LIST,
  VEHICLE_LIST_FAILED,
  VEHICLE_LIST_SUCCESS,
  VEHICLE_HISTORY,
  VEHICLE_HISTORY_SUCCESS,
  VEHICLE_HISTORY_FAILED,
  VEHICLE_SELECTED_ID,
  VEHICLE_SET_PERIOD,
  VEHICLE_GPRS_IGNITION,
  VEHICLE_GPRS_BULETOOTH,
  VEHICLE_GPRS_RESET,
  VEHICLE_GPRS_SETTRACKMODE,
  VEHICLE_GPRS_RESTART,
  VEHICLE_GPRS_IGNITION_FAILED,
  VEHICLE_GPRS_BULETOOTH_FAILED,
  VEHICLE_GPRS_IGNITION_SUCCESS,
  VEHICLE_GPRS_BULETOOTH_SUCCESS,
  VEHICLE_GPRS_RESET_FAILED,
  VEHICLE_GPRS_SETTRACKMODE_FAILED,
  VEHICLE_GPRS_RESET_SUCCESS,
  VEHICLE_GPRS_SETTRACKMODE_SUCCESS,
  VEHICLE_GPRS_RESTART_FAILED,
  VEHICLE_GPRS_RESTART_SUCCESS,
  VEHICLE_CONFIRM_NOTIFY_SETTINGS,
  VEHICLE_CONFIRM_NOTIFY_SETTINGS_SUCCESS,
  VEHICLE_CONFIRM_NOTIFY_SETTINGS_FAILED
} from '../constants/vehicles';

import { toastr } from "../services/navRef";
import { vehicleService } from "../services/vehicleService";
import { API_URL } from '../constants/url';

export const showingVehicles = (isGettingVehicles) => ({
  type: VEHICLE_SHOWING,
  payload: isGettingVehicles
});

export const successShowVehicles = (data) => ({
  type: VEHICLE_SHOWING_SUCCESS,
  payload: data,
});

export const updateDriverInfoReducer = (deviceImei,newVehicleName) => ({
  type: VEHICLE_UPDATE_DRIVERINFO,
  deviceImei: deviceImei,
  newVehicleName: newVehicleName
});

export const errorShowingVehicles = (errorMessage) => ({
  type: VEHICLE_SHOWING_FAILED,
  payload: errorMessage,
});

export const setSelectedVehicleID = (index) => ({
  type: VEHICLE_SELECTED_ID,
  payload: index
});

export const getRealtimeVehicles = (token, userId) => (dispatch) => {
  dispatch(showingVehicles(true));
  vehicleService.realtimeVehiclesData(token, userId).then(async (res) => {
    console.log("@realtime ShowVehicle Data : ",res.data);
    await dispatch(successShowVehicles(res.data));
  }).catch((err) => {
    console.log("@ShowVehicle Err : ",err);
    // dispatch(errorShowingVehicles('No Available server!'));
  }).finally(() => {
    dispatch(showingVehicles(false));
  });
};

export const deletePolygonData = (token, deviceImei, index, userId) => (dispatch) => {
  vehicleService.deletePolygonData(token, deviceImei, index)
    .then(async (res) => {
      toastr(res.data)
    })
    .catch((error) => {
      toastr("An error occured")
    })
    .finally(() => {
      dispatch(getRealtimeVehicles(token, userId));
    })
}

export const action_vehicle_list = (isVehicleList) => ({
  type: VEHICLE_LIST,
  payload: isVehicleList
});
export const action_vehicle_history = (isvehicleHistory) => ({
  type: VEHICLE_HISTORY,
  payload: isvehicleHistory
});

export const successVehicleList = (data) => ({
  type: VEHICLE_LIST_SUCCESS,
  payload: data,
});

export const successVehicleHsitory = (data) => ({
  type: VEHICLE_HISTORY_SUCCESS,
  payload: data,
});

export const errorVehicleList = (errorMessage) => ({
  type: VEHICLE_LIST_FAILED,
  payload: errorMessage,
});

export const vehicleList = (token, userId) => (dispatch) => {
  dispatch(action_vehicle_list(true));
  vehicleService.vehicleList(token, userId).then(async (res) => {
    await dispatch(successVehicleList(res.data));
  }).catch((err) => {
    dispatch(errorVehicleList("Something went worng!"));
  }).finally(() => {
    dispatch(action_vehicle_list(false));
  });
};

export const vehicleHistory = (token, deviceImei, firstDate, secondDate) => (dispatch) => {

  dispatch(action_vehicle_history(true));
  //console.log("@@@@@@@action history",deviceImei,firstDate.secondDate)
  vehicleService.vehicleHistory(token, deviceImei, firstDate, secondDate)
    .then(
      async (res) => {
        // console.log("################",res.data)
        await dispatch(successVehicleHsitory(res.data));
      })
    .catch((error) => {
      // console.log("An error occured while vehicle history", error);
    })
    .finally(() => {
      dispatch(action_vehicle_history(false));
    })
};

export const addingVehicles = (isAddingVehicle) => ({
  type: VEHICLE_ADDING,
  payload: isAddingVehicle
});

export const updatingVehicles = (isAddingVehicle) => ({
  type: VEHICLE_UPDATING,
  payload: isAddingVehicle
});

export const successAddVehicles = (data) => ({
  type: VEHICLE_ADDING_SUCCESS,
  payload: data,
});

export const successUpdateVehicles = (data) => ({
  type: VEHICLE_UPDATING_SUCCESS,
  payload: data,
});

export const errorAddVehicles = (errorMessage) => ({
  type: VEHICLE_ADDING_FAILED,
  payload: errorMessage,
});

export const errorUpdateVehicles = (errorMessage) => ({
  type: VEHICLE_UPDATING_FAILED,
  payload: errorMessage,
});


export const addVehicles = (data, navigation) => (dispatch) => {
  dispatch(addingVehicles(true));

  vehicleService.addVehicles(data)
    .then(async (res) => {
    // await dispatch(vehicleList(data.token, data.userId));
    await dispatch(successAddVehicles(res.data));
    // await navigation.navigate('MapScreen');
    await navigation.goBack();
    toastr('Vehicle is added.');
  })
  .catch((err) => {
    console.log("@@@AddVehicle Err:", err);
    dispatch(errorAddVehicles(err.response.data.message));
    toastr(err.response.data.message);
  })
  .finally(() => {
    console.log("@@@AddVehicle Final:");
      dispatch(addingVehicles(false));
    });
};

export const updateVehicles = (data, navigation) => (dispatch) => {
  dispatch(updatingVehicles(true));

  vehicleService.updateVehicles(data)
    .then(async (res) => {
      console.log("@@@EditVehicle Result:", res.data);
    await dispatch(vehicleList(data.token, data.userId));
    await dispatch(successUpdateVehicles(res.data));
    // await navigation.navigate('MapScreen');
    await navigation.goBack();
    toastr('Vehicle is updated.');
  })
    .catch((err) => {
      console.log("@@@EditVehicle Err:", err);
      dispatch(errorUpdateVehicles(err.response.data.message));
      toastr(err.response.data.message);
    })
    .finally(() => {
      dispatch(updatingVehicles(false));
    });
};
export const removingVehicles = (isRemovingVehicle) => ({
  type: VEHICLE_REMOVING,
  payload: isRemovingVehicle
});

export const successRemoveVehicles = (data) => ({
  type: VEHICLE_REMOVE_SUCCESS,
  payload: data,
});

export const errorRemoveVehicles = (errorMessage) => ({
  type: VEHICLE_REMOVE_FAILED,
  payload: errorMessage,
});

export const deleteVehicle = (token, userId, imei, navigation) => (dispatch) => {
  console.log("@@Delete IMEI: ", imei)
  dispatch(removingVehicles(true));
  vehicleService.deleteVehicle(token, imei).then(async (res) => {
    console.log("@@Delete Vehicle Result: ", res.data);
    //await dispatch(vehicleList(token, userId));
    await dispatch(vehicleList(token, userId));
    await dispatch(successRemoveVehicles(res.data));
    //await navigation.navigate('MapScreen');
    toastr('Vehicle is deleted.');
    // toastr(res.data.message);
  }).catch((err) => {
    console.log("@@Delete Vehicle Err: ", err);

    dispatch(errorRemoveVehicles('Wrong Vehicle info!'));
    toastr(err.message);
  }).finally(() => {
    dispatch(removingVehicles(false));
  });
};

export const setTrackingMode = (token, deviceImei, onStop, onMove) => (dispatch) => {
  vehicleService.setTrackingMode(token, deviceImei, onStop, onMove)
    .then(async (res) => {
      console.log(">>>setTrackingMode : ", res.data);
      // toastr(res.data.message);
    }).catch((err) => {
      console.log(">>>setTrackingMode Err:", err)
      toastr(err.message);
    });
}

export const setLimitSpeed = (token, deviceImei, speed) => (dispatch) => {
  vehicleService.setLimitSpeed(token, deviceImei, speed)
    .then(async (res) => {
      console.log(">>>setLimitSpeed : ", res.data);
      // toastr(res.data.message);
    }).catch((err) => {
      console.log(">>>setLimitSpeed Err:", err)
      toastr(err.message);
    });
}

export const setLimitFuel = (token, deviceImei, fuel) => (dispatch) => {
  vehicleService.setLimitFuel(token, deviceImei, fuel)
    .then(async (res) => {
      console.log(">>>setLimitFuel : ", res.data);
      // toastr(res.data.message);
    }).catch((err) => {
      console.log(">>>setLimitFuel Err:", err)
      toastr(err.message);
    });
}

export const setLimitTemp = (token, deviceImei, highTemp, lowTemp) => (dispatch) => {
  vehicleService.setLimitTemp(token, deviceImei, highTemp, lowTemp)
    .then(async (res) => {
      console.log(">>>setLimiTemp : ", res.data);
      // toastr(res.data.message);
    }).catch((err) => {
      console.log(">>>setLimiTemp Err:", err)
      toastr(err.message);
    });
}


export const setReceivePeriod = (receivePeriod) => (dispath) => {
  
  dispath(setReceivePeriod_R(parseInt(receivePeriod)));

}

export const setReceivePeriod_R = (receivePeriod) => ({
  type: VEHICLE_SET_PERIOD,
  payload: parseInt(receivePeriod) * 1000
});


export const saveGeofensePos = (data) => (dispatch) => {
  axios.post(`${API_URL}/vehicles/savegeofence`, data).then(async (response) => {
    try {
      console.log("Success:::", response.data)
      await dispatch(vehicleList(data.token, data.userId));

      toastr(response.data)
    } catch (e) {
      console.log("Error occured::::", e)
    }
  }).catch((err) => {
    console.log("An save error occured::::", err)
  });
}

export const updateGeofensePos = (token, deviceImei, polygonData, enter, sortie, index, title, content, selPointData) => (dispatch) => {

  axios.post(`${API_URL}/vehicles/updategeofence`, {
    token: token,
    deviceImei: deviceImei,
    polygonData: polygonData,
    enter: enter,
    sortie: sortie,
    index: index,
    title: title,
    content: content,
    selPointData : selPointData
  }).then(async (response) => {
    try {
      console.log("Success:::", response.data)
      toastr(response.data)
    } catch (e) {
      console.log("Error occured::::", e)
    }
  }).catch((err) => {
    console.log("An update error occured::::", err)
  });
}

export const sendingIgnition = (isLoading) => ({
  type: VEHICLE_GPRS_IGNITION,
  payload: isLoading
});

export const sendingBluetooth = (isLoading) => ({
  type: VEHICLE_GPRS_BULETOOTH,
  payload: isLoading
});

export const successBluetooth = (isLoading) => ({
  type: VEHICLE_GPRS_BULETOOTH_SUCCESS,
  payload: isLoading,
});

export const failedBluetooth = () => ({
  type: VEHICLE_GPRS_BULETOOTH_FAILED,
});

export const successIgnition = (isLoading) => ({
  type: VEHICLE_GPRS_IGNITION_SUCCESS,
  payload: isLoading,
});

export const failedIgnition = () => ({
  type: VEHICLE_GPRS_IGNITION_FAILED,
});


export const sendGprsBluetooth = (token,deviceImei,command,param) => (dispatch) => {
  //console.log("@@@@sendGprsBluetooth",deviceImei,command,param)
  dispatch(sendingBluetooth(true));
  vehicleService.sendGprsBluetooth(token, deviceImei,command,param).then(async (res) => {
    await dispatch(successBluetooth(false));
  }).catch((err) => {
    dispatch(failedBluetooth(err.message));
  }).finally(() => {
    dispatch(sendingBluetooth(false));
  });
}

export const sendGprsIgnition = (token,deviceImei,command,param) => (dispatch) => {
  console.log("!!!!!!!!", token,deviceImei,command,param)
  dispatch(sendingIgnition(true));
  vehicleService.sendGprsIgnition(token, deviceImei,command,param).then(async (res) => {
    await dispatch(successIgnition(false));
  }).catch((err) => {
    dispatch(failedIgnition(err.message));
  }).finally(() => {
    dispatch(sendingIgnition(false));
  });
}

export const sendingRestart = (isLoading) => ({
  type: VEHICLE_GPRS_RESTART,
  payload: isLoading
});

export const successRestart = (isLoading) => ({
  type: VEHICLE_GPRS_RESTART_SUCCESS,
  payload: isLoading,
});

export const failedRestart = () => ({
  type: VEHICLE_GPRS_RESTART_FAILED,
});


export const sendGprsRestart = (token, deviceImei,command,param) => (dispatch) => {
  console.log(">>>>>>>Restart Res", token, deviceImei, command, param)
  dispatch(sendingRestart(true));
  vehicleService.sendGprsRestart(token, deviceImei,command,param).then(async (res) => {
    console.log(">>>>>>>Restart Res", res)
    await dispatch(successRestart(false));
  }).catch((err) => {
    console.log(">>>>>>>Restart Res", err)
    dispatch(failedRestart(err.message));
  }).finally(() => {
    toastr("SUCESS")
    dispatch(sendingRestart(false));
  });
}

export const sendCommand = (data, navigation) => (dispatch) => {
  console.log(">>>>>>>Send Command ", data)
  // dispatch(sendingRestart(true));
  vehicleService.sendCommand(data).then(async (res) => {
    console.log(">>>>>>>Send Command Res", res)
    // await dispatch(successRestart(false));
  }).catch((err) => {
    console.log(">>>>>>>Send Command Err", err)
    // dispatch(failedRestart(err.message));
  }).finally(() => {
    console.log(">>>>>>>Send Command Final")
    // dispatch(sendingRestart(false));
  });
}



export const sendingReset = (isLoading) => ({
  type: VEHICLE_GPRS_RESET,
  payload: isLoading
});

export const sendingSetTrackMode = (isLoading) => ({
  type: VEHICLE_GPRS_SETTRACKMODE,
  payload: isLoading
});

export const successReset = (isLoading) => ({
  type: VEHICLE_GPRS_RESET_SUCCESS,
  payload: isLoading,
});

export const successSetTrackMode = (isLoading) => ({
  type: VEHICLE_GPRS_SETTRACKMODE_SUCCESS,
  payload: isLoading,
});

export const failedReset = () => ({
  type: VEHICLE_GPRS_RESET_FAILED,
});

export const failedSetTrackMode = () => ({
  type: VEHICLE_GPRS_SETTRACKMODE_FAILED,
});

export const sendGprsReset = (token,deviceImei,command,param) => (dispatch) => {
  //console.log(dispatch);
  dispatch(sendingReset(true));
  vehicleService.sendGprsReset(token,deviceImei,command,param).then(async (res) => {
    await dispatch(successReset(false));    
  }).catch((err) => {
    dispatch(failedReset(err.message));
  }).finally(() => {
    dispatch(sendingReset(false));
  });
}

export const sendSetTrackMode = (token,deviceImei,command,param) => (dispatch) => {
  //console.log("@@@@@@@@@sendSetTrackMode ",deviceImei,command,param)
  dispatch(sendingSetTrackMode(true));
  vehicleService.sendSetTrackMode(token,deviceImei,command,param).then(async (res) => {
    await dispatch(successSetTrackMode(false));    
  }).catch((err) => {
    dispatch(failedSetTrackMode(err.message));
  }).finally(() => {
    dispatch(sendingSetTrackMode(false));
  });
}

export const sendingConfirmNotify = (isLoading) => ({
  type: VEHICLE_CONFIRM_NOTIFY_SETTINGS,
  payload: isLoading
});

export const successConfirmNotify = (payload) => ({
  type: VEHICLE_CONFIRM_NOTIFY_SETTINGS_SUCCESS,
  payload: payload,
});

export const failedConfirmNotify = () => ({
  type: VEHICLE_CONFIRM_NOTIFY_SETTINGS_FAILED,
});

export const confirmNotificationSettings = (token, deviceImei,
  isVibration, isMovement, isStop, isEnterZone, isSortZone, isOverspeed, isDetachment, navigation) => (dispatch) => {

    // console.log("🚀 ~ file: vehicles.js:259 ~ deviceImei:", deviceImei)
    // console.log("user: ", user)
    // console.log("isVibration: ", isVibration)
    // console.log("isMovement: ", isMovement)
    // console.log("isStop: ", isStop)
    // console.log("isEnterZone: ", isEnterZone)
    // console.log("isSortZone: ", isSortZone)
    // console.log("isOverspeed: ", isOverspeed)
    // console.log("isDetachment: ", isDetachment)


    dispatch(sendingConfirmNotify(true));
    vehicleService.confirmNotificationSettings(token, deviceImei,
      isVibration, isMovement, isStop, isEnterZone, isSortZone, isOverspeed, isDetachment).then(async (res) => {
        // await dispatch(successConfirmNotify(res.data));
        await dispatch(successConfirmNotify([isVibration, isMovement, isStop, isEnterZone, isSortZone, isOverspeed, isDetachment]));
        toastr('Notification settings updated');
      }).catch((err) => {
        dispatch(failedConfirmNotify(err.message));
      }).finally(() => {
        dispatch(sendingConfirmNotify(false));
      });
  }

  export const updateDriverInfo = (token, deviceImei, newVehicleName,tempReducer,infos) => (dispatch) => {
  
      // console.log("🚀 ~ file: vehicles.js:404 ~ deviceImei:", deviceImei)
      // console.log("token: ", token)
      // console.log("newDeviceImei: ", newDeviceImei)
      // console.log("newVehicleName: ", newVehicleName)
 
  
      //dispatch(sendingConfirmNotify(true));
      vehicleService.updateDriverInfo(token, deviceImei, newVehicleName)
        .then(async (res) => {
          // await dispatch(successConfirmNotify(res.data));
          //await dispatch(successConfirmNotify([isVibration, isMovement, isStop, isEnterZone, isSortZone, isOverspeed, isDetachment]));

          //console.log("@@@@@@wwwwww ",deviceImei, newVehicleName)
          //await dispatch(updateDriverInfoReducer(deviceImei,newVehicleName));
          await dispatch(successShowVehicles(tempReducer));
          global.selItem = infos;
          toastr('Driver Infomation updated');
        }).catch((err) => {
          //dispatch(failedConfirmNotify(err.message));
          toastr(err.message);
        }).finally(() => {
          //dispatch(sendingConfirmNotify(false));
        });
    }

    export const updateDeviceName = (token, deviceImei, newDeviceName,tempReducer,infos) => (dispatch) => {
   
       // console.log("🚀 ~ file: vehicles.js:404 ~ deviceImei:", deviceImei)
       // console.log("token: ", token)
       // console.log("newDeviceImei: ", newDeviceImei)
       // console.log("newDeviceName: ", newDeviceName)
  
   
       //dispatch(sendingConfirmNotify(true));
       vehicleService.updateDeviceName(token, deviceImei, newDeviceName)
         .then(async (res) => {
           // await dispatch(successConfirmNotify(res.data));
           //await dispatch(successConfirmNotify([isVibration, isMovement, isStop, isEnterZone, isSortZone, isOverspeed, isDetachment]));
           await dispatch(successShowVehicles(tempReducer));
           global.selItem = infos;
           toastr('DeviceName updated');
         }).catch((err) => {
           //dispatch(failedConfirmNotify(err.message));
           toastr(err.message);
         }).finally(() => {
           //dispatch(sendingConfirmNotify(false));
         });
     }