import axios from 'axios';
import { AUTH_URL, API_URL } from '../constants/url';
import { resetAuthAsyncStorage, resetLoginInfoStorage, setAuthAsyncStorage, setLoginInfoStorage } from "./getLocalAsyncStorage";

function login(saveFlag, username, password, type) {
  return new Promise((resolve, reject) => {
    axios.post(`${AUTH_URL}/login`, {
      userId: username,
      password: password,
      type: type,
    }).then(async (response) => {
      try {
        // console.log("@@@",saveFlag);
        // await setAuthAsyncStorage({
        //   username:username, password:password, saveFlag: saveFlag
        // });
        if(saveFlag){
          await setLoginInfoStorage({
            username:username, password:password, saveFlag: saveFlag
          });
        } else {
            await resetLoginInfoStorage();
        }
        resolve(response);
      }
      catch (e) {
        reject(e)
      }
    }).catch((error) => {
      reject(error)
    });
  });
}

function signup(data) {
  return new Promise((resolve, reject) => {
    axios.post(`${AUTH_URL}/signup`, data).
    then(async (response) => {
      try {
        // await setAuthAsyncStorage({username:lname, password:password});
        // await setAuthAsyncStorage(response);
        resolve(response);
      } catch (e) { reject(e) }
    }).catch((err) => {
      reject(err)
    });
  });
}

function changePassword(userId, oldPassword, newPassword) {
  //console.log("@@@@@@",userId)
  return new Promise((resolve, reject) => {
    axios.post(`${AUTH_URL}/changepassword`, {
      userId: userId,
      newPassword: newPassword,
    })
      .then(async (response) => {
        try {
          resolve(response);
        }
        catch (e) { reject(e) }
      })
      .catch((err) => {
        reject(err)
      });
  });
}

function changeEmail(data) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/changeEmail`, data)
      .then(async (response) => {
        try {
          resolve(response);
        }
        catch (e) { reject(e) }
      })
      .catch((err) => {
        reject(err)
      });
  });
}

function changeUserName(userId, newUserName) {
  return new Promise((resolve, reject) => {
    axios.post(`${AUTH_URL}/changeusername`, {
      id: userId,
      newUserName: newUserName,
    })
      .then(async (response) => {
        try {
          resolve(response);
        }
        catch (e) { reject(e) }
      })
      .catch((err) => {
        reject(err)
      });
  });
}

function setPhoneNumber(userId, newPhoneNumber) {
  return new Promise((resolve, reject) => {
    axios.post(`${AUTH_URL}/changephonenumber`, {
      id: userId,
      newPhoneNumber: newPhoneNumber,
    })
      .then(async (response) => {
        try {
          resolve(response);
        }
        catch (e) { reject(e) }
      })
      .catch((err) => {
        reject(err)
      });
  });
}

async function logout(getState) {
  await resetAuthAsyncStorage();
  await resetLoginInfoStorage();
}

function getUsernameList(token) {
  return new Promise((resolve, reject) => {
    axios.post(`${AUTH_URL}/userIdList`, {
      token
    })
      .then(async (response) => {
        try {
          resolve(response);
        }
        catch (e) { reject(e) }
      })
      .catch((err) => {
        reject(err)
      });
  });
}

function addUser(data) {
  console.log(data)
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/addUser`, data)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          console.log("addUser::::", e)
          reject(e)
        }
      }).catch((err) => {
        console.log("addUser::::", err)
        reject(err)
      });
  });
}

function userList(token, userId) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/list`, {
      token, userId
    })
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) { 
          console.log("userList::::", e)
          reject(e) }
      })
      .catch((err) => {
        console.log("userList::::", err)
        reject(err)
      });
  });
}

function deleteUser(token, email) {
  console.log(" token and email are ", token, email);
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/removeUser`, {
      token: token,
      email: email
    }).then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("deleteUser:::: then", e)
        reject(e) }
    }).catch((err) => {
      console.log("deleteUser:::: catch", err)
      reject(err)
    });
  });
}

function activateUser(data) {
  console.log(" token and email are ", data);
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/activateUser`, data).
    then(async (response) => {
      try {
        resolve(response);
      } catch (e) { 
        console.log("activateUser:::: then", e)
        reject(e) }
    }).catch((err) => {
      console.log("activateUser:::: catch", err)
      reject(err)
    });
  });
}

function updateUser(data) {
  return new Promise((resolve, reject) => {

    axios.post(`${API_URL}/users/updateUser`, data)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          console.log("updateUser::::", e)
          reject(e)
        }
      }).catch((err) => {
        console.log("updateUser::::", err)
        reject(err)
      });
  });
}


function updateAvatar(data) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/updateAvatar`, data)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          console.log("updateAvatar::::", e)
          reject(e)
        }
      }).catch((err) => {
        console.log("updateAvatar::::", err)
        reject(err)
      });
  });
}


function updateMobileNo(data) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/updateMobileNo`, data)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          reject(e)
        }
      }).catch((err) => {
        reject(err)
      });
  });
}

function updatePwd(data) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/updatePwd`, data)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          reject(e)
        }
      }).catch((err) => {
        reject(err)
      });
  });
}

function resendEmail(data) {
  return new Promise((resolve, reject) => {
    axios.post(`${AUTH_URL}/resendEmail`, data)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          reject(e)
        }
      }).catch((err) => {
        reject(err)
      });
  });
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/users/getUser`)
      .then(async (response) => {
        try {
          resolve(response);
        } catch (e) {
          reject(e)
        }
      }).catch((err) => {
        reject(err)
      });
  });
}


export const userService = {
  login,
  logout,
  signup,
  changePassword,
  changeEmail,
  changeUserName,
  setPhoneNumber,
  getUsernameList,
  userList,
  addUser,
  deleteUser,
  activateUser,
  updateUser,
  updateAvatar,
  updateMobileNo,
  resendEmail,
  getUserInfo,
  updatePwd
};
