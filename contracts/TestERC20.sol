pragma solidity 0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract TestERC20 is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply) ERC20Detailed("TestToken", "TT", 18) public {
        _mint(msg.sender, initialSupply);
    }
}