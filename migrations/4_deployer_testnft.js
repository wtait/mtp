const TestNFT = artifacts.require("./TestNFT.sol");

module.exports = async function(deployer) { 
    await deployer.deploy(TestNFT)
    const erc721 = await TestNFT.deployed()
};