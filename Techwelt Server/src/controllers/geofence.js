const { geofenceSchema, userSchema } = require("../models");
require('dotenv').config();
const mongoose = require("mongoose");

module.exports = () => {
  const createGeofence = async (req, res) => {

    try {
      const {lat, lng, type} = req.body
      const userId = req.user.id
      try {
        const admin = await userSchema.findOne({ _id: userId })
        if (admin.role != "Admin" && admin.role != "Manager") {
          res.status(400).send({ message: "Access denied" })
          return;
        }
          let geofence = new geofenceSchema({
            type: type,
            lat: lat,
            lng: lng
          });
          let newZone = await geofence.save();
          res.status(200).send({ message: "geofence added successfully" })
      }
      catch (err) {
        console.log("error", err);
      }
    } catch (err) {
      console.log(err)
      res.status(401).send({ message: "Something went wrong" })
    }
  }

  const showGeofenceList = async (req, res) => {
    try {
      const geofences = await geofenceSchema.find({
        where: {id_deleted: 0}
      }); // Fetch all rules

    res.status(200).json(geofences);


    } catch (err) {
      console.log(err)
      res.status(401).send({ message: "Something went wrong" })
    }
  }

  return {
    createGeofence,
    showGeofenceList,
  }
}