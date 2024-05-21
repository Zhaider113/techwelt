import {
  USER_LIST,
  USER_LIST_SUCCESS,
  GET_USERNAMELIST,
  USER_ADDING,
  USER_ADDING_SUCCESS,
  USER_ADDING_FAILED,
  USER_ACTIVATE_FAILED,
  USER_ACTIVATE_SUCCESS,
  USER_ACTIVATING,
  USER_REMOVE_FAILED, USER_REMOVING, USER_REMOVE_SUCCESS,

  USER_UPDATE_INITIAL_MOBILE, USER_UPDATED_MOBILENO,
  USER_UPDATE_INITIAL_PWD, USER_UPDATED_PWD,
} from '../constants/user';

const USER_INITIAL_STATE = {
  isPhoneUpdate: false,
  isPwdUpdate:false,
  userList: [],
  usernameList: [],
  isAddingUser: false,
  isUserList: false,
  isRemovingUser: false,
  isActivatingUser: false,

  errorUserAdd: '',
  errorUserList: '',
  errorUserRemove: '',
  errorUserActivate: '',
};

export default function (state = USER_INITIAL_STATE, action) {
  switch (action.type) {

    case GET_USERNAMELIST: {
      let users = action.payload;
      return {
        ...state,
        usernameList: users,
      };
    }

    case USER_ADDING: {
      return {
        ...state,
        errorUserAdd: action.payload ? null : state.errorUserAdd,
        isAddingUser: action.payload,
      };
    }

    case USER_ADDING_SUCCESS: {
      return {
        ...state,
        errorUserAdd: null,
        isAddingUser: false,
      };
    }

    case USER_ADDING_FAILED: {
      return {
        ...state,
        errorUserAdd: action.payload,
      };
    }

    case USER_LIST: {
      return {
        ...state,
        isUserList: action.payload,
      };
    }

    case USER_LIST_SUCCESS: {
      let users = action.payload;
      // console.log("@@Reducer,", users);
      return {
        ...state,
        userList: users,
        errorUserList: '',
      };
    }

    case USER_REMOVING: {
      return {
        ...state,
        errorUserRemove: action.payload ? null : state.errorVehicleRemove,
        isRemovingUser: action.payload,
      };
    }

    case USER_REMOVE_SUCCESS: {
      return {
        ...state,
        errorUserRemove: null,
        isRemovingUser: false,
      };
    }

    case USER_REMOVE_FAILED: {
      return {
        ...state,
        errorUserRemove: action.payload,
      };
    }

    case USER_ACTIVATING: {
      return {
        ...state,
        errorUserActivate: action.payload ? null : state.errorUserActivate,
        isActivatingUser: action.payload,
      };
    }

    case USER_ACTIVATE_SUCCESS: {
      return {
        ...state,
        errorUserRemove: null,
        isActivatingUser: false,
      };
    }

    case USER_ACTIVATE_FAILED: {
      return {
        ...state,
        errorUserActivate: action.payload,
      };
    }

    case USER_UPDATED_MOBILENO: {
      return {
        ...state,
        isPhoneUpdate: true
      };
    }

    case USER_UPDATE_INITIAL_MOBILE: {
      return {
        ...state,
        isPhoneUpdate: false
      };
    }

    case USER_UPDATED_PWD: {
      return {
        ...state,
        isPwdUpdate: true
      };
    }

    case USER_UPDATE_INITIAL_PWD: {
      return {
        ...state,
        isPwdUpdate: false
      };
    }
    
    default:
      return state;
  }
}
