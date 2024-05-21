import AsyncStorage from '@react-native-async-storage/async-storage';
export async function getAuthAsyncStorage() {
  const user = await AsyncStorage.getItem('userData');
  return JSON.parse(user);
}

export async function setAuthAsyncStorage(data) {
  try{
    await AsyncStorage.setItem('userData', JSON.stringify(data));
  }catch(error){
    console.log('set userdata func Error',error);
  }
}

export async function resetAuthAsyncStorage() {
  await AsyncStorage.removeItem('userData');
}

export async function setItemString(key, value) {
  console.log("@@@@@localstorageset item string",key,value)
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('setitemstring func Error',key,value,error);
  }
}

export async function getItemString(key) {
  var item = await AsyncStorage.getItem(key);
  return item;
}

export async function setItemObject(key, item) {
  //console.log('setItemObject key',key);
  //console.log('setItemObject item',item);
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.log('setItemObject func Error',key,value,error);
  }
}

export async function getItemObject(key) {
  //console.log('getItemObject key',key);
  var item = await AsyncStorage.getItem(key);
  return JSON.parse(item);
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('removeItem func Error ',key, error.value);
  }
}

export async function getLoginInfoStorage() {
  const user = await AsyncStorage.getItem('loginInfo');
  return JSON.parse(user);
}

export async function setLoginInfoStorage(data) {
  try{
    await AsyncStorage.setItem('loginInfo', JSON.stringify(data));
  }catch(error){
    console.log('set loginInfo func Error',error);
  }
}

export async function resetLoginInfoStorage() {
  await AsyncStorage.removeItem('loginInfo');
}

export async function getVehicleSettingInfoStorage() {
  const user = await AsyncStorage.getItem('vehicle_setting');
  return JSON.parse(user);
}

export async function setVehicleSettingInfoStorage(data) {
  try{
    await AsyncStorage.setItem('vehicle_setting', JSON.stringify(data));
  }catch(error){
    console.log('set loginInfo func Error',error);
  }
}

export async function resetVehicleSettingInfoStorage() {
  await AsyncStorage.removeItem('vehicle_setting');
}
