const express = require("express");
const router = express.Router();

module.exports = () => {
  
  const vehiclesRoutes = require("./vehicles")(router)
  const teltonikaRoutes = require("./teltonika")(router)
  const usersRoutes = require("./users")(router)
  const commonRoutes = require("./common")(router)

  router.use("/vehicles", vehiclesRoutes);
  router.use("/teltonika", teltonikaRoutes);
  router.use("/users", usersRoutes);
  router.use("/common", commonRoutes);

  return router;
};
