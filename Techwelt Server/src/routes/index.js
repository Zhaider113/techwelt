const express = require("express");
const router = express.Router();

module.exports = () => {
  
  const vehiclesRoutes = require("./vehicles")(router)
  const teltonikaRoutes = require("./teltonika")(router)
  const usersRoutes = require("./users")(router)
  const commonRoutes = require("./common")(router)
  const alertRoutes = require("./alerts")(router)
  const rulesRoutes = require("./rules")(router)
  const companyRoutes = require("./company")(router)
  const ticketRoutes = require("./ticket")(router)

  router.use("/vehicles", vehiclesRoutes);
  router.use("/teltonika", teltonikaRoutes);
  router.use("/users", usersRoutes);
  router.use("/common", commonRoutes);
  router.use("/alerts", alertRoutes);
  router.use("/company", companyRoutes);
  router.use("/ticket", ticketRoutes);

  return router;
};
