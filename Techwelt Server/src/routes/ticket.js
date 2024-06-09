
module.exports = (router) => {
  const Tickets = require("../controllers/ticket")
  const {
    createTicket,
    showTicketsList,
    updateSatus,
    removeTicket
  } = Tickets()

  router.post("/addTicket", createTicket)//add Tickets
  router.post("/ticketList", showTicketsList)    //get Tickets list normal
  router.post("/updateStatus", updateSatus)    //update Tickets
  router.post("/remove", removeTicket) //remove Tickets
  
  return router
}