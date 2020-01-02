pragma solidity 0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract TutorialToken is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply) ERC20Detailed("TutorialToken", "TT", 18) public {
        _mint(msg.sender, initialSupply);
    }
}