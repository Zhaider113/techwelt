import {
  AUTH_ERR_LOG_IN,
  AUTH_ERR_LOG_OUT,
  AUTH_LOGGED_IN,
  AUTH_LOGGING_IN,
  AUTH_LOGGING_OUT,
  AUTH_LOGOUT,
  AUTH_SIGNED_UP,
  AUTH_SIGNING_UP,
  AUTH_ERR_SIGNUP,
  AUTH_NEW_USER,
  AUTH_SIGNUP_INITIAL,
  AUTH_RESENDING_EMAIL, AUTH_RESENT_EMAIL, AUTH_ERR_RESEND_EMAIL,
  
} from "../constants/auth";

import { toastr } from "../services/navRef";
import { userService } from "../services/userService";
import { teltonika } from "./teltonika";
import { showVehicles } from '../actions/vehicles';
import * as FileSystem from 'expo-file-system';

export const loggingIn = (loggingIn) => ({
  type: AUTH_LOGGING_IN,
  payload: loggingIn
});

export const loggedIn = (data) => ({
  type: AUTH_LOGGED_IN,
  payload: data,
});

export const errorLogIn = (errorMessage) => ({
  type: AUTH_ERR_LOG_IN,
  payload: errorMessage,
});

export const login = (saveFlag, username, password, type, navigate) => (dispatch) => {
  dispatch(loggingIn(true));
  global.userPwd = password;
  userService.login(saveFlag, username, password, type).then(async (res) => {
    await dispatch(loggedIn(res.data));
    await navigate.navigate("MainScreen");

    global.GOOGLE_MAPS_API_KEY = res.data.apikey
    global.userToken = res.data.token;
    global.userID = res.data.user._id;
    global.userPwd = password;
    //dispatch(getRealtimeVehicles(res.data.token, res.data.user._id));

    let strTemp = `${username}@@@@@@@${password}`;
    // writeTokenInfo(strTemp)
  }).catch(error => {
    toastr( error.response && error.response.data && error.response.data.message ? error.response.data.message : "Login Error");
    dispatch(errorLogIn('Wrong username or password'));
  }).finally(() => {
    dispatch(loggingIn(false));
  }
  )
};

const writeTokenInfo = (token) =>{

  FileSystem.writeAsStringAsync(global.Token_FilePath,token,{ encoding: 'utf8' })
  .then(() =>{
    // console.log("@@@@@@write token file result token",token)
    global.savedToken = token;
  })
  .catch((err)=>{
    // console.log("@@@@@@write token file error",err)
  })
}

export const loggedOut = () => ({
  type: AUTH_LOGOUT,
});

export const loggingOut = (lOut) => ({
  type: AUTH_LOGGING_OUT,
  payload: lOut,
});

export const errorLogOut = (errorMessage) => ({
  type: AUTH_ERR_LOG_OUT,
  payload: errorMessage,
});

export const logout = (navigate) => async (dispatch, getState) => {
  dispatch(loggingOut(true));
  await userService.logout(getState).then((res) => {
    dispatch(loggedOut());
    navigate.navigate('LoginBoard');
  }).catch((err) => {
    dispatch(errorLogOut('Error logging out.'));
  }).finally(() => {
    dispatch(loggingOut(false));
  });
};


export const signup = (data, navigate) => (dispatch) => {
  dispatch(signingUp(true));
  userService.signup(data)
    .then(async (res) => {
      console.log("@@sign up::::", res.data)
        await dispatch(signedUp(res.data));
        toastr("Please Check Email For Verification.")
    })
    .catch((error) => {
      console.log(">>>>>>>>", error);
      dispatch(errorSignUp('SignUp Failed!'));
    })
    .finally(() => {
      dispatch(signingUp(false));
    });
};

export const changePassword = (userId, oldPassword, newPassword) => (dispatch) => {
  userService.changePassword(userId, oldPassword, newPassword)
    .then(async (res) => {
      toastr(res.data.message);
      //console.log(res.data.message);
    })
    .catch((error) => {
      if (error.response) {
        // Handle error with HTTP status code
        // console.error(error.response.data.message);
        toastr(error.response.data.message);
      }
      else if (error.request) {
        // Handle error connecting to server
        toastr('Error connecting to server.');
      }
      else {
        // Handle other errors
        //console.error('Error:', error.message);
        toastr('Error:', error.message);
      }
    })
    .finally(() => {
    });
};

export const changeEmail = (userId, newEmail) => (dispatch) => {

  userService.changeEmail(userId, newEmail)
    .then(async (res) => {
      toastr(res.data.message);
      console.log("res.data", res.data.user);
      dispatch(changeUser(res.data.user));
    })
    .catch((error) => {
      if (error.response) {
        toastr(error.response.data.message);
      }
      else if (error.request) {
        // Handle error connecting to server
        toastr('Error connecting to server.');
      }
      else {
        // Handle other errors
        //console.error('Error:', error.message);
        // toastr('Error:', error.message);
      }
    })
    .finally(() => {
    });
};

export const changeUserName = (userId, newUserName) => (dispatch) => {

  userService.changeUserName(userId, newUserName)
    .then(async (res) => {
      toastr(res.data.message);
      await dispatch(changeUser(res.data.user));
      console.log(res.data.message);
    })
    .catch((error) => {
      if (error.response) {
        // Handle error with HTTP status code
        // console.error(error.response.data.message);
        toastr(error.response.data.message);
      }
      else if (error.request) {
        // Handle error connecting to server
        toastr('Error connecting to server.');
      }
      else {
        // Handle other errors
        //console.error('Error:', error.message);
        // toastr('Error:', error.message);
      }
    })
    .finally(() => {
    });
};

export const changePhoneNumber = (userId, newPhoneNumber) => (dispatch) => {

  userService.setPhoneNumber(userId, newPhoneNumber)
    .then(async (res) => {
      console.log("res.data.message", res.data.message);
      toastr(res.data.message);
      await dispatch(changeUser(res.data.user));
      console.log(res.data.message);
    })
    .catch((error) => {
      if (error.response) {
        // Handle error with HTTP status code
        // console.error(error.response.data.message);
        toastr(error.response.data.message);
      }
      else if (error.request) {
        // Handle error connecting to server
        toastr('Error connecting to server.');
      }
      else {
        // Handle other errors
        //console.error('Error:', error.message);
        // toastr('Error:', error.message);
      }
    })
    .finally(() => {
    });
};

export const signupInitial = () => ({
  type: AUTH_SIGNUP_INITIAL,
});


export const signingUp = (signingUp) => ({
  type: AUTH_SIGNING_UP,
  payload: signingUp
});

export const signedUp = (data) => ({
  type: AUTH_SIGNED_UP,
  payload: data,
});

export const errorSignUp = (errorMessage) => ({
  type: AUTH_ERR_SIGNUP,
  payload: errorMessage,
});

export const changeUser = (newUser) => ({
  type: AUTH_NEW_USER,
  payload: newUser,
});


export const resendingEmail = (data) => ({
  type: AUTH_RESENDING_EMAIL,
  payload: data
});

export const resentEmail = (data) => ({
  type: AUTH_RESENT_EMAIL,
  payload: data,
});

export const errorResendEmail = (errorMessage) => ({
  type: AUTH_ERR_RESEND_EMAIL,
  payload: errorMessage,
});

export const resendEmail = (data, navigate) => (dispatch) => {
  dispatch(resendingEmail(true));
  userService.resendEmail(data)
    .then(async (res) => {
      await dispatch(resentEmail(res.data));
      toastr("Resent Email Successful. Please Check Email For Verification.")
      console.log(">>>action resendEmail:", res.data)
    })
    .catch((error) => {
      dispatch(errorResendEmail('Failed!'));
    })
    .finally(() => {
      dispatch(resendingEmail(false));
    });
};
