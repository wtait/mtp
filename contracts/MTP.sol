pragma solidity 0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";


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

    struct Staker { //change to TokenStaker
        address staker_Address_;
        //  uint stakerIndex_;
        int staker_Stake_Balance_; //must support negative integers
    }

    struct Token {
        address token_Address_;
        uint256 token_id_; //for nft tokens
        uint total_Staked_Tokens_;  //update on new stake deposits/withdraws of fungible tokens in/out of mtp network
        uint number_Token_Stakers_;
        uint token_Stake_Balance_;
        Staker[] token_Stakers_; //mapping doesnt support multiple instances of same staker in the stakechain
    }


    mapping(address => Token) public tokens;
    mapping(address => Staker) public stakers;
    mapping(uint256 => Token) public nftokens;

    ERC20 public ERC20Interface;
    IERC721 public ERC721Interface;

  // constructor() public {  //need to inherit Ownable if used
  //   owner = msg.sender;
  // }


    function nfMTPTransfer(address tokenContract_, address to_, uint256 tokenId_) public {
        require(_isMTPItem(tokenId_), "non fungible transfer: must deposit token to MTP first");

        address from_ = msg.sender;

        // if(stakers[from_].staker_Address_ != from_) {
        //     addStaker(from_);
        // }

        if(stakers[to_].staker_Address_ != to_) {
            addStaker(to_);
        }

        // if(nftokens[tokenId_].token_id_ != tokenId_) {
        //     addToken(tokenContract_, from_, to_, tokenId_);
        // }
        // else {
        //     Token storage t = nftokens[tokenId_];
        //     t.token_Stakers_.push(stakers[to_]);
        //     t.number_Token_Stakers_ ++;
        //     t.token_Stake_Balance_ += t.number_Token_Stakers_;  //stakes should be abstracted to external contract or global variable?
        // }

        Token storage t = nftokens[tokenId_];
        t.token_Stakers_.push(stakers[to_]);
        t.number_Token_Stakers_ ++;
        t.token_Stake_Balance_ += t.number_Token_Stakers_;

        //update bibo balances
        // for(uint i = 0; i < t.token_Stakers_.length; i++) {
        //     address currentStakerAddress = t.token_Stakers_[i].staker_Address_;
        //     uint stakersBefore = i;
        //     uint stakersAfter = t.token_Stakers_.length - (i + 1);
        //     int  stakerNewStakes = int256(stakersAfter) - int256(stakersBefore);
        //     t.token_Stakers_[i].staker_Stake_Balance_ += stakerNewStakes;
        //     stakers[currentStakerAddress].staker_Stake_Balance_ += stakerNewStakes;
        // }
        updateBiboBalances(tokenId_);

        ERC721Interface = IERC721(tokenContract_);
        //ERC721Interface.approve(from_, tokenId_);
        ERC721Interface.safeTransferFrom(from_, to_, tokenId_);
    }


    function mtpTransfer(address token_, address to_, uint256 amount_) public {
        address from_ = msg.sender;

        if(stakers[from_].staker_Address_ != from_) {
            addStaker(from_);
        }

        if(stakers[to_].staker_Address_ != to_) {
            addStaker(to_);
        }


        //Staker storage s = stakers[to_];
        //s.staker_Address_ = to_; not push stakers when stakers already exist

        if(tokens[token_].token_Address_ != token_) {
            addToken(token_, from_, to_);
        } else {
            Token storage t = tokens[token_];
            t.token_Stakers_.push(stakers[to_]);
            t.number_Token_Stakers_ ++;
            t.token_Stake_Balance_ += t.number_Token_Stakers_;  //stakes should be abstracted to external contract or global variable?
        }


        Token storage t = tokens[token_];
        t.total_Staked_Tokens_ += amount_;  //this does not equal the circulating supply since
        //we do not actually index the total number of fungible tokens deposited. but rather #tokens * #transfers

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


    function addToken(address contractAddress, address tokenSender, address tokenRecipient) public {
        //numTokens++;
        Token storage t_ = tokens[contractAddress];
        t_.token_Address_ = contractAddress;
        t_.total_Staked_Tokens_ = 0;
        t_.number_Token_Stakers_ = 2;
        t_.token_Stake_Balance_ = 1;
        t_.token_Stakers_.push(stakers[tokenSender]); //tokenRecipient should already be initialized as Staker
        t_.token_Stakers_.push(stakers[tokenRecipient]);
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

    function addToken(address contractAddress, address tokenSender, address tokenRecipient, uint256 tokenId) public {
        Token storage t_ = nftokens[tokenId];
        t_.token_Address_ = contractAddress;
        t_.token_id_ = tokenId;
        //t_.total_Staked_Tokens_ = 0;
        t_.number_Token_Stakers_ = 2;
        t_.token_Stake_Balance_ = 1;
        t_.token_Stakers_.push(stakers[tokenSender]); //tokenRecipient should already be initialized as Staker
        t_.token_Stakers_.push(stakers[tokenRecipient]);
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

    function depositNonFungibleToken(address contractAddress, address tokenOwner, uint256 tokenId) public {
        if(stakers[tokenOwner].staker_Address_ != tokenOwner) {
            addStaker(tokenOwner);
        }
        if(stakers[contractAddress].staker_Address_ != contractAddress) {
            addStaker(contractAddress);
        }
        Token storage t_ = nftokens[tokenId];
        t_.token_Address_ = contractAddress;
        t_.token_id_ = tokenId;
        Staker storage owner_ = stakers[tokenOwner];
        Staker storage tokenContract_ = stakers[contractAddress];
        t_.token_Stakers_.push(tokenContract_);
        t_.token_Stakers_.push(owner_); //tokenRecipient should already be initialized as Staker
        t_.number_Token_Stakers_ = 2; //setting to 2 includes token address as root staker account and depositor/owner as second staker account
        t_.token_Stake_Balance_ = 1;
        //emit TokenAdded(contractAddress);
    }


    function updateBiboBalances(uint256 tokenId) private {
        Token storage t_ = nftokens[tokenId];

        for(uint i = 0; i < t_.token_Stakers_.length; i++) {  // i initialized to 1 to skip over token address which is included in
            address currentStakerAddress = t_.token_Stakers_[i].staker_Address_;
            uint stakersBefore = i;
            uint stakersAfter = t_.token_Stakers_.length - (i + 1);
            int  stakerNewStakes = int256(stakersAfter) - int256(stakersBefore);
            t_.token_Stakers_[i].staker_Stake_Balance_ += stakerNewStakes;
            stakers[currentStakerAddress].staker_Stake_Balance_ += stakerNewStakes;
        }
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


    function _isMTPItem(uint256 tokenId) internal view returns (bool) {
        uint256 existingId = nftokens[tokenId].token_id_;
        return existingId == tokenId;
    }

}



//events
  //stakerAdded
  //newMTPTransfer
  //newMTPNetworkDeployed