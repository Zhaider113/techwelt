import {
  AUTH_ERR_LOG_IN,
  AUTH_ERR_LOG_OUT,
  AUTH_ERR_SIGNUP,
  AUTH_LOGGED_IN,
  AUTH_LOGGING_IN,
  AUTH_LOGGING_OUT,
  AUTH_LOGOUT,
  AUTH_SIGNED_UP,
  AUTH_SIGNING_UP,
  AUTH_NEW_USER,
  AUTH_SIGNUP_INITIAL,
} from '../constants/auth';

const init_user = {
  __v: 0,
  _id: null,
  createdAt: null,
  updatedAt: null,
  phone: "",
  password: "",
  name: "",
  email: ""
}

const INITIAL_STATE = {
  user: null,
  token: null,
  loggingIn: false,
  loggingOut: false,
  signingUp: false,
  signedUp:false,
  errorMessageLogin: null,
  errorMessageLogout: null,
  errorMessageSignUp: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_LOGOUT: {
      return {
        ...INITIAL_STATE,
      };
    }

    case AUTH_LOGGING_IN: {
      return {
        ...state,
        errorMessageLogin: action.payload ? null : state.errorMessageLogin,
        errorMessageLogout: null,
        loggingIn: action.payload,
      };
    }

    case AUTH_LOGGING_OUT: {
      return {
        ...state,
        errorMessageLogout: action.payload ? null : state.errorMessageLogout,
        loggingOut: action.payload,
      };
    }

    case AUTH_LOGGED_IN: {
      let { user, token } = action.payload;
      return {
        ...state,
        user,
        token,
        errorMessageLogin: null,
        loggingIn: false,
      };
    }

    case AUTH_ERR_LOG_IN: {
      return {
        ...state,
        errorMessageLogin: action.payload,
      };
    }

    case AUTH_ERR_LOG_OUT: {
      return {
        ...state,
        loggingOut: false,
        errorMessageLogout: action.payload,
      };
    }

    case AUTH_SIGNING_UP: {
      return {
        ...state,
        errorMessageSignUp: null,
        signingUp: action.payload,
      };
    }

    case AUTH_SIGNED_UP: {
      console.log("21",action.payload)
      let { user, token } = action.payload;
      return {
        ...state,
        user,
        token,
        errorMessageSignUp: null,
        signingUp: false,
        signedUp: true, 
      };
    }

    case AUTH_SIGNUP_INITIAL: {
      return {
        ...state,
        signedUp: false, 
      };
    }

    case AUTH_ERR_SIGNUP: {
      return {
        ...state,
        signingUp: false,
        errorMessageSignUp: action.payload,
      };
    }

    case AUTH_NEW_USER: {
      return {
        ...state,
        user: action.payload
      }
    };
    default:
      return state;
  }
}
