const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
  } = require('@openzeppelin/test-helpers');
const TutorialToken = contract.fromArtifact('TutorialToken');


require('chai')
    .use(require('chai-as-promised'))
    .should();


describe('TutorialToken', () => {
    const initialSupply = 12000;
    //const[sender, receiver] = accounts;

    beforeEach(async function () {
        this.token = await TutorialToken.new(initialSupply);
        // this.value = new BN(1);
    });

    describe('token attributes', function() {
        it('has correct name', async function() {
            const name = await this.token.name();
            name.should.equal("TutorialToken");
        });
        it('has correct symbol', async function() {
            const symbol = await this.token.symbol();
            symbol.should.equal("TT");
        });
        it('has correct decimals', async function() {
            let decimals = await this.token.decimals()
            decimals = decimals.toNumber();
            decimals.should.be.equal(18);
        });
        it('has correct intitialSupply', async function() {
            let totalSupply = await this.token.totalSupply()
            totalSupply = totalSupply.toNumber();
            totalSupply.should.be.equal(initialSupply);
        });
    });

    // describe('token transfers', function() {
    //     it('reverts when transferring tokens to the zero address', async function () {
    //         await expectRevert(
    //             this.token.transfer(constants.ZERO_ADDRESS, this.value, {from: sender }),
    //             'ERC20: transfer to the zero address',
    //         );
    //     });
    // });
});
