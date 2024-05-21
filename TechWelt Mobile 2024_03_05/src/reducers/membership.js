import {
  MEMBERSHIP_CHARGE,
  MEMBERSHIP_CHARGE_SUCCESS,
  MEMBERSHIP_CHARGE_FAILED
} from '../constants/membership';

const MEMBERSHIP_INITIAL_STATE = {
  charge: null,
  isCharging: false,
  errorChargeMessage: ''
};

export default function (state = MEMBERSHIP_INITIAL_STATE, action) {
  switch (action.type) {

    case MEMBERSHIP_CHARGE: {
      return {
        ...state,
        isCharging: action.payload,
      };
    }

    case MEMBERSHIP_CHARGE_SUCCESS: {
      let {data} = action.payload;
      return {
        ...state,
        charge: data,
        isCharging: false,
      };
    }

    case MEMBERSHIP_CHARGE_FAILED: {
      return {
        ...state,
        errorChargeMessage: action.payload,
      };
    }
    default:
      return state;
  }
}
