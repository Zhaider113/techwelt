const { companySchema, ticketSchema, userSchema } = require("../models");
require('dotenv').config();
const mongoose = require("mongoose");

module.exports = () => {
  const createTicket = async (req, res) => {

    try {
      console.log(req.body)
      const {subject, text, image} = req.body
      const userId = req.user.id
      try {
        const admin = await userSchema.findOne({ _id: userId })
        if (admin.role != "Admin" && admin.role != "Manager") {
          res.status(400).send({ message: "Access denied" })
          return;
        }
          let ticket = new ticketSchema({
            subject: subject,
            text: text,
            image: image,
            user: userId
          });
          let newRule = await ticket.save();
          res.status(200).send({ message: "Ticket added successfully" })
      }
      catch (err) {
        console.log("error", err);
      }
    } catch (err) {
      console.log(err)
      res.status(401).send({ message: "Something went wrong" })
    }
  }

  const showTicketsList = async (req, res) => {
    try {
      const tickets = await ticketSchema.find({
        where: {id_deleted: 0}
      }); // Fetch all rules

    const ticketData = await Promise.all(
      tickets.map(async (ticket) => {
        console.log(ticket.company)
        const user = await userSchema.findOne(ticket.user);
        const company = 'N/A';
        if(ticket.company){
          company = await companySchema.findOne(ticket.company);
        }
        return {
          id: ticket._id,
          subject: ticket.subject,
          text: ticket.text,
          user: user?user.fname:'N/A',
          company: company?company.name:'N/A',
          date: ticket.createdAt,
          status: ticket.status?'Resolved':'Pending', // Assuming a "status" field in the Rule schema
        };
      })
    );
    res.status(200).json(ticketData);


    } catch (err) {
      console.log(err)
      res.status(401).send({ message: "Something went wrong" })
    }
  }

  const updateSatus = async () => {
    const { ticketId, status } = req.body
    const userId = req.user.id
    if (!ticketId || ticketId == "") {
      res.status(401).json({ message: "Something went wrong" });
      return;
    }
    try {
      const admin = await userSchema.findOne({ _id: userId })
      if (admin.role != "Admin" && admin.role != "Manager") {
        res.status(400).send({ message: "Access denied" })
        return;
      }
      const ticket = await ticketSchema.findOne({ _id: ticketId })

      if (!ticket) {
        res.status(200).json({ message: "Ticket not exist" })
      }
      else {
        if(status === 'Pending'){
          ticket.status = 0;
        }else if(status === 'Resolved'){
          ticket.status = 1;
        }
        await ticket.save()
        res.status(200).json({ message: "Ticket Status Updated successfully" })
      }
    } catch (err) {
      console.log(err)
      res.status(401).json({ message: "Something went wrong" })
    }
  }

  const removeTicket = async (req, res) => {
    const { ticketId } = req.body
    const userId = req.user.id
    if (!ticketId || ticketId == "") {
      res.status(401).json({ message: "Something went wrong" });
      return;
    }
    try {
      const admin = await userSchema.findOne({ _id: userId })
      if (admin.role != "Admin" && admin.role != "Manager") {
        res.status(400).send({ message: "Access denied" })
        return;
      }
      const ticket = await ticketSchema.findOne({ _id: ticketId })

      if (!ticket) {
        res.status(200).json({ message: "Ticket not exist" })
      }
      else {
        await ticket.deleteOne()
        res.status(200).json({ message: "Ticket deleted successfully" })
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
    createTicket,
    showTicketsList,
    removeTicket,
    updateSatus
  }
}