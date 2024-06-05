import axios from "axios";

if (process.env.REACT_APP_DEV_MODE === "TRUE")
    axios.defaults.baseURL = process.env.REACT_APP_URL;
else
    axios.defaults.baseURL = process.env.REACT_APP_DEV_URL;
console.log(process.env.REACT_APP_DEV_MODE, "process.env.REACT_APP_DEV_MODE", process.env.REACT_APP_DEV_URL)
const getUserNameList = async (props) => {
    try {
        var result = await axios.post("/auth/userIdList/", props, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return result.data;
    } catch (error) {
        return error.response
    }
}


const signInUser = async (props) => {
    try {
        var result = await axios.post("/auth/login/", props, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return result;
    } catch (error) {
        return error.response
    }
};

const userRegister = async (props) => {
    try {
        var result = await axios.post("/auth/signUp/", props, {
            headers: { "Content-Type": "application/json" },
        });
        return result;
    } catch (error) {
        return error.response;
    }
};

const resetUser = async (props) => {
    try {
        var result = await axios.post("/auth/reset/", props, {
            headers: { "Content-Type": "application/json" },
        });
        return result;
    } catch (error) {
        return error.response;
    }
};

const forgotPass = async (props) => {
    try {
        var result = await axios.post("/auth/reset/", props, {
            headers: { "Content-Type": "application/json" },
        });
        return result;
    } catch (error) {
        return error.response
    }
};

const getHistoryList = async (props) => {
    try {
        var result = await axios.post("/api/vehicles/history", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result.data;
    } catch (error) {
        return error.response
    }
}

const getUser = async (props) => {
    try {
        var result = await axios.post("/api/users/getUser", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result.data;
    } catch (error) {
        return error.response
    }
}

const getGoogleAPIKey = async (props) => {
    try {
        var result = await axios.post("/api/users/getGoogleAPIKey", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result.data;
    } catch (error) {
        return error.response
    }
}

const removeDevice = async (props) => {
    try {
        var result = await axios.post("/api/vehicles/remove", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result.data;
    } catch (error) {
        return error.response
    }
}

const updateDevice = async (props) => {
    try {
        var result = await axios.post("/api/vehicles/update", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result.data;
    } catch (error) {
        return error.response
    }
}

const commandSetting = async (props) => {
    try {
        var result = await axios.post("/api/vehicles/sendCommand", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result;
    } catch (error) {
        return error.response
    }
}

const activateUser = async (props) => {
    try {
        var result = await axios.post("/api/users/activateUser", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result;
    } catch (error) {
        return error.response
    }
}

const showComandQueue = async (props) => {
    try {
        var result = await axios.post("api/vehicles/showCommand", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result;
    } catch (error) {
        return error.response
    }
}

const getResFromDev = async (props) => {
    try {
        var result = await axios.post("api/vehicles/getResFromDev", props, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return result;
    } catch (error) {
        return error.response
    }
}

const getResponse = async (url, type, props) => {
    try {
        let result;
        if (type === "post") {
            console.log(axios.defaults.baseURL,url)
            result = await axios.post(url, props, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
                },
            });
            console.log(result, "result");
            return result;
        } else {
            result = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
                },
            });
            return result;
        }
    } catch (error) {
        return error.response
    }
}
const postRules = async (props) => {
    try {
        var result = await axios.post("/api/rules/create", props, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
        });
        return result;
    } catch (error) {
        return error.response
    }
}

export { getGoogleAPIKey, userRegister, getResFromDev, showComandQueue, getUserNameList, activateUser, getHistoryList, commandSetting, updateDevice, signInUser, forgotPass, removeDevice, resetUser, getUser, getResponse, postRules };