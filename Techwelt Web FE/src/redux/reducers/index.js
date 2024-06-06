import { combineReducers } from "redux";
import deviceReducer from "./deviceReducer";
import atertReducer from "./alertReducer";
import authReducer from "./authReducer";
import globalReducer from "./globalReducer";
import ruleReducer from "./ruleReducer";

export default combineReducers({
    devicesList: deviceReducer,
    alertsList: atertReducer,
    auth: authReducer,
    global: globalReducer,
    rulesList: ruleReducer,
});
