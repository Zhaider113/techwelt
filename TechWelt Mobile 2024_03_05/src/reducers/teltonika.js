import {
  TELTONIKA_INFO,
  TELTONIKA_INFO_SUCCESS,
  TELTONIKA_INFO_FAILED,
} from '../constants/teltonika';

const INITIAL_STATE = {
  teltonika: null,
  loadingTeltonika: false,
  loadedTeltonika:false,
  errorTeltonikaInfo: null,
  trackMode:''
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    
    case TELTONIKA_INFO: {
      return {
        ...state,
        errorTeltonikaInfo: action.payload ? null : state.errorTeltonikaInfo,
        loadingTeltonika: action.payload,
        loadedTeltonika:false
      };
    }

    case TELTONIKA_INFO_SUCCESS: {
      let {trackMode} = action.payload
      return {
        ...state,
        trackMode,
        errorTeltonikaInfo: null,
        loadingTeltonika: false,
        loadedTeltonika:true
      };
    }

    case TELTONIKA_INFO_FAILED: {
      return {
        ...state,
        errorTeltonikaInfo: action.payload,
      };
    }
        default:
      return state;
  }
}
