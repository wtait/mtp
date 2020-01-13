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
   address addr;
   //Staker[] stakers;
   uint numberStakers;
   //mapping (uint => Staker) stakers;
 }



 struct Staker {
   address stakerAddress;
  //  uint stakerIndex_;
   int stakerBalance;
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
 * @param token_ token contract address
 * @param to_ beneficiary address

 * @param amount_ numbers of token to transfer */

  function mtpTransfer(address token_, address to_, uint256 amount_) public {

  address from_ = msg.sender;

  if(! (tokens[token_].addr == token_)) {
    addToken(token_);
  }

  Token storage t = tokens[token_];
  t.addr = token_;
  t.numberStakers++;

  ERC20Interface = ERC20(token_);


  ERC20Interface.transferFrom(from_, to_, amount_);

  //update bibo balances
  //emit mtpTransfer
 }

  //events
  //tokenAdded
  event TokenAdded(
    address indexed _tokenContract,
    uint indexed _numberOfTokens
    //string indexed _tokenName
    //fungible or nft
    //symbol
    //totalsupply
  );

  function addToken(address contractAddress) public returns (uint numTokens){
    numTokens++;
    tokens[contractAddress] = Token({addr: contractAddress, numberStakers: 0});
    // t.stakers.push(Staker({
    //   staker_: contractAddress,
    //   balance_: 0
    // }));
    emit TokenAdded(contractAddress, numTokens);
  }

}


//events
  //stakerAdded
  //newMTPTransfer
  //newMTPNetworkDeployed