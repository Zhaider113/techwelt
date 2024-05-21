
import {combineReducers} from 'redux';
import authReducer from './auth';
import vehiclesReducer from './vehicles';
import realtimeReducer from './realtimevehicles';
import teltonikaReducer from './teltonika';
import membershipReducer from './membership';
import notificationReducer from './notifications';
import userReducer from './user';
import configReducer from './config';

const rootReducer = combineReducers({
  auth: authReducer,
  vehicles:  vehiclesReducer,
  teltonika: teltonikaReducer,
  realtimeVehicles:realtimeReducer,
  membership: membershipReducer,
  notifications: notificationReducer,
  config: configReducer,
  user: userReducer,
});

export default rootReducer;