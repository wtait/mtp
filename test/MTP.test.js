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
    const NFTContract = contract.fromArtifact('TestNFT');
    const initialSupply = 12000;
    const[alice, bob] = accounts;

    beforeEach(async function() {
        this.mtp = await MTP.new();
        this.token = await TutorialToken.new(initialSupply, {from: alice});
        this.tokenAddress = await this.token.address;
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
            //console.log(tokenFirstU);
            //console.log(accounts);
            //console.log(firstStaker);
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

    beforeEach(async function() {
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
        it('should update staker balances upon new transfers',async function() {
            let stakeChains = [];
            let tokenBeforeTransfer = await this.mtp.nftokens.call(this.nftokenId);
            for(i = 0; i < accounts.length - 1; i++) {
                let sender = accounts[i];
                let receiver = accounts[i + 1];
                //let tokenBeforeTransfer = await this.mtp.nftokens.call(this.nftokenId);
                let numStakers = tokenBeforeTransfer.number_Token_Stakers_.toNumber();
                let tokenBiboBal = tokenBeforeTransfer.token_Stake_Balance_.toNumber();
                //let senderBalance = await this.mtp.stakers.call(sender);
                //let receiverBalance = await this.mtp.stakers.call(receiver);
                //console.log(senderBalance);
                //console.log("number of stakers before transfer = " + numStakers + ", token Bibo balance = " + tokenBiboBal + " sender balance: " + senderBalance.staker_Stake_Balance_ + " receiver balance: " + receiverBalance.staker_Stake_Balance_);
                await this.nftokenContract.setApprovalForAll(this.mtpAddress, true, {from: sender});
                await this.mtp.nfMTPTransfer(this.nfTokenAddress, receiver, this.nftokenId, {from: sender});
                let tokenAfterTransfer = await this.mtp.nftokens.call(this.nftokenId);
                numStakers = tokenAfterTransfer.number_Token_Stakers_.toNumber();
                tokenBiboBal = tokenAfterTransfer.token_Stake_Balance_.toNumber();
                let stakeChain = [];
                let tokenAccount = {"tokenID": null, "tokenBalance": tokenBiboBal};
                tokenAccount.tokenID = this.nftokenId;
                stakeChain.push(tokenAccount);
                let n = 0;
                while(n < numStakers) {
                    let currentStakerAddress = accounts[n];
                    let currentStakerAccount = await this.mtp.stakers.call(currentStakerAddress);
                    stakeChain.push({"stakerAddress": currentStakerAddress, "stakerBalance": currentStakerAccount.staker_Stake_Balance_.toNumber()});
                    n++;
                }
                stakeChains.push(stakeChain);
                //console.log("number of stakers after transfer = " + numStakers + ", token Bibo balance = " + tokenBiboBal);
            }
            console.log(stakeChains);
            // let biboBalances = [];
            // //let tokenState = await this.mtp.nftokens.call(this.nftokenId);
            // //console.log(tokenState);
            // for(i = 0; i < accounts.length; i++) {
            //     let stakerAddress = accounts[i];
            //     let staker = await this.mtp.stakers.call(stakerAddress);
            //     let biboBalance = staker.staker_Stake_Balance_.toNumber();
            //     biboBalances.push({"address": stakerAddress, 'biboBalance' : biboBalance });
            // }
            // console.log("final balances : ", biboBalances);
            // let totalSupply = biboBalances.reduce(function(supply, stakerBalance) {
            //     return supply + stakerBalance.biboBalance;
            // }, 0);
            // console.log(totalSupply);
            // firstStaker = await this.mtp.stakers.call(accounts[0]);
            // firstBalance = await firstStaker.staker_Stake_Balance_.toNumber();
            // console.log(firstBalance);
        });
    });

});