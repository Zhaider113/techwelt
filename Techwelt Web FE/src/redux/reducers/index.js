import { combineReducers } from "redux";
import deviceReducer from "./deviceReducer";
import atertReducer from "./alertReducer";
import authReducer from "./authReducer";
import globalReducer from "./globalReducer";
import ruleReducer from "./ruleReducer";
import companyReducer from "./companyReducer";
import ticketReducer from "./ticketReducer";
import zoneReducer from "./zoneReducer";

export default combineReducers({
    devicesList: deviceReducer,
    alertsList: atertReducer,
    auth: authReducer,
    global: globalReducer,
    rulesList: ruleReducer,
    companyList: companyReducer,
    ticketList: ticketReducer,
    zoneList: zoneReducer,
});
