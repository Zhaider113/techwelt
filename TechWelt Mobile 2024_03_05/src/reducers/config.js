import {
    GET_MANAGE_EMAIL
} from '../constants/config';

const CONFIG_INITIAL_STATE = {
    manageEmail: '',
};

export default function (state = CONFIG_INITIAL_STATE, action) {
    switch (action.type) {
  
      case GET_MANAGE_EMAIL: {
        return {
          ...state,
          manageEmail: action.payload
        };
      }
      default:
        return state;
    }
}