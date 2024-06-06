const { vehicleSchema, ruleSchema, alertSchema, userSchema } = require("../models");
require('dotenv').config();
const mongoose = require("mongoose");

module.exports = () => {
  const createCompany = async (req, res) => {

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

  const showCompanyList = async (req, res) => {
    try {
      const rules = await ruleSchema.find({
        where: {id_deleted: 0}
      }); // Fetch all rules

    const rulesWithVehicleCounts = await Promise.all(
      rules.map(async (rule) => {
        const vehicleCount = await vehicleSchema.countDocuments({ rules: { $in: [rule._id] } }); // Count vehicles with matching rule IDs
        return {
          id: rule._id,
          rule: rule.rulename,
          device: rule.devicebrand,
          model: rule.devicemodel,
          pin: rule.ioPin,
          vehicle: vehicleCount,
          status: 'Deactive', // Assuming a "status" field in the Rule schema
        };
      })
    );
    res.status(200).json(rulesWithVehicleCounts);


    } catch (err) {
      console.log(err)
      res.status(401).send({ message: "Something went wrong" })
    }
  }

  const updateCompany = async (req, res) => {
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

  const removeCompany = async (req, res) => {
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
    createCompany,
    showCompanyList,
    updateCompany,
    removeCompany
    // updateSatus,
    // getStatus,
  }
}