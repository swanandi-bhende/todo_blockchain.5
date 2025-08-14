const TodoContract = artifacts.require("TodoContract");

module.exports = function (deployer) {  // Corrected parameter name
  deployer.deploy(TodoContract);
};