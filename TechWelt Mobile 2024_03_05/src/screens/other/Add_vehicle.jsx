import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Modal,
  ActivityIndicator,
  ToastAndroid,
  Button,
} from "react-native";
import { TextInput } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PhoneInput from "react-native-phone-number-input";
import { Colors } from "react-native/Libraries/NewAppScreen";
import SelectDropdown from "react-native-select-dropdown";
import { IconComponentProvider, Icon, even } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { addVehicles } from "../../actions/vehicles";
import { useFocusEffect } from "@react-navigation/native";
import { toastr } from "../../services/navRef";
import { validDeviceImei, validPhoneNumber } from "../../utils/util";
import { useTranslation } from "react-i18next";
import { BarCodeScanner } from "expo-barcode-scanner";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Torch from "react-native-torch";

const types = ["Teltonika", "Concox"];
const teltonikaModels = ["TL1", "Eyecut"];
const concoxModels = ["ConcoxModel1", "ConcoxModel2", "ConcoxModel3"];

function Add_vehicle({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.auth);
  const vehicleReducer = useSelector((state) => state.vehicles);

  const [vehicleName, setVehicleName] = useState("");
  const [vehicleImei, setVehicleImei] = useState("");
  const [deviceType, setDeviceType] = useState("Teltonika");
  const [deviceModel, setDeviceModel] = useState("TL1");
  const [simNumber, setSimNumber] = useState("");
  const [key, setKey] = useState(0); // Key to force re-render

  const [deviceTypeIndex, setDeviceTypeIndex] = useState(0);

  const [showScanModal, setShowScanModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraType, setCameraType] = useState("back");

  const phoneInputRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      setVehicleName("");
      setVehicleImei("");
      setSimNumber("");
      setDeviceType("Teltonika");
      setDeviceModel("TL1");
    }, [])
  );

  useEffect(() => {
    setVehicleName("");
    setVehicleImei("");
    setSimNumber("");
    setDeviceType("Teltonika");
    setDeviceModel("TL1");

    console.log("@@@@@@use effect func", simNumber);

    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.getPermissionsAsync();
      console.log("@@@@@@@Add vehicle get permission func", status);
      if (status !== "granted") {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        console.log("@@@@getbarcodepermission", status);
        if (status !== "granted") {
          //setHasPermission(false);
          //alert("Allow Camera Permission");
          global.hsaCameraPermission = false;
        }
      }
    };

    if (!global.hsaCameraPermission) getBarCodeScannerPermissions();
    //alert("@@@@@@@get useeffect func",hasPermission)

    return () => {
      setVehicleName("");
      setVehicleImei("");
      setSimNumber("");
      setDeviceType("Teltonika");
      setDeviceModel("TL1");
    };
  }, []);

  function validate() {
    if (
      vehicleName === "" ||
      vehicleImei === "" ||
      deviceType === "" ||
      deviceModel === "" ||
      simNumber === ""
    ) {
      ToastAndroid.show(t("enter_vehicle_information"), ToastAndroid.SHORT);
    } else {
      if (!validDeviceImei(vehicleImei)) {
        toastr(t("please_enter_valid_IMEI"));
        return;
      }
      if (!validPhoneNumber(simNumber)) {
        toastr(t("please_enter_valid_phone"));
        return;
      }

      dispatch(
        addVehicles(
          userReducer.token,
          userReducer.user._id,
          vehicleName,
          vehicleImei,
          deviceType,
          deviceModel,
          simNumber,
          navigation
        )
      );

      setVehicleName("");
      setVehicleImei("");
      setSimNumber("");
      setDeviceType("Teltonika");
      setDeviceModel("TL1");

      console.log(
        "@@@@send submit",
        phoneInputRef.current._reactInternals.memoizedState
      );
      phoneInputRef.current._reactInternals.memoizedState.number = "";
    }
  }

  const handleToggleTorch = async () => {
    //console.log("@@@handleTogletorch",isTorchOn);

    if (Platform.OS === "ios") {
      Torch.switchState(!isTorchOn);
      setIsTorchOn(!isTorchOn);
    } else {
      const cameraAllowed = await Torch.requestCameraPermission(
        "Camera Permissions", // dialog title
        "We require camera permissions to use the torch on the back of your phone." // dialog body
      );

      console.log("@@@@request permission", cameraAllowed);
      if (cameraAllowed) {
        Torch.switchState(!isTorchOn);
        setIsTorchOn(!isTorchOn);
      }
    }
  };

  const handleToggleCameraType = () => {
    if (cameraType == "front") {
      setCameraType("back");
    } else {
      setCameraType("front");
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    //console.log("@@@@@@@@@@@handlescan",type)
    //console.log("@@@@@@@@@@@handlescan",data)
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    setShowScanModal(false);
    if (!validDeviceImei(data)) {
      toastr(t("please_enter_valid_IMEI"));
      return;
    }
    setVehicleImei(data);
  };

  if (hasPermission === null) {
    //console.log("Requesting for camera permission");
    toastr(t("requesting_for_camera_permission"));
    //return <Text>Requesting for camera permission</Text>;
  }
  //if (hasPermission === false) {
  if (global.hsaCameraPermission === false) {
    //console.log("No access to camera")
    toastr(t("no_access_camera"));
    //return <Text>No access to camera</Text>;
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      //enableAutomaticScroll={(Platform.OS === 'ios')}
      extraHeight={130}
      extraScrollHeight={130}
      //scrollsToTop = {false}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFF",
          height: hp("90%"),
          paddingTop: 16,
        }}
      >
        <Modal visible={vehicleReducer.isAddingVehicle} transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          >
            <ActivityIndicator size="large" color="rgba(54, 52, 53, 1)" />
          </View>
        </Modal>
        <Modal
          visible={showScanModal}
          onRequestClose={() => setShowScanModal(false)}
        >
          <View style={styles.container}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              //style={StyleSheet.absoluteFillObject}
              style={{ width: wp("80%"), height: hp("80%") }}
              type={cameraType}
            />
            {scanned && (
              <Button
                title={t("tap_to_Scan")}
                onPress={() => setScanned(false)}
              />
            )}
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  setShowScanModal(false);
                }}
              >
                <IconComponentProvider
                  style={styles.iconArea}
                  IconComponent={MaterialCommunityIcons}
                >
                  <Ionicons
                    name="arrow-back-circle-outline"
                    size={32}
                    color="rgba(24, 86, 127, 1)"
                  />
                </IconComponentProvider>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleToggleTorch();
                }}
              >
                <IconComponentProvider
                  style={styles.iconArea}
                  IconComponent={MaterialCommunityIcons}
                >
                  <Icon
                    name={isTorchOn ? "flashlight-off" : "flashlight"}
                    size={32}
                    color="rgba(24, 86, 127, 1)"
                  />
                </IconComponentProvider>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => {handleToggleCameraType()}}>
                                <IconComponentProvider style={styles.iconArea} IconComponent={MaterialCommunityIcons}
                                    >
                                    <Icon name={cameraType == 'back' ? 'camera-front' : 'camera'} size={32} color="rgba(24, 86, 127, 1)" />
                                </IconComponentProvider> 
                            </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
        <View style={styles.v2}>
          <View>
            <TextInput
              style={styles.in1}
              placeholder="Toyota Corolla X"
              value={vehicleName}
              onChangeText={(val) => {
                setVehicleName(val);
              }}
            />
            <Text style={styles.inputHeader}>{t("vehicle_name")}</Text>
          </View>
          <View>
            <View style={styles.v4}>
              <TextInput
                style={styles.qrInput}
                placeholder="863719061464781"
                maxLength={15}
                keyboardType="numeric"
                value={vehicleImei}
                onChangeText={(val) => {
                  setVehicleImei(val);
                }}
              />
              <View style={styles.iconArea}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("@@@@@@@@@@@@", global.hsaCameraPermission);
                    if (global.hsaCameraPermission == false) {
                      toastr(t("no_access_camera"));
                    } else {
                      setShowScanModal(true);
                      setScanned(false);
                    }
                  }}
                >
                  <IconComponentProvider
                    style={styles.iconArea}
                    IconComponent={MaterialCommunityIcons}
                  >
                    <Icon
                      name="qrcode-scan"
                      size={16}
                      color="rgba(24, 86, 127, 1)"
                    />
                  </IconComponentProvider>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.inputHeader}>{t("device_imei")}</Text>
          </View>
          <View>
            <SelectDropdown
              defaultValue={types[0]}
              defaultDropdownIconColor="#007aff"
              data={types}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setDeviceTypeIndex(index);
                setDeviceType(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
              dropdownStyle={{ backgroundColor: "#e6f5ff", borderRadius: 5 }}
              itemTextStyle={{ textAlign: "left" }}
              buttonStyle={styles.dropdown}
              buttonTextStyle={{ padding: 4, fontSize: 16, textAlign: "left" }}
            />
            <Text style={styles.inputHeader}>{t("device_type")}</Text>
          </View>
          <View>
            <SelectDropdown
              defaultValue={
                deviceTypeIndex == 0 ? teltonikaModels[0] : concoxModels[0]
              }
              defaultDropdownIconColor="#007aff"
              data={deviceTypeIndex == 0 ? teltonikaModels : concoxModels}
              onSelect={(selectedItem, index) => {
                setDeviceModel(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
              dropdownStyle={{ backgroundColor: "#e6f5ff", borderRadius: 5 }}
              itemTextStyle={{ textAlign: "left" }}
              buttonStyle={styles.dropdown}
              buttonTextStyle={{ padding: 4, fontSize: 16, textAlign: "left" }}
            />
            <Text style={styles.inputHeader}>{t("device_model")}</Text>
          </View>
          <View style={styles.in2}>
            <PhoneInput
              ref={phoneInputRef}
              style={styles.phoneInput}
              containerStyle={{
                backgroundColor: "#e6f5ff",
                padding: 0,
                margin: 0,
              }}
              textInputStyle={{
                backgroundColor: "#e6f5ff",
                padding: 0,
                margin: 0,
              }}
              labelStyle={{ backgroundColor: "#e6f5ff", padding: 0, margin: 0 }}
              // inputStyle={{ backgroundColor: '#e6f5ff' }}
              codeTextStyle={{ backgroundColor: "#e6f5ff" }}
              textInputProps={
                <TextInput
                  style={{ backgroundColor: "#e6f5ff", padding: 0, margin: 0 }}
                  maxLength={10}
                />
              }
              flagButtonStyle={{ backgroundColor: "#e6f5ff", marginLeft: 2 }}
              textContainerStyle={{
                backgroundColor: "#e6f5ff",
              }}
              placeholder="566485124"
              keyboardType="phone-pad"
              defaultCode="US"
              onChangeText={(text) => {
                setSimNumber(text);
              }}
              //value={simNumber}
              value=""
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.to2}
          onPress={() => {
            validate();
          }}
        >
          <Text style={{ color: "white", fontSize: 27, fontWeight: "500" }}>
            {t("submit")}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneInput: {
    //width: '80%',
    height: hp("7%"),
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  t1: {
    fontSize: 14,
    fontWeight: "500",
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  to1: {
    position: "absolute",
    width: 30,
    height: 30,
    left: 5,
    borderRadius: wp("10%"),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  v2: {
    backgroundColor: "#e6f5ff",
    marginHorizontal: 8,
    marginTop: -12,
    borderRadius: 12,
    position: "relative",
    height: hp("64%"),
    justifyContent: "space-between",
    marginVertical: hp("3%"),
    paddingVertical: 16,
  },
  dropdown: {
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    marginTop: hp("2.8%"),
    borderRadius: 5,
    borderWidth: 1,
    height: hp("6.5%"),
    paddingLeft: wp("5%"),
    borderColor: "#18567F8C",
    backgroundColor: "#e6f5ff",
    textAlign: "left",
    width: "92%",
  },
  in1: {
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    marginTop: hp("2.8%"),
    borderRadius: 5,
    borderWidth: 1,
    height: hp("6.5%"),
    padding: 4,
    paddingLeft: wp("5%"),
    borderColor: "#18567F8C",
  },
  in2: {
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    marginTop: hp("3%"),
    marginBottom: hp("1.8%"),
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#18567F8C",
    //width: wp('85%'),
    height: hp("7%"),
  },
  to2: {
    justifyContent: "center",
    alignItems: "center",
    width: wp("85%"),
    height: hp("7%"),
    alignSelf: "center",
    backgroundColor: "#18567F",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
  },
  img: {
    width: 36,
    height: 24,
    position: "absolute",
    top: 35,
    left: 25,
  },
  detailHeader: {
    flexDirection: "row",
    position: "relative",
    marginVertical: hp("4%"),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputHeader: {
    position: "absolute",
    backgroundColor: "#e6f5ff",
    left: wp("10%"),
    top: 12,
    fontSize: 10,
    fontWeight: "500",
    color: "#18567F",
  },
  textInputStyle: {
    color: "#FFF",
    fontFamily: "calibri",
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 20,
  },
  qricon: {
    marginRight: 10,
  },
  v4: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    marginTop: hp("3%"),
    borderColor: "#18567F8C",
    borderRadius: 5,
    marginHorizontal: 8,
    //width: wp('85%'),
    height: hp("7%"),
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    marginTop: hp("2.8%"),
    backgroundColor: "#e6f5ff",
  },

  qrInput: {
    padding: 4,
    borderRadius: 5,
    height: hp("6.5%"),
    paddingLeft: wp("5%"),
    borderColor: "#18567F8C",
    marginRight: wp("37%"),
  },
  iconArea: {
    //flex : 1,
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(24, 86, 127, 0.16)",
    marginHorizontal: 20,
  },
  cameraContainer: {
    width: "80%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
});
export default Add_vehicle;
