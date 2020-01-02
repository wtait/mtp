const TutorialToken = artifacts.require('TutorialToken');

require('chai')
    .use(require('chai-as-promised'))
    .should();


contract('TutorialToken', accounts => {
    const initialSupply = 12000;

    beforeEach( async function () {
        this.token = await TutorialToken.new(initialSupply);
    })

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
    })
})
