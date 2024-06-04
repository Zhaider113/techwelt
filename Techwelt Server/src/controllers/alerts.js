const { vehicleSchema, teltonikaSchema, userSchema, ruptelaSchema, alertSchema, companySchema } = require("../models");
require('dotenv').config();
const formatDate = (date) => {
  // Implement your desired date formatting logic here
  // Example: return new Date(date).toLocaleString(); // Adjust format as needed
  return date; // Placeholder for now
};

module.exports = () => {
  const showAlertList = async (req, res) => {
    try {
      const userId = req.user.id;
      const fromDate = req.query.fromDate; // Get from date from query parameter
      const toDate = req.query.toDate; // Get to date from query parameter
      const alertType = req.query.alertType; // Get alert type from query parameter
      const plateNo = req.query.plateNo; // Get plate number from query parameter

      const admin = await userSchema.findOne({ _id: userId });
      if (!admin) {
        res.status(401).send('token error!');
        return;
      }

      let vehicles = [];
      if (admin.role === "Admin" || admin.role === "Manager") {
        vehicles = await vehicleSchema.find({});
      } else {
        vehicles = await vehicleSchema.find({ addClient: admin.lname });
      }

      // Fetch company data for all retrieved vehicles
      const companies = await companySchema.find({ _id: { $in: vehicles.map(v => v.company) } });

      let alerts = [];
      if (admin.role === "Admin" || admin.role === "Manager") {
        alerts = await alertSchema.find({ userId });
      } else {
        alerts = await alertSchema.find({ userId, vehicle: { $in: vehicles.map(v => v._id) } });
      }

      // Apply filters
      if (fromDate && toDate) {
        alerts = alerts.filter(alert => alert.time >= fromDate && alert.time <= toDate);
      }
      if (alertType) {
        alerts = alerts.filter(alert => alert.alert === alertType);
      }
      if (plateNo) {
        alerts = alerts.filter(alert => vehicles.find(v => v._id === alert.vehicle).vehicleNo === plateNo);
      }

      let response = [];

      for (const vehicle of vehicles) {
        const filteredAlerts = alerts.filter(alert => alert.vehicle === vehicle._id.toString());
        if (filteredAlerts.length > 0) {
          const firstAlert = filteredAlerts[0];
          const companyData = companies.find(company => company._id === vehicle.company); // Find company data for the vehicle
          response.push({
            id: vehicle._id.toString(), // Assuming '_id' field represents the alert ID
            plate: vehicle.vehicleNo,
            alert: firstAlert.alert,
            location: {
              gps: "24.35164,54.514485",
              path: "AI Nahyan St,Duabi ,UAE",
              // gps: firstAlert.gps, // Assuming 'gps' field stores GPS coordinates
              // path: firstAlert.path, // Assuming 'path' field stores location path (or fetch from locationSchema if separate)
            },
            time: formatDate(firstAlert.time),
            company: companyData ? companyData.name : null, // Include company name or null if not found
          });
        }
      }

      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: "Something went wrong" });
    }
  };


  return {
    showAlertList
  };
};
