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
        address token_Address_;
        uint total_Staked_Tokens_;  //update on new stake deposits/withdraws of fungible tokens in/out of mtp network
        uint number_Token_Stakers_;
        uint token_Stake_Balance_;
        Staker[] token_Stakers_; //mapping doesnt support multiple instances of same staker in the stakechain
    }

    struct Staker { //change to TokenStaker
        address staker_Address_;
        //  uint stakerIndex_;
        int staker_Stake_Balance_; //must support negative integers
    }

    mapping(address => Token) public tokens;
    mapping(address => Staker) public stakers;

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

        if(stakers[from_].staker_Address_ != from_) {
            addStaker(from_);
        }

        if(stakers[to_].staker_Address_ != to_) {
            addStaker(to_);
        }


        //Staker storage s = stakers[to_];
        //s.staker_Address_ = to_;

        if(tokens[token_].token_Address_ != token_) {
            addToken(token_, to_);
        }


        Token storage t = tokens[token_];
        t.token_Address_ = token_;
        t.total_Staked_Tokens_ += amount_;
        t.number_Token_Stakers_ ++;
        t.token_Stake_Balance_ += t.number_Token_Stakers_;  //stakes should be abstracted to external contract or global variable?
        //t.token_Stakers_.push(to_);
        //t.token_Stakers_.push(s);

        //update bibo balances
            for(uint i = 0; i < t.token_Stakers_.length; i++) {
                address currentStakerAddress = t.token_Stakers_[i].staker_Address_;
                uint stakersBefore = i;
                uint stakersAfter = t.token_Stakers_.length - (i + 1);
                int  stakerNewStakes = int256(stakersAfter) - int256(stakersBefore);
                t.token_Stakers_[i].staker_Stake_Balance_ += stakerNewStakes;
                stakers[currentStakerAddress].staker_Stake_Balance_ += stakerNewStakes;
            }

        ERC20Interface = ERC20(token_);

        ERC20Interface.transferFrom(from_, to_, amount_);
        //emit mtpTransfer
    }

    //events
    //tokenAdded
    event TokenAdded(
        address indexed _tokenContract
        //uint indexed _numberOfTokens
        //string indexed _tokenName
        //fungible or nft
        //symbol
        //totalsupply
    );


    function addToken(address contractAddress, address tokenRecipient) public {
        //numTokens++;
        Token storage t_ = tokens[contractAddress];
        t_.token_Address_ = contractAddress;
        t_.total_Staked_Tokens_ = 0;
        t_.number_Token_Stakers_ = 0;
        t_.token_Stake_Balance_ = 0;
        t_.token_Stakers_.push(stakers[tokenRecipient]); //tokenRecipient should already be initialized as Staker
        // tokens[contractAddress] = Token(
        //     {
        //         token_Address_: contractAddress,
        //         total_Staked_Tokens_: 0,
        //         number_Token_Stakers_: 0,
        //         token_Stake_Balance_: 0,
        //         token_Stakers_: [Staker(contractAddress, 0)]
        //     }
        // );
        emit TokenAdded(contractAddress);
    }

    event StakerAdded(
        address indexed stakerAddress,
        uint indexed numberOfStakers
    );

    function addStaker(address stakerAddress_) public {
        stakers[stakerAddress_] = Staker(
            {
                staker_Address_: stakerAddress_,
                staker_Stake_Balance_: 0
            }
        );
    }

}

//events
  //stakerAdded
  //newMTPTransfer
  //newMTPNetworkDeployed