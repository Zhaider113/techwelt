import { GET_RULES, RULES_ERROR, GET_USERTOKEN, GET_TOKENERROR, GET_USERS, GET_USERNAMELIST } from "../store/types";

const initialState = {
    users: [],
    rules: [],
    token: "",
    loading: true,
    userList: []
};

export default function (state = initialState, action) {
    console.log(action,'action')
    switch (action.type) {
        case GET_RULES:
            return {
                ...state,
                rules: action.payload,
                loading: false,
            };
        case RULES_ERROR:
            return {
                loading: false,
                error: action.payload,
            };
        case GET_USERTOKEN:
            return {
                ...state,
                token: action.payload,
                loading: false,
            };
        case GET_TOKENERROR:
            return {
                ...state,
                token: action.payload,
                loading: false,
            };
        case GET_USERS:
            return {
                ...state,
                users: action.payload,
                loading: false,
            };
        case GET_USERNAMELIST:
            return {
                ...state,
                userList: action.payload,
                loading: false,
            };

        default:
            return state;
    }
}
