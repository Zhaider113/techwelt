const { vehicleSchema, companySchema, alertSchema, userSchema } = require("../models");
require('dotenv').config();
const mongoose = require("mongoose");

module.exports = () => {
  const createCompany = async (req, res) => {

    try {
      console.log(req.body)
      const { name,username,email,phoneNo,country,address,logo } = req.body

      const userId = req.user.id
      try {
        const company = await companySchema.findOne({ username: username })
        const admin = await userSchema.findOne({ _id: userId })
        if (admin.role != "Admin" && admin.role != "Manager") {
          res.status(400).send({ message: "Access denied" })
          return;
        }
        if (company) {
          res.status(400).send({ message: "Already same Company exists!" });
        } else {
          let company = new companySchema({
            name:name,
            username:username,
            email:email,
            phoneNo:phoneNo,
            country:country,
            address:address,
            logo:logo
          });
          let newCompany = await company.save();
          let alert = new alertSchema({
            userId: userId, 
            vehicle: newCompany._id,
            alert: "New Company added successfully"
          });
          await alert.save();
          res.status(200).send({ message: "Company added successfully" })
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
      const companies = await companySchema.find({
        where: {id_deleted: 0}
      }); // Fetch all rules

    const companyData = await Promise.all(
      companies.map(async (company) => {
        const vehicleCount = await vehicleSchema.countDocuments({ company: { $in: [company._id] } }); // Count vehicles with matching rule IDs
        // Fetch owner details using company ID
        const owner = await userSchema.findOne({ company: company._id });
        return {
          id: company._id,
          img: company.logo,
          companyName: company.name,
          username:company.username,
          owner: owner?`${owner.fname} ${owner.lname}`:'N/A',
          email: company.email,
          mobile: company.phoneNo,
          noVehicle: vehicleCount,
          country_name: company.country,
          status: "Deactivated",
          address:company.address
        };
      })
    );
    res.status(200).json(companyData);


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
      const {companyId, name,username,email,phoneNo,country,address,logo } = req.body

      companySchema.updateOne(
        { _id: companyId },
        {
          $set: {
            name: name,
            username: username,
            email: email,
            phoneNo: phoneNo,
            country: country,
            address: address,
            logo: logo
          }
        },
        (err, result) => {
          if (err) {
            res.status(401).json({ message: "Something went wrong" })
          }
          else {
            res.status(200).json({ message: "Company updated successfully", result })
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
    const { companyId } = req.body
    const userId = req.user.id
    if (!companyId || companyId == "") {
      res.status(401).json({ message: "Something went wrong" });
      return;
    }
    try {
      const admin = await userSchema.findOne({ _id: userId })
      if (admin.role != "Admin" && admin.role != "Manager") {
        res.status(400).send({ message: "Access denied" })
        return;
      }
      const company = await companySchema.findOne({ _id: companyId })

      if (!company) {
        res.status(200).json({ message: "Compnay not exist" })
      }
      else {
        await company.deleteOne()
        res.status(200).json({ message: "Company deleted successfully" })
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