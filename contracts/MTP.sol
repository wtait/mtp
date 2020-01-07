pragma solidity 0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract MTP {

  /**
 * @dev Details of each transfer
 * @param contract_ contract address of ER20 token to transfer
 * @param to_ receiving account
  * @param amount_ number of tokens to transfer to_ account
  * @param failed_ if transfer was successful or not */

//  struct Transfer {
//   address contract_;
//   address to_;
//   uint amount_;
//   bool failed_;
//  }

 struct Token {
   address contract_;
   Staker[] stakers;
 }


 struct Staker {
   address staker_;
  //  uint stakerIndex_;
   int balance_;
 }




   /**
 * @dev a list of all transfers successful or unsuccessful */


//mapping(bytes32 => address) public tokens;
mapping(address => Token) public tokens;



ERC20 public ERC20Interface;

  // constructor() public {  //need to inherit Ownable if used
  //   owner = msg.sender;
  // }

/**
 * @dev method that handles transfer of ERC20 tokens to other address
 * it assumes the calling address has approved this contract * as spender
 * @param symbol_ identifier mapping to a token contract address
 * @param to_ beneficiary address
 * @param amount_ numbers of token to transfer */

  function mtpTransfer(address token_, address to_, uint256 amount_) public {
  //require(tokens[symbol_] != 0x0);
  //require(amount_ > 0);

  //contract_ = tokens[token_];
  address from_ = msg.sender;

  
  tokens[address] ? : tokens[address] = Token(address)

  ERC20Interface = ERC20(token_);


  ERC20Interface.transferFrom(from_, to_, amount_);
 }

  function addToken(address contractAddress) public {
    Token storage t = tokens[contractAddress];
    // t.stakers.push(Staker({
    //   staker_: contractAddress,
    //   balance_: 0
    // }));
  }

}