pragma solidity 0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract MTP {

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

mapping(bytes32 => address) public tokens;

ERC20 public ERC20Interface;



/**
 * @dev method that handles transfer of ERC20 tokens to other address
 * it assumes the calling address has approved this contract * as spender
 * @param symbol_ identifier mapping to a token contract address
 * @param to_ beneficiary address
 * @param amount_ numbers of token to transfer */

  function transferTokens(bytes32 symbol_, address to_, uint256 amount_) public {
  //require(tokens[symbol_] != 0x0);
  //require(amount_ > 0);

  address contract_ = tokens[symbol_];
  //address from_ = msg.sender;

  ERC20Interface = ERC20(contract_);

  transactions.push(
  Transfer({
  contract_: contract_,
            to_: to_,
            amount_: amount_,
            failed_: true
  })
 );
 }
}