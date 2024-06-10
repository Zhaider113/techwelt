const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    type: {type: String, required: true},
    lat: {type: String, required: true},
    lng: {type: String, required: true},
}, { timestamps: true })

module.exports = mongoose.model("Geofence", schema)