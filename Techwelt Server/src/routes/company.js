
module.exports = (router) => {
  const Company = require("../controllers/company")
  const {
    createCompany,
    showCompanyList,
    updateCompany,
    removeCompany
  } = Company()

  router.post("/new", createCompany)//add Rules
  router.post("/companyList", showCompanyList)    //get Rules list normal
  router.post("/update", updateCompany)    //update rules
  router.post("/remove", removeCompany) //remove rules
  
  return router
}