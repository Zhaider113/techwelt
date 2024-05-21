//export const global.GOOGLE_MAPS_API_KEY = 'AIzaSyB_X2kKYs1hiQB2N4lCrhqQzLx9Te_0GG8';
//export const global.GOOGLE_MAPS_API_KEY = 'AIzaSyAarczD2iyCzzjJxGRX1pDMuyMDYinimto';

export const ID_IOBATTERY = 113;
export const ID_IOMOVEMENT = 240;
export const ID_IOIGNITION = 179;

export const ONLINE_LIMIT = 7;

export function validDeviceImei(val) {
    const imeiRegex = /^\d{15}$/; // Regex pattern for 15-digit IMEI

    return imeiRegex.test(val);
}

export function validPhoneNumber(val) {
    const phoneRegex = /^\d{10}$/; // Regex pattern for phone number

    return phoneRegex.test(val);
}

export function validDigitNumber(val) {
    const digitRegex = /^\d+$/;; // Regex pattern for digit number

    return digitRegex.test(val);
}


export function validEmail(val) {
    //const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$;
    //return emailRegex.test(val);

    const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
    return emailRegex.test(val);
}

// get data value of IOvalue
export const getIOValue = (ioData,dataID) => {
  //console.log("@@@@@@ioData",ioData)
  if(!ioData) return 0;
  let itemData = ioData.find(
    (item) => item.dataId == dataID
  );

  let dataVal = 0;

  if(itemData)
    dataVal = itemData.dataValue
    //dataVal = itemData.dataName
  //console.log("@@@@@@@@@@getIOValue",dataVal,dataID)

  return dataVal;
}