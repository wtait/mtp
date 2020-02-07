const TestERC20 = artifacts.require("./TestERC20.sol");

module.exports = function(deployer) { 
    const initialSupply = 12000
    deployer.deploy(TestERC20, initialSupply)
};