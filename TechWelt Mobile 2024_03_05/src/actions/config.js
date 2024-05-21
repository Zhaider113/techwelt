import axios from 'axios';
import {
    GET_MANAGE_EMAIL
} from '../constants/config';

import { toastr } from "../services/navRef";
import { configService } from "../services/configService";

export const successGetManageEmail = (data) => ({
    type: GET_MANAGE_EMAIL,
    payload: data,
  });

export const getManageEmail = (token) => (dispatch) => {
  
    configService.getManageEmail(token)
      .then(
        async (res) => {
          console.log("api getManageEmail::::::::::::", res.data.message)
          await dispatch(successGetManageEmail(res.data.message));
        })
      .catch((error) => {
        console.log("An error occured while get manage email", error);
      })
      .finally(() => {
        //console.log("error get manage email");
      })
};