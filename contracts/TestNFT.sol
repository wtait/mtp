pragma solidity ^0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
//import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";
//import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol";


contract TestNFT is ERC721, ERC721Metadata {
    constructor () ERC721Metadata("Test NFT", "NFTY") public {}

    /**
    * Custom accessor to create a unique token
    */
    function mintUniqueTokenTo(
        address _to,
        uint256 _tokenId
        // string  _tokenURI
    ) public
    {
        super._mint(_to, _tokenId);
        // super._setTokenURI(_tokenId, _tokenURI);
    }
}