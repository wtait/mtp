pragma solidity 0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";


contract MTP {

    struct Staker { //change to TokenStaker
        address staker_Address_; //this is redundant. can replace with balances mapping
        int staker_Stake_Balance_; //must support negative integers
    }

    struct Token {
        address token_Address_; //this is redundant
        uint256 token_id_; //for nft tokens
        uint token_Stake_Balance_;
    }


    mapping(address => Token) public tokens;
    mapping(address => Staker) public stakers;
    mapping(uint256 => Token) public nftokens;//maps token id to token struct
    mapping(address => int256) public balances; //bibo balances. can be positive or negative;
    mapping(uint256 => address[]) public stakeChains;  //maps a token id to an array of staker addresses

    ERC20 public ERC20Interface;
    IERC721 public ERC721Interface;


    function nfMTPTransfer(address tokenContract_, address to_, uint256 tokenId_) public {
        require(_isMTPItem(tokenId_), "non fungible transfer: must deposit token to MTP first");

        address from_ = msg.sender;

        if(stakers[to_].staker_Address_ != to_) {
            addStaker(to_);
        }

        Token storage t = nftokens[tokenId_];

        stakeChains[tokenId_].push(to_);
        t.token_Stake_Balance_ += stakeChains[tokenId_].length;
        updateBiboBalances(tokenId_);

        ERC721Interface = IERC721(tokenContract_);
        ERC721Interface.safeTransferFrom(from_, to_, tokenId_);
    }


    event TokenAdded(
        address indexed _tokenContract
        //uint indexed _numberOfTokens
        //string indexed _tokenName
        //fungible or nft
        //symbol
        //totalsupply
    );


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
        t_.token_Stake_Balance_ = 1;
        stakeChains[tokenId].push(contractAddress);
        stakeChains[tokenId].push(tokenOwner);
    }


    function updateBiboBalances(uint256 tokenId) private {
        address[] memory tokenStakeChain = stakeChains[tokenId];

        for(uint i = 0; i < tokenStakeChain.length; i++) {
            address currentStakerAddress = tokenStakeChain[i];
            uint stakersBefore = i;
            uint stakersAfter = tokenStakeChain.length - (i + 1);
            int  stakerNewStakes = int256(stakersAfter) - int256(stakersBefore);
            balances[currentStakerAddress] += stakerNewStakes;
        }
    }

    event StakerAdded(
        address indexed stakerAddress,
        uint indexed numberOfStakers
    );

    function addStaker(address stakerAddress_) public {
        balances[stakerAddress_] = 0;
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

    function getStakeChainLength(uint256 tokenId) public returns (uint) {
        return stakeChains[tokenId].length;
    }

}



//events
  //stakerAdded
  //newMTPTransfer
  //newMTPNetworkDeployed