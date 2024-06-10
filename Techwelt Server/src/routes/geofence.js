
module.exports = (router) => {
  const Geofence = require("../controllers/geofence")
  const {
    createGeofence,
    showGeofenceList,
  } = Geofence()

  router.post("/addZone", createGeofence)//add Geofence
  router.post("/zoneList", showGeofenceList)    //get Geofence list normal
  
  return router
}