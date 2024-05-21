import {
  TELTONIKA_INFO,
  TELTONIKA_INFO_SUCCESS,
  TELTONIKA_INFO_FAILED,
} from '../constants/teltonika';

import {toastr} from "../services/navRef";
import {teltonikaService} from "../services/teltonikaService";

export const infoTeltonika = (loading) => ({
  type: TELTONIKA_INFO,
  payload: loading
});

export const successInfoTeltonika = (data) => ({
  type: TELTONIKA_INFO_SUCCESS,
  payload: data,
});

export const errorTeltonikaInfo = (errorMessage) => ({
  type: TELTONIKA_INFO_FAILED,
  payload: errorMessage,
});

export const teltonika = (token, userId, deviceImei) => (dispatch) => {
  dispatch(infoTeltonika(true));
  teltonikaService.teltonika(token, userId, deviceImei).then(async (res) => {
    console.log("getTeltonika data::::", res.data)
    await dispatch(successInfoTeltonika(res.data));
    //await navigate.navigate('MapScreen2');
  }).catch((err) => {
    console.log(err)
    dispatch(errorTeltonikaInfo('Something Went Wrong!'));
    //toastr('Something Went Wrong!');
  }).finally(() => {
    dispatch(infoTeltonika(false));
  });
};