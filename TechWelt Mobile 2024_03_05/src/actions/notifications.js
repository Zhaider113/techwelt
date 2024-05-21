import {
  NOTIFY_LIST,
  NOTIFY_LIST_FAILED,
  NOTIFY_LIST_SUCCESS,
  NOTIFY_ADDING,
  NOTIFY_ADDING_FAILED,
  NOTIFY_ADDING_SUCCESS,
} from '../constants/notifications';

import { toastr } from "../services/navRef";
import { notificationService } from "../services/notificationService";

export const action_notify_list = (isGettingNotifies) => ({
  type: NOTIFY_LIST,
  payload: isGettingNotifies
});

export const action_notify_list_success = (data) => ({
  type: NOTIFY_LIST_SUCCESS,
  payload: data,
});

export const action_notify_list_error = (errorMessage) => ({
  type: NOTIFY_LIST_FAILED,
  payload: errorMessage,
});

export const showNotifications = (token, userId) => (dispatch) => {
  dispatch(action_notify_list(true));

  notificationService.showNotifications(token, userId).then(async (res) => {
    await dispatch(action_notify_list_success(res.data));
  })
    .catch((err) => {
      dispatch(action_notify_list_error('Somethingn went wrong.'));
    })
    .finally(() => {
      dispatch(action_notify_list(false));
    });
};

export const getNotifications = (token, userId, startDate, endTime) => (dispatch) => {
  dispatch(action_notify_list(true));

  notificationService.getNotifications(token, userId ,startDate, endTime).then(async (res) => {
    await dispatch(action_notify_list_success(res.data));
  })
    .catch((err) => {
      dispatch(action_notify_list_error('Somethingn went wrong.'));
    })
    .finally(() => {
      dispatch(action_notify_list(false));
    });
};

export const action_add_notify = (isAddingNotify) => ({
  type: NOTIFY_ADDING,
  payload: isAddingNotify
});

export const action_add_notify_success = (data) => ({
  type: NOTIFY_ADDING_SUCCESS,
  payload: data,
});

export const action_add_notify_failed = (errorMessage) => ({
  type: NOTIFY_ADDING_FAILED,
  payload: errorMessage,
});

export const addNotification = (token, userId, type, vehicle, time) => (dispatch) => {


  dispatch(action_add_notify(true));
  notificationService.addNotification(token, userId, type, vehicle, time).then(async (res) => {
    await dispatch(action_add_notify_success(res.data));
  }).catch((err) => {
    dispatch(action_add_notify_failed(err.response.data.message));
    toastr(err.response.data.message);
  }).finally(() => {
    dispatch(action_add_notify(false));
  });
};

// export const removingVehicles = (isRemovingVehicle) => ({
//   type: VEHICLE_REMOVING,
//   payload: isRemovingVehicle
// });

// export const successRemoveVehicles = (data) => ({
//   type: VEHICLE_REMOVE_SUCCESS,
//   payload: data,
// });

// export const errorRemoveVehicles = (errorMessage) => ({
//   type: VEHICLE_REMOVE_FAILED,
//   payload: errorMessage,
// });

// export const deleteVehicle = (token, imei, navigation) => (dispatch) => {
//   dispatch(removingVehicles(true));
//   vehicleService.deleteVehicle(token, imei).then(async (res) => {
//     await dispatch(successRemoveVehicles(res.data));
//     await navigation.navigate('List');
//     toastr(res.message);
//   }).catch((err) => {
//     dispatch(errorRemoveVehicles('Wrong Vehicle info!'));
//     toastr('Vehicle remove failed');
//   }).finally(() => {
//     dispatch(removingVehicles(false));
//   });
// };