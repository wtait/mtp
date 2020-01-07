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
        this.token = await TutorialToken.new(initialSupply);
    });

    describe('MTP Contract', function() {
        // it('tests begin', function() {
        //     const test = typeof(this.mtp);
        //     test.should.equal('object');
        // });
        it('should be able to  transfer sender token to another wallet', async () => {
            this.mtp = await MTP.new();
            this.token = await TutorialToken.new(initialSupply);
            let tokenAddress = this.token.address;
            let amount = 1;
            console.log(tokenAddress);
            //await this.token.approve(mtpAddress, amount, {from: alice});
            await this.mtp.mtpTransfer(tokenAddress, bob, amount, {from: alice})
            let balance = ((await  token.balanceOf(bob)).toString());
            balance.should.equal(amount.toString())
        })
    })

})