const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    subject: {type: String,required: true},
    text: {type: String,required: true},
    image: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User schema
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // Reference to the Company schema
    status: { type: Boolean, default: false },
    }, { timestamps: true })

module.exports = mongoose.model("Tickets", schema)