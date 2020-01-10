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
            founderBalance = founderBalance.toNumber()
            founderBalance.should.equal(initialSupply);
        });
        it('should be able to  transfer sender token to another wallet', async function() {
            this.value = new BN(1);
            await this.token.approve(this.mtpAddress, this.value,{from: alice});
            await this.mtp.mtpTransfer(this.tokenAddress, bob, this.value, {from: alice})
            let balance = ((await  this.token.balanceOf(bob)).toString());
            balance.should.equal(this.value.toString())
        });
    });

})