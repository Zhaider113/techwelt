import {
  NOTIFY_LIST,
  NOTIFY_LIST_FAILED,
  NOTIFY_LIST_SUCCESS,
  NOTIFY_ADDING,
  NOTIFY_ADDING_FAILED,
  NOTIFY_ADDING_SUCCESS,
} from '../constants/notifications';

const NOTIFICATIONS_INITIAL_STATE = {
  notifications: [],
  isAddingNotify: false,
  isGettingNotifies: false,
  errorNotifyAdd: '',
  errorNotifyList: '',
};

export default function (state = NOTIFICATIONS_INITIAL_STATE, action) {
  switch (action.type) {

    case NOTIFY_ADDING: {
      return {
        ...state,
        errorNotifyAdd: action.payload ? null : state.errorNotifyAdd,
        isAddingNotify: action.payload,
      };
    }

    case NOTIFY_ADDING_SUCCESS: {
      return {
        ...state,
        errorNotifyAdd: null,
        isAddingNotify: false,
      };
    }

    case NOTIFY_ADDING_FAILED: {
      return {
        ...state,
        errorNotifyAdd: action.payload,
      };
    }

    case NOTIFY_LIST: {
      return {
        ...state,
        isGettingNotifies: action.payload,
      };
    }

    case NOTIFY_LIST_SUCCESS: {
      let { notifications } = action.payload;
      return {
        ...state,
        notifications: notifications,
        errorNotifyList: '',
      };
    }

    case NOTIFY_LIST_FAILED: {
      return {
        ...state,
        errorNotifyList: action.payload,
      };
    }

    default:
      return state;
  }
}
