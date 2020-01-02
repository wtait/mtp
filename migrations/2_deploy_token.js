const TutorialToken = artifacts.require("./TutorialToken.sol");

module.exports = function(deployer) { 
    const initialSupply = 12000
    deployer.deploy(TutorialToken, initialSupply)
};