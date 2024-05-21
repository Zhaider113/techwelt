import {
  MEMBERSHIP_CHARGE,
  MEMBERSHIP_CHARGE_SUCCESS,
  MEMBERSHIP_CHARGE_FAILED
} from '../constants/membership';

import {toastr} from "../services/navRef";
import {membershipService} from "../services/membershipService";

export const actionChargingMembership = (isCharging) => ({
  type: MEMBERSHIP_CHARGE,
  payload: isCharging
});

export const actionSuccessChargeMembership = (data) => ({
  type: MEMBERSHIP_CHARGE_SUCCESS,
  payload: data,
});

export const actionErrorChargingMembership = (errorChargeMessage) => ({
  type: MEMBERSHIP_CHARGE_FAILED,
  payload: errorChargeMessage,
});

export const recharger = (token, email, username, cardName,
  cardNumber, cardCVV, deviceExpirateDate, amount, deviceImei, expiryMonth, expiryYear) => (dispatch) => {
  dispatch(actionChargingMembership(true));
  membershipService.recharge(token, email, username, cardName,
    cardNumber, cardCVV, deviceExpirateDate, amount, deviceImei, expiryMonth, expiryYear).then(async (res) => {
    console.log("recharge response::::", res.data);
    await dispatch(actionSuccessChargeMembership(res.data));
    toastr(res.data.message);
  }).catch((err) => {
    dispatch(actionErrorChargingMembership('Something went wrong!'));
    toastr(err.response.data.message);
  }).finally(() => {
    dispatch(actionChargingMembership(false));
  });
};