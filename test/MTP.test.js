const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
  } = require('@openzeppelin/test-helpers');





require('chai')
    .use(require('chai-as-promised'))
    .should();


describe('MTP', () => {

    const MTP = contract.fromArtifact('MTP');
    const TutorialToken = contract.fromArtifact('TutorialToken');
    const initialSupply = 12000;
    const[alice, bob] = accounts;

    beforeEach(async function() {
        this.mtp = await MTP.new();
        this.token = await TutorialToken.new(initialSupply, {from: alice});
    });

    describe('MTP Contract', function() {
        // it('tests begin', function() {
        //     const test = typeof(this.mtp);
        //     test.should.equal('object');
        // });
        it('distributes correct amount to accounts', async function() {
            //this.token = await TutorialToken.new(initialSupply);
            //let tokenAddress = this.token.address;
            //let amount = new BN(1);
            let founderBalance = await this.token.balanceOf(alice);
            founderBalance = founderBalance.toNumber()
            founderBalance.should.equal(initialSupply);
        })
        it('should be able to  transfer sender token to another wallet', async () => {
            const[alice, bob] = accounts;
            this.mtp = await MTP.new();
            this.token = await TutorialToken.new(initialSupply, {from: alice});
            let tokenAddress = await this.token.address;
            let mtpAddress = await this.mtp.address;
            console.log(mtpAddress, alice);
            this.value = new BN(1);
            //console.log(amount)
            await this.token.approve(mtpAddress, this.value,{from: alice});
            //await this.token.approve(mtpAddress, amount, {from: alice});
            await this.mtp.mtpTransfer(tokenAddress, bob, this.value, {from: alice})
            let balance = ((await  this.token.balanceOf(bob)).toString());
            balance.should.equal(this.value.toString())
        })
    })

})