import {
  VEHICLE_SHOWING,
  VEHICLE_SHOWING_FAILED,
  VEHICLE_SHOWING_SUCCESS,
  VEHICLE_UPDATE_DRIVERINFO,
  VEHICLE_SET_PERIOD,
  VEHICLE_SELECTED_ID
} from '../constants/vehicles';

const REALTIME_INITIAL_STATE = {
  vehicles: [],
  isGettingVehicles: false,
  errorVehicleShow: '',
  receivePeriod: 5000,
  seletedvehicleID: 0
};

export default function (state = REALTIME_INITIAL_STATE, action) {
  switch (action.type) {

    case VEHICLE_SHOWING: {
      return {
        ...state,
        isGettingVehicles: action.payload,
      };
    }

    case VEHICLE_SHOWING_SUCCESS: {
      let vehicles = action.payload;
      global.realtimeVehicles = vehicles;
      return {
        ...state,
        vehicles,
        isGettingVehicles: false,
        errorVehicleShow: null,
      };
    }
    
    case VEHICLE_UPDATE_DRIVERINFO: {
      let deviceImei = action.deviceImei;
      let newVehicleName = action.newVehicleName;     

      // var tempVehilces = [...state.vehicles]
      // console.log("@@@@@@@@device update",tempVehilces);
      // var newVehicles = tempVehilces.map((item)=>{
      //   if(item.vehicle.deviceImei == deviceImei)
      //     item.vehicle.vehicleName = newVehicleName
      //   return item;
      // })

      // console.log("@@@@@@@@device update",tempVehilces);
      

      // return {
      //   ...state,
      //   newVehicles,
      //   isGettingVehicles: false,
      //   errorVehicleShow: null,
      // };
    }
    case VEHICLE_SHOWING_FAILED: {
      return {
        ...state,
        errorVehicleShow: action.payload,
      };
    }

    case VEHICLE_SET_PERIOD: {
      const receivePeriod = action.payload
      //console.log("@@@@@@ VEHICLE_SET_PERIOD" , receivePeriod)
      return {
        ...state,
        receivePeriod: receivePeriod
      };

    }
    case VEHICLE_SELECTED_ID: {
      const seletedvehicleID = action.payload;
      return {
        ...state,
        seletedvehicleID: seletedvehicleID
      }
    }
    default:
      return state;
  }
}
