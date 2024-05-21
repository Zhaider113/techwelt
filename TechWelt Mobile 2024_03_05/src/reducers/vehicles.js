import { vehicleList } from '../actions/vehicles';
import {
  VEHICLE_ADDING,
  VEHICLE_REMOVING,
  VEHICLE_ADDING_FAILED,
  VEHICLE_ADDING_SUCCESS,
  VEHICLE_REMOVE_FAILED,
  VEHICLE_REMOVE_SUCCESS,
  VEHICLE_LIST,
  VEHICLE_LIST_FAILED,
  VEHICLE_LIST_SUCCESS,
  VEHICLE_HISTORY,
  VEHICLE_HISTORY_SUCCESS,
  VEHICLE_GPRS_IGNITION,
  VEHICLE_GPRS_RESET,
  VEHICLE_GPRS_SETTRACKMODE,
  VEHICLE_GPRS_RESTART,
  VEHICLE_GPRS_IGNITION_FAILED,
  VEHICLE_GPRS_IGNITION_SUCCESS,
  VEHICLE_GPRS_RESET_FAILED,
  VEHICLE_GPRS_SETTRACKMODE_FAILED,
  VEHICLE_GPRS_RESET_SUCCESS,
  VEHICLE_GPRS_SETTRACKMODE_SUCCESS,
  VEHICLE_GPRS_RESTART_FAILED,
  VEHICLE_GPRS_RESTART_SUCCESS,
  VEHICLE_CONFIRM_NOTIFY_SETTINGS_SUCCESS
} from '../constants/vehicles';

const VEHICLE_INITIAL_STATE = {
  vehiclesList: [],
  isAddingVehicle: false,
  isRemovingVehicle: false,
  isVehicleList: false,
  isLoading: false,
  isVehicleHistory: false,
  errorVehicleAdd: '',
  errorVehicleRemove: '',
  errorVehicleList: '',
  VehicleSettingState: [],
  vehicleHistory: [],
};

export default function (state = VEHICLE_INITIAL_STATE, action) {
  switch (action.type) {

    case VEHICLE_ADDING: {
      return {
        ...state,
        errorVehicleAdd: action.payload ? null : state.errorVehicleAdd,
        isAddingVehicle: action.payload,
      };
    }

    case VEHICLE_ADDING_SUCCESS: {
      return {
        ...state,
        errorVehicleAdd: null,
        isAddingVehicle: false,
      };
    }

    case VEHICLE_ADDING_FAILED: {
      return {
        ...state,
        errorVehicleAdd: action.payload,
      };
    }
    case VEHICLE_REMOVING: {
      return {
        ...state,
        errorVehicleRemove: action.payload ? null : state.errorVehicleRemove,
        isRemovingVehicle: action.payload,
      };
    }

    case VEHICLE_REMOVE_SUCCESS: {
      return {
        ...state,
        errorVehicleRemove: null,
        isRemovingVehicle: false,
      };
    }

    case VEHICLE_REMOVE_FAILED: {
      return {
        ...state,
        errorVehicleRemove: action.payload,
      };
    }
    case VEHICLE_LIST: {
      return {
        ...state,
        isVehicleList: action.payload,
      };
    }

    case VEHICLE_LIST_SUCCESS: {
       let vehicles = action.payload;
       vehicles?.sort((a, b) => {
        const nameA = a.vehicle.vehicleName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.vehicle.vehicleName.toUpperCase(); // ignore upper and lowercase
      
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0; // names must be equal
      });
    
      return {
        ...state,
         vehiclesList: vehicles,
        errorVehicleList: '',
      };
    }

    case VEHICLE_HISTORY: {
      return {
        ...state,
        isVehicleHistory: action.payload,
      };
    }
    case VEHICLE_HISTORY_SUCCESS: {
      let vehicleHistory = action.payload;
      return {
        ...state,
        vehicleHistory: vehicleHistory,
      }
    }

    case VEHICLE_LIST_FAILED: {
      return {
        ...state,
        errorVehicleList: action.payload,
      };
    }

    case VEHICLE_CONFIRM_NOTIFY_SETTINGS_SUCCESS: {
      return {
        ...state,
        VehicleSettingState: action.payload,
      };
    }

    default:
      return state;
  }
}
