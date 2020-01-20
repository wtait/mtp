const TestNFT = artifacts.require("./TestNFT.sol");

module.exports = function(deployer) { 
    deployer.deploy(TestNFT)
};