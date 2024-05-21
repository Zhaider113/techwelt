import axios from 'axios';
import {
  USER_LIST,
  USER_LIST_SUCCESS,
  USER_LIST_FAILED,

  GET_USERNAMELIST,
  GETTING_USERNAMELIST,
  
  USER_ADDING, USER_ADDING_SUCCESS, USER_ADDING_FAILED,
  USER_REMOVING, USER_REMOVE_SUCCESS, USER_REMOVE_FAILED,
  USER_ACTIVATING, USER_ACTIVATE_SUCCESS, USER_ACTIVATE_FAILED,
  USER_UPDATING, USER_UPDATE_SUCCESS, USER_UPDATE_FAILED,
  USER_CHANGING_EMAIL, USER_CHANGED_EMAIL, USER_ERR_CHANGING_EMAIL,
  USER_UPDATING_AVATAR, USER_UPDATED_AVATAR, USER_ERR_UPDATING_AVATAR,
  USER_UPDATE_INITIAL_MOBILE, USER_UPDATING_MOBILENO, USER_UPDATED_MOBILENO, USER_ERR_UPDATING_MOBILENO,
  USER_UPDATE_INITIAL_PWD, USER_UPDATING_PWD, USER_UPDATED_PWD, USER_ERR_UPDATING_PWD,

} from '../constants/user';

import { userService } from "../services/userService";
import { API_URL } from '../constants/url';
import { toastr } from "../services/navRef";

export const gettingUserList = (isGetting) => ({
  type: GETTING_USERNAMELIST,
  payload: isGetting
});

export const successGetUsernameList = (data) => ({
  type: GET_USERNAMELIST,
  payload: data,
});

export const usernameList = (token) => (dispatch) => {
  
  dispatch(gettingUserList(true));
  userService.getUsernameList(token).then(async (res) => {
    await dispatch(successGetUsernameList(res.data));
  }).catch((err) => {
    console.log("@UserList Err : ",err);
  }).finally(() => {
    dispatch(gettingUserList(false));
  });
};

export const addingUser = (isAdding) => ({
  type: USER_ADDING,
  payload: isAdding
});

export const successAddUser = (data) => ({
  type: USER_ADDING_SUCCESS,
  payload: data,
});

export const errorAddUser = (errorMessage) => ({
  type: USER_ADDING_FAILED,
  payload: errorMessage,
});

export const action_user_list = (isUserList) => ({
  type: USER_LIST,
  payload: isUserList
});

export const successUserList = (data) => ({
  type: USER_LIST_SUCCESS,
  payload: data,
});

export const errorUserList = (errorMessage) => ({
  type: USER_LIST_FAILED,
  payload: errorMessage,
});

export const userList = (token, userId) => (dispatch) => {
  dispatch(action_user_list(true));
  userService.userList(token, userId).then(async (res) => {
    await dispatch(successUserList(res.data));
  }).catch((err) => {
    dispatch(errorUserList("Something went worng!"));
  }).finally(() => {
    dispatch(action_user_list(false));
  });
};

export const addUser = (data, navigation) => (dispatch) => {
  dispatch(addingUser(true));

  userService.addUser(data)
    .then(async (res) => {
    await dispatch(userList(data.token, data.userId));
    await dispatch(successAddUser(res.data));
    // await navigation.navigate('MapScreen');
    await navigation.goBack();
    toastr('User is added.');
  })
    .catch((err) => {
      console.log("@@@User Err:", err);
      dispatch(errorAddUser(err.response.data.message));
      toastr(err.response.data.message);
    })
    .finally(() => {
      console.log("@@@User Final:", err);
      dispatch(addingUser(false));
    });
};

export const removingUser = (isRemoving) => ({
  type: USER_REMOVING,
  payload: isRemoving
});

export const successRemoveUser = (data) => ({
  type: USER_REMOVE_SUCCESS,
  payload: data,
});

export const errorRemoveUser = (errorMessage) => ({
  type: USER_REMOVE_FAILED,
  payload: errorMessage,
});

export const deleteUser = (token, userId, email, navigation) => (dispatch) => {
  console.log("@@Delete email: ", email)
  dispatch(removingUser(true));
  userService.deleteUser(token, email).then(async (res) => {
    console.log("@@Delete User Result: ", res.data);
    //await dispatch(vehicleList(token, userId));
    await dispatch(userList(token, userId));
    await dispatch(successRemoveUser(res.data));
    //await navigation.navigate('MapScreen');
    toastr('User is deleted.');
    // toastr(res.data.message);
  }).catch((err) => {
    console.log("@@Delete User Err: ", err);

    dispatch(errorRemoveUser('Wrong User info!'));
    toastr(err.message);
  }).finally(() => {
    dispatch(removingUser(false));
  });
};


export const activatingUser = (isActivating) => ({
  type: USER_ACTIVATING,
  payload: isActivating
});

export const successActivateUser = (data) => ({
  type: USER_ACTIVATE_SUCCESS,
  payload: data,
});

export const errorActivateUser = (errorMessage) => ({
  type: USER_ACTIVATE_FAILED,
  payload: errorMessage,
});

export const activateUser = (data, navigation) => (dispatch) => {
  console.log("@@Activate Data: ", data)
  dispatch(activatingUser(true));
  userService.activateUser(data).then(async (res) => {
    console.log("@@Activate User Result: ", res.data);
    await dispatch(userList(data.token, data.userId));
    await dispatch(successActivateUser(res.data));
  }).catch((err) => {
    console.log("@@Activate User Err: ", err);
    dispatch(errorActivateUser('Wrong User info!'));
    toastr(err.message);
  }).finally(() => {
    dispatch(activatingUser(false));
  });
};

export const updatingUser = (isUpdatingUser) => ({
  type: USER_UPDATING,
  payload: isUpdatingUser
});

export const successUpdateUser = (data) => ({
  type: USER_UPDATE_SUCCESS,
  payload: data,
});

export const errorUpdateUser = (errorMessage) => ({
  type: USER_UPDATE_FAILED,
  payload: errorMessage,
});


export const updateUser = (data, navigation) => (dispatch) => {
  console.log("@@Update Data: ", data)
  dispatch(updatingUser(true));
  userService.updateUser(data).then(async (res) => {
    console.log("@@Update User Result: ", res.data);
    await dispatch(userList(data.token, data.userId));
    await dispatch(successUpdateUser(res.data));
    // await navigation.goBack();
  }).catch((err) => {
    console.log("@@Update User Err: ", err);
    dispatch(errorUpdateUser('Wrong User info!'));
    toastr(err.message);
  }).finally(() => {
    dispatch(updatingUser(false));
  });
};

export const changingEmail = (data) => ({
  type: USER_CHANGING_EMAIL,
  payload: data
});

export const changedEmail = (data) => ({
  type: USER_CHANGED_EMAIL,
  payload: data,
});

export const errorChangingEmail = (errorMessage) => ({
  type: USER_ERR_CHANGING_EMAIL,
  payload: errorMessage,
});

export const changeEmail = (data, navigation) => (dispatch) => {
  dispatch(changingEmail(true));
  userService.changeEmail(data).then(async (res) => {
    console.log("@Change Email Result : ", res.data)
    await dispatch(changedEmail(res.data));
    toastr("Please Check Email")
  }).catch(error => {
    toastr(error);
    console.log("@Change Email Err : ", error)
    dispatch(errorChangingEmail('Reset Failed'));
  }).finally(() => {
    dispatch(changingEmail(false));
  }
  )
};

export const updatingAvatar = (data) => ({
  type: USER_UPDATING_AVATAR,
  payload: data
});

export const updatedAvatar = (data) => ({
  type: USER_UPDATED_AVATAR,
  payload: data,
});

export const errorUpdatingAvatar = (errorMessage) => ({
  type: USER_ERR_UPDATING_AVATAR,
  payload: errorMessage,
});

export const updateAvatar = (data, navigation) => (dispatch) => {
  dispatch(updatingAvatar(true));
  userService.updateAvatar(data).then(async (res) => {
    console.log("@Update Avatar Result : ", res.data)
    await dispatch(updatedAvatar(res.data));
  }).catch(error => {
    toastr(error);
    console.log("@Update Avtar Err : ", error)
    dispatch(errorUpdatingAvatar('Updating Avatar Err'));
  }).finally(() => {
    dispatch(updatingAvatar(false));
  }
  )
};


export const updateInitialMobileNo = () => ({
  type: USER_UPDATE_INITIAL_MOBILE
});

export const updatingMobileNo = (data) => ({
  type: USER_UPDATING_MOBILENO,
  payload: data
});

export const updatedMobileNo = (data) => ({
  type: USER_UPDATED_MOBILENO,
  payload: data,
});

export const errorUpdatingMobileNo = (errorMessage) => ({
  type: USER_ERR_UPDATING_MOBILENO,
  payload: errorMessage,
});

export const updateMobileNo = (data, navigation) => (dispatch) => {
  dispatch(updatingMobileNo(true));
  userService.updateMobileNo(data).then(async (res) => {
    await dispatch(updatedMobileNo(res.data));
    toastr(res.data.message);
    console.log("!!!",res.data.result);
  }).catch(error => {
    toastr(error);
    dispatch(errorUpdatingMobileNo('Updating MobileNo Err'));
  }).finally(() => {
    dispatch(updatingMobileNo(false));
  }
  )
};

export const updateInitialPwd = () => ({
  type: USER_UPDATE_INITIAL_PWD
});

export const updatingPwd = (data) => ({
  type: USER_UPDATING_PWD,
  payload: data
});

export const updatedPwd = (data) => ({
  type: USER_UPDATED_PWD,
  payload: data,
});

export const errorUpdatingPwd = (errorMessage) => ({
  type: USER_ERR_UPDATING_PWD,
  payload: errorMessage,
});

export const updatePwd = (data, navigation) => (dispatch) => {
  dispatch(updatingPwd(true));
  userService.updatePwd(data).then(async (res) => {
    await dispatch(updatedPwd(res.data));
    toastr(res.data.message);
  }).catch(error => {
    toastr(error);
    dispatch(errorUpdatingPwd('Updating Password Err'));
  }).finally(() => {
    dispatch(updatingPwd(false));
  }
  )
};
