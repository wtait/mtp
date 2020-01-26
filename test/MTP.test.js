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
    const TutorialToken = contract.fromArtifact('TutorialToken');
    const tNFT = contract.fromArtifact('TestNFT');
    const initialSupply = 12000;
    const[alice, bob] = accounts;

    beforeEach(async function() {
        this.mtp = await MTP.new();
        this.token = await TutorialToken.new(initialSupply, {from: alice});
        this.tokenAddress = await this.token.address;
        this.nftoken = await tNFT.new();
        this.nfTokenAddress = await this.nftoken.address;
        this.mtpAddress = await this.mtp.address;
    });

    describe('MTP Contract', function() {
        it('tests begin', function() {
            const test = typeof(this.mtp);
            test.should.equal('object');
        });
        it('distributes correct amount to accounts', async function() {
            let founderBalance = await this.token.balanceOf(alice);
            founderBalance = founderBalance.toNumber();
            founderBalance.should.equal(initialSupply);
        });
        it('should be able to  transfer sender token to another wallet', async function() {
            this.value = new BN(1);
            await this.token.approve(this.mtpAddress, this.value,{from: alice});
            await this.mtp.mtpTransfer(this.tokenAddress, bob, this.value, {from: alice})
            let balance = ((await  this.token.balanceOf(bob)).toString());
            balance.should.equal(this.value.toString())
        });
        it('should emit a tokenAdded event when a new token is deposited', async function() {
            this.value = new BN(1);
            await this.token.approve(this.mtpAddress, this.value,{from: alice});
            const receipt = await this.mtp.mtpTransfer(
                this.tokenAddress, bob, this.value, {from: alice}
            );

            expectEvent(receipt, 'TokenAdded', {
                _tokenContract: this.tokenAddress
            });

            });
        it('should have a mapping called tokens', async function() {
            const tokenMapping = await this.mtp.tokens;
            tokenMapping.should.to.exist;
        });
        it('should add a Token struct to tokens mapping when a new token is staked', async function() {
            this.value = new BN(1);
            await this.token.approve(this.mtpAddress, this.value,{from: alice});
            await this.mtp.mtpTransfer(this.tokenAddress, bob, this.value, {from: alice});
            const newTokenStruct = await this.mtp.tokens.call(this.tokenAddress);
            const stakerCount = await newTokenStruct.number_Token_Stakers_.toNumber();
            newTokenStruct.should.own.include({token_Address_: this.tokenAddress});
            stakerCount.should.equal(2);
        });
        it('should add a Staker struct to stakers mapping when a new staker receives a token', async function() {
            this.value = new BN(1);
            await this.token.approve(this.mtpAddress, this.value,{from: alice});
            await this.mtp.mtpTransfer(this.tokenAddress, bob, this.value, {from: alice});
            const newStakerFromStruct = await this.mtp.stakers.call(alice);
            const stakerFromBalance = await newStakerFromStruct.staker_Stake_Balance_.toNumber();
            const newStakerToStruct = await this.mtp.stakers.call(bob);
            const stakerToBalance = await newStakerToStruct.staker_Stake_Balance_.toNumber();
            newStakerFromStruct.should.own.include({staker_Address_: alice});
            stakerFromBalance.should.equal(1);
            newStakerToStruct.should.own.include({staker_Address_: bob});
            stakerToBalance.should.equal(-1);        
        });
        it('should update staker balances upon new transfers', async function() {
            var account;
            this.mtp = await MTP.new();
            this.token = await TutorialToken.new(initialSupply, {from: alice});
            this.tokenAddress = await this.token.address;
            this.mtpAddress = await this.mtp.address;
            this.value = new BN(1);
            var receiverIndex = 1;
            await this.token.approve(this.mtpAddress, this.value,{from: accounts[0]});
            await this.mtp.mtpTransfer(this.tokenAddress, accounts[1], this.value, {from: accounts[0]});
            var firstStaker = await this.mtp.stakers.call(accounts[1]);
            var firstBalance = await firstStaker.staker_Stake_Balance_.toNumber();
            console.log(firstBalance);
            await this.token.approve(this.mtpAddress, this.value,{from: accounts[1]});
            await this.mtp.mtpTransfer(this.tokenAddress, accounts[2], this.value, {from: accounts[1]});
            firstStaker = await this.mtp.stakers.call(accounts[2]);
            firstBalance = await firstStaker.staker_Stake_Balance_.toNumber();
            console.log(firstBalance);
            await this.token.approve(this.mtpAddress, this.value,{from: accounts[2]});
            await this.mtp.mtpTransfer(this.tokenAddress, accounts[3], this.value, {from: accounts[2]});
            firstStaker = await this.mtp.stakers.call(accounts[3]);
            firstBalance = await firstStaker.staker_Stake_Balance_.toNumber();
            console.log(firstBalance);
            await this.token.approve(this.mtpAddress, this.value,{from: accounts[3]});
            await this.mtp.mtpTransfer(this.tokenAddress, accounts[4], this.value, {from: accounts[3]});
            firstStaker = await this.mtp.stakers.call(accounts[4]);
            firstBalance = await firstStaker.staker_Stake_Balance_.toNumber();
            console.log(firstBalance);
            await this.token.approve(this.mtpAddress, this.value,{from: accounts[4]});
            await this.mtp.mtpTransfer(this.tokenAddress, accounts[5], this.value, {from: accounts[4]});
            firstStaker = await this.mtp.stakers.call(accounts[4]);
            firstBalance = await firstStaker.staker_Stake_Balance_.toNumber();
            console.log(firstBalance);
            //const balances = [];
            //const firstStaker = await this.mtp.stakers.call(accounts[0]);
            //const firstBalance = await firstStaker.staker_Stake_Balance_.toNumber();
            const tokenFirstU = await this.mtp.tokens.call(this.tokenAddress);
            console.log(tokenFirstU);
            console.log(accounts);
            console.log(firstStaker);
            //const stakerToBalance = await newStakerToStruct.staker_Stake_Balance_.toNumber()
            // for ( account of accounts) {
            //     console.log(account);
            //     console.log(accounts[receiverIndex]);
            //     let sender = account;
            //     let receiver = await accounts[receiverIndex];
            //     await this.token.approve(this.mtpAddress, this.value,{from: sender});
            //     await this.mtp.mtpTransfer(this.tokenAddress, receiver, this.value, {from: sender});
            //     receiverIndex ++;
            // }
            //accounts.forEach(async function(account, index) {
                //this.mtp = await MTP.new();
                //this.token = await TutorialToken.new(initialSupply, {from: alice})
                //this.value = new BN(1);
                //console.log(this.token);
                //console.log(index + " - " + account)
                //await this.token.approve(this.mtpAddress, this.value,{from: account});
                //await this.mtp.mtpTransfer(this.tokenAddress, accounts[index + 1], this.value, {from: account});
            //});
        });
    });

    describe("NFT Transfers", function() {
        const nftokenId = new BN('5042');

        it("should be able to transfer an nft from sender to receiver", async function() {
            const nft = await this.nftoken.mintUniqueTokenTo(alice, nftokenId);
            let owner = await this.nftoken.ownerOf(nftokenId);
            owner.should.equal(alice);
            await this.nftoken.setApprovalForAll(this.mtpAddress, true, {from: alice});
            await this.mtp.nfMTPTransfer(this.nfTokenAddress, bob, nftokenId, {from: alice});
            let newOwner = await this.nftoken.ownerOf(nftokenId);
            newOwner.should.equal(bob);
        });
        it('should have a mapping called nftokens', async function() {
            const tokenMapping = await this.mtp.nftokens;
            tokenMapping.should.to.exist;
        });
        it('should add a Token struct to nftokens mapping when a new token is staked', async function() {
            const nft = await this.nftoken.mintUniqueTokenTo(alice, nftokenId);
            await this.nftoken.setApprovalForAll(this.mtpAddress, true, {from: alice});
            await this.mtp.nfMTPTransfer(this.nfTokenAddress, bob, nftokenId, {from: alice});
            const newTokenStruct = await this.mtp.nftokens.call(nftokenId);
            const newTokenId = newTokenStruct.token_id_.toNumber();
            newTokenId.should.equal(nftokenId.toNumber());
        });
    });

});