const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  rulename: {
    type: String,
    required: true,
  },
  devicebrand: {
    type: String,
    required: true,
  },
  devicemodel: {
    type: String,
    required: true,
  },
  ioPin: { 
    type: String,
    required: true,
  },
  ioStatus: { 
    type: String,
    required: true,
  },
  alertNotification: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Rules", schema);
