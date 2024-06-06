
module.exports = (router) => {
  const Rules = require("../controllers/rules")
  const cmds = require("../controllers/command")
  const {
    createRule,
    showRulesList,
    updateRule,
    removeRule
  } = Rules()

  router.post("/add", createRule)//add Rules
  router.post("/ruleList", showRulesList)    //get Rules list normal
  router.post("/update", updateRule)    //update rules
  router.post("/remove", removeRule) //remove rules
  
  return router
}