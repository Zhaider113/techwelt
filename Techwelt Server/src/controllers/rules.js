const { vehicleSchema, ruleSchema, alertSchema, userSchema } = require("../models");
require('dotenv').config();
const mongoose = require("mongoose");

module.exports = () => {
  const createRule = async (req, res) => {

    try {
      console.log(req.body)
      const {
        ruleName,
        deviceBrand,
        deviceModel,
        ioPin,
        ioStatus,
        alertNotification } = req.body
      const userId = req.user.id
      try {
        const rule = await ruleSchema.findOne({ rulename: ruleName })
        const admin = await userSchema.findOne({ _id: userId })
        if (admin.role != "Admin" && admin.role != "Manager") {
          res.status(400).send({ message: "Access denied" })
          return;
        }
        if (rule) {
          res.status(400).send({ message: "Already same Rule exists!" });
        } else {
          let rule = new ruleSchema({
            rulename: ruleName,
            devicebrand: deviceBrand,
            devicemodel: deviceModel,
            ioPin: ioPin,
            ioStatus: ioStatus,
            alertNotification: alertNotification
          });
          let newRule = await rule.save();
          let alert = new alertSchema({
            userId: userId, 
            vehicle: newRule._id,
            alert: "New Rule added successfully"
          });
          await alert.save();
          res.status(200).send({ message: "Rule added successfully" })
        }
      }
      catch (err) {
        console.log("error", err);
      }


    } catch (err) {
      console.log(err)
      res.status(401).send({ message: "Something went wrong" })
    }
  }

  const showRulesList = async (req, res) => {
    try {
      const userId = req.user.id

      try {
        const connectOptions = {
          useNewUrlParser: true,
          useUnifiedTopology: true
        };
        const teltonikaUrl = process.env.DATABASE_TELTONIKA_URL;
        const ruptelaUrl = process.env.DATABASE_RUPTELA_URL;
        const admin = await userSchema.findOne({ _id: userId });
        if (!admin) {
          res.status(401).send('token error!');
          return;
        }
        var vehicles = [];
        if (admin.role == "Admin" || admin.role == "Manager")
          vehicles = await vehicleSchema.find({});
        else
          vehicles = await vehicleSchema.find({ addClient: admin.lname });

        new Promise((resolve, reject) => {
          let cnt = 1;
          let tempBuffer = [];
          for (let index = 0; index < vehicles.length; index++) {
            let isTeltonika = (vehicles[index].deviceType === "Teltonika");
            let mongoUrl = teltonikaUrl;
            console.log(mongoUrl, "mogourl");
            if (!isTeltonika) mongoUrl = ruptelaUrl;
            const con = mongoose.createConnection(mongoUrl, connectOptions)
            con.on('connected', async function () {
              console.log("connected to ", mongoUrl)
              
              let tmpLat = 0, tmpLng = 0, address = "", stopTime = "", sendCommandDate = "", responseCommandDate = "";
              console.log(vehicles[index].deviceImei, isTeltonika ? teltonikaSchema : ruptelaSchema)
              const modelA = con.model(vehicles[index].deviceImei, isTeltonika ? teltonikaSchema : ruptelaSchema);
              console.log(modelA);
              const teltoObj1 = await modelA.find({lat:{$ne:-214.7483648}}).sort({ transferDate: -1 }).limit(1);
              console.log(teltoObj1, "teltoObj1")
              if(teltoObj1 && teltoObj1.length > 0) {
                tmpLat = teltoObj1[0].lat;
                tmpLng = teltoObj1[0].lng;
              }

              const teltoObj2 = await modelA.find({address:{$ne:""}}).sort({ transferDate: -1 }).limit(1);
              console.log(teltoObj2, "teltoObj2")
              
              if(teltoObj2 && teltoObj2.length > 0) {
                address = teltoObj2[0].address;
              }

              const lastIndex = await modelA.countDocuments({ movement: { $ne: 0 } }).sort({ transferDate: -1 });
              const teltoObj3 = await modelA.findOne().skip(lastIndex).limit(1);
              if(teltoObj3) {
                stopTime = teltoObj3.transferDate;
              }

              const teltoObj4 = await modelA.find().sort({ sendCommandDate: -1 }).limit(1);
              if(teltoObj4 && teltoObj4.length > 0) {
                sendCommandDate = teltoObj4[0]?.sendCommandDate;
              }


              const teltonicaObject = await modelA.find().sort({ transferDate: -1 }).limit(2);
              let tempObject = vehicles[index];
              let temperature = 0;
              let engineStatus = "Off";
              let ignitionStatus = "Off";
              let batteryVolt = 0;
              let simNumber = 0;
              let gpsFixed = 0;
              if (teltonicaObject.length > 0) {
                let ioValue = teltonicaObject[teltonicaObject.length - 1].IOvalue;
                for (var i = 0; ioValue && ioValue.length && i < ioValue.length; i++) {
                  let tmp = ioValue[i];
                  // if (tmp.dataId == 916 && tmp.dataValue == 1) {
                  if (tmp.dataId == 1 && tmp.dataValue == 1) {
                    engineStatus = "On"
                  }
                  if (tmp.dataId == 179 && tmp.dataValue == 1) {
                    ignitionStatus = "On"
                  }
                  if (tmp.dataId == 115) {
                    temperature = tmp.dataValue * 0.1;
                  }
                  if (tmp.dataId == 67) {
                    batteryVolt = tmp.dataValue * 0.001;
                  }
                  if (tmp.dataId == 11) {
                    simNumber = tmp.dataValue;
                  }
                  if (tmp.dataId == 69) {
                    gpsFixed = tmp.dataValue;
                  }
                }
              }
              tempObject = {
                vehicle: {
                  teltonikas: teltonicaObject,
                  userId: tempObject.userId,
                  vehicleName: tempObject.vehicleNo,
                  deviceType: tempObject.deviceType,
                  deviceImei: tempObject.deviceImei,
                  temperature: temperature,
                  engineStatus: engineStatus,
                  ignitionStatus: ignitionStatus,
                  batteryVolt: batteryVolt,
                  iccid: simNumber,
                  gpsFixed: gpsFixed,
                  mobileNo: tempObject.mobileNo,
                  title: tempObject.vehicleType,
                  deviceModel: tempObject.deviceModel,
                  isConnected: tempObject.isConnected,
                  createdAt: tempObject.createdAt,
                  updatedAt: tempObject.updatedAt,
                  camera:tempObject.camera,
                  polygonData: tempObject.polygonData,
                  lat:tmpLat,
                  lng:tmpLng,
                  address:address,
                  stopTime:stopTime,
                  limitSpeed:tempObject.limitSpeed,
                  limitFuel:tempObject.limitFuel,
                  limitLowTemp:tempObject.limitLowTemp,
                  limitHighTemp:tempObject.limitHighTemp,
                  onStop:tempObject.onStop,
                  onMove:tempObject.onMove,
                  sendCommandDate:sendCommandDate,
                  responseCommandDate:responseCommandDate
                }
              }
              tempBuffer.push(tempObject);
              if (cnt == vehicles.length) {
                resolve(tempBuffer);
                res.status(200).send(tempBuffer)
              }
              cnt++;
            })
          }
          if (vehicles.length === 0)
            res.status(200).send(tempBuffer)
        })
      }
      catch (err) {
        console.log("error", err);
        res.status(401).send({ message: "Something went wrong" })
      }


    } catch (err) {
      console.log(err)
      res.status(401).send({ message: "Something went wrong" })
    }
  }

  const updateRule = async (req, res) => {
    const userId = req.user.id
    try {
      const admin = await userSchema.findOne({ _id: userId })
      if (admin.role != "Admin" && admin.role != "Manager") {
        res.status(400).send({ message: "Access denied" })
        return;
      }
      const {
        ruleName,
        deviceBrand,
        deviceModel,
        ioPin,
        ioStatus,
        alertNotification } = req.body

      ruleSchema.updateOne(
        { _id: id },
        {
          $set: {
            ruleName:ruleName,
            deviceBrand:deviceBrand,
            deviceModel:deviceModel,
            ioPin:ioPin,
            ioStatus:ioStatus,
            alertNotification: alertNotification
          }
        },
        (err, result) => {
          if (err) {
            res.status(401).json({ message: "Something went wrong" })
          }
          else {
            res.status(200).json({ message: "Rule updated successfully", result })
          }
        }
      )
    } catch (err) {
      console.log("Update Fail:", err)
      res.status(400).send({ message: "Something went wrong" })
    }
  }

  // const updateSatus = async () => {
  //   try {
  //     const connectOptions = {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true
  //     };
  //     const mongoUrl = process.env.DATABASE_TELTONIKA_URL
  //     var vehicles = await vehicleSchema.find({});

  //     const con = await mongoose.createConnection(mongoUrl, connectOptions)
  //     con.on('connected', async function () {
  //       for (let index = 0; index < vehicles.length; index++) {

  //         const modelA = con.model(vehicles[index].deviceImei, teltonikaSchema);
  //         const teltonicaObject = await modelA.findOne({}).sort({ transferDate: -1 });
  //         if (teltonicaObject && teltonicaObject.transferDate) {
  //           let dev_date = new Date(teltonicaObject.transferDate);
  //           dev_date = new Date(dev_date.getTime() + 3 * 60000);
  //           let curTime = new Date();
  //           if (dev_date > curTime) {
  //             let tmps = await modelA.find().sort({ transferDate: -1 }).limit(2);
  //             if (tmps && tmps.length > 1 && (tmps[0].lat != tmps[1].lat || tmps[0].lng != tmps[1].lng)) {
  //               await vehicleSchema.updateOne({ deviceImei: vehicles[index].deviceImei }, { $set: { isConnected: "Connected" } })
  //             } else {
  //               await vehicleSchema.updateOne({ deviceImei: vehicles[index].deviceImei }, { $set: { isConnected: "Idle" } })
  //             }
  //           } else {
  //             await vehicleSchema.updateOne({ deviceImei: vehicles[index].deviceImei }, { $set: { isConnected: "Not Connected" } })
  //           }
  //         }
  //       }
  //     })
  //   }
  //   catch (err) {
  //     console.log("error", err);
  //   }
  // }

  const removeRule = async (req, res) => {
    const { ruleId } = req.body
    const userId = req.user.id
    if (!ruleId || ruleId == "") {
      res.status(401).json({ message: "Something went wrong" });
      return;
    }
    try {
      const admin = await userSchema.findOne({ _id: userId })
      if (admin.role != "Admin" && admin.role != "Manager") {
        res.status(400).send({ message: "Access denied" })
        return;
      }
      const rule = await ruleSchema.findOne({ _id: ruleId })

      if (!rule) {
        res.status(200).json({ message: "Rule not exist" })
      }
      else {
        await rule.deleteOne()
        res.status(200).json({ message: "Rule deleted successfully" })
      }
    } catch (err) {
      console.log(err)
      res.status(401).json({ message: "Something went wrong" })
    }
  }

  // const getStatus = async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const admin = await userSchema.findOne({ _id: userId });
  //     let vehicles = [];
  //     if (admin && admin.role === "Admin" || admin.role === "Manager") {
  //       vehicles = await vehicleSchema.find({}, { userId: 1, deviceImei: 1, isConnected: 1 });
  //     } else {
  //       vehicles = await vehicleSchema.find({ addClient: admin.lname }, { userId: 1, deviceImei: 1, isConnected: 1 });
  //     }
  //     if (vehicles)
  //       res.status(200).send(vehicles);
  //     else
  //       res.status(400).send("Some went wrong!!!");
  //   } catch (err) {
  //     console.log("error", err);
  //     res.status(500).send("Error Occured!!")
  //   }
  // }

  return {
    createRule,
    showRulesList,
    updateRule,
    removeRule,
    // updateSatus,
    // getStatus,
  }
}