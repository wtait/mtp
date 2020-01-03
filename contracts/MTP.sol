pragma solidity 0.5.12;

import "@openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract MTPTransfer {

  /**
 * @dev Details of each transfer
 * @param contract_ contract address of ER20 token to transfer
 * @param to_ receiving account
  * @param amount_ number of tokens to transfer to_ account
  * @param failed_ if transfer was successful or not */

 struct Transfer {
  address contract_;
  address to_;
  uint amount_;
  bool failed_;
 }


   /**
 * @dev a list of all transfers successful or unsuccessful */

Transfer[] public transactions;


ERC20 public ERC20Interface;

}