const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
  } = require('@openzeppelin/test-helpers');
  const { ZERO_ADDRESS } = constants;

require('chai')
    .use(require('chai-as-promised'))
    .should();


describe('MTP', () => {

    const MTP = contract.fromArtifact('MTP');
    const NFTContract = contract.fromArtifact('TestNFT');
    const[alice, bob] = accounts;


    beforeEach(async function() {
        this.mtp = await MTP.new();
        this.mtpAddress = await this.mtp.address;
        this.nftokenContract = await NFTContract.new();
        this.nfTokenAddress = await this.nftokenContract.address;
        this.nftokenId = new BN('5042');
        this.nft = await this.nftokenContract.mintUniqueTokenTo(alice, this.nftokenId);
        await this.mtp.depositNonFungibleToken(this.nfTokenAddress, alice, this.nftokenId);
    });

    describe("NFT Transfers", function() {

        it("should be able to transfer an nft from sender to receiver", async function() {
            let owner = await this.nftokenContract.ownerOf(this.nftokenId);
            owner.should.equal(alice);
            await this.nftokenContract.setApprovalForAll(this.mtpAddress, true, {from: alice});
            await this.mtp.nfMTPTransfer(this.nfTokenAddress, bob, this.nftokenId, {from: alice});
            let newOwner = await this.nftokenContract.ownerOf(this.nftokenId);
            newOwner.should.equal(bob);
        });
        it('should have a mapping called nftokens', async function() {
            const tokenMapping = await this.mtp.nftokens;
            tokenMapping.should.to.exist;
        });
        it('should add a Token struct to nftokens mapping when a new token is staked', async function() {
            await this.nftokenContract.setApprovalForAll(this.mtpAddress, true, {from: alice});
            await this.mtp.nfMTPTransfer(this.nfTokenAddress, bob, this.nftokenId, {from: alice});
            const newTokenStruct = await this.mtp.nftokens.call(this.nftokenId);
            const newTokenId = newTokenStruct.token_id_.toNumber();
            newTokenId.should.equal(this.nftokenId.toNumber());
        });
        it('should keep bibo total supply at 0 after transfers',async function() {
            let stakeChains = [];
            for(i = 0; i < accounts.length - 1; i++) {
                let sender = accounts[i];
                let receiver = accounts[i + 1];
                await this.nftokenContract.setApprovalForAll(this.mtpAddress, true, {from: sender});
                await this.mtp.nfMTPTransfer(this.nfTokenAddress, receiver, this.nftokenId, {from: sender});
                let stakeChain = [];

                let numStakers = await this.mtp.getStakeChainLength.call(this.nftokenId);
                let n = 0;
                while(n < numStakers) {
                    let currentStakerAddress = await this.mtp.stakeChains.call(this.nftokenId, n);
                    stakeChain.push(currentStakerAddress);
                    n++;
                }
                stakeChains.push(stakeChain);
            }

            let lastChain = stakeChains[stakeChains.length - 1];
            
            for(i = 0; i < lastChain.length; i++) {
                let address = lastChain[i];
                let balance = await this.mtp.balances.call(address);
                lastChain[i] = {"address": address, "balance": balance.toNumber()};
            }

            let biboTotalSupply = lastChain.reduce(function(total, account) {
                total += account.balance;
                return total;
            }, 0);

            biboTotalSupply.should.equal(0);
        });
    });

});