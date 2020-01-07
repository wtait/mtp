const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
  } = require('@openzeppelin/test-helpers');
//const MTP = contract.fromArtifact('MTP');



require('chai')
    .use(require('chai-as-promised'))
    .should();


// describe('MTP', () => {
//     const TutorialToken = contract.fromArtifact('TutorialToken');
//     const intitialSupply = 12000;
//     const[alice, bob] = accounts;

//     beforeEach(async function() {
//         //this.mtp = await MTP.new();
//         this.token = await TutorialToken.new(intitialSupply, {from: alice})
//         //const tokenAddress = await this.token.options.address
        
//         //const mtpAddress = await this.mtp.address;
//     })

//     describe('MTP Contract', function() {
//         // it('tests begin', async function() {
//         //     const test = true
//         //     test.should.equal(true);
//         // });
//         it('should exist', async () => {
//             const name = await this.token.name();
//             name.should.equal('Tutorial Token')
//         })
//         it('should be able to  transfer sender token to another wallet', async () => {
//             let amount = new BN(500000e5);
//             await this.token.approve(mtpAddress, amount, {from: alice});
//             await this.mtp.mtpTransfer(tokenAddress, bob, amount)
//         })
//     })

// })

describe('TutorialToken', () => {
    const TutorialToken = contract.fromArtifact('TutorialToken');
    const initialSupply = 12000;
    const[sender, receiver] = accounts;

    beforeEach(async function () {
        this.token = await TutorialToken.new(initialSupply, {from: sender});
        this.value = new BN(1);
    });

    describe('token attributes', function() {
        it('has correct name', async function() {
            const address =await this.token.address;
            address.should.equal("TutorialToken");
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
        it('distributes correct amount to accounts', async function() {
            let founderBalance = await this.token.balanceOf(sender);
            founderBalance = founderBalance.toNumber()
            founderBalance.should.equal(initialSupply);
        })
    });
});


// describe('TutorialToken', () => {
//     const TutorialToken = contract.fromArtifact('TutorialToken');
//     const initialSupply = 12000;

//     beforeEach(async function() {
//         this.token = await TutorialToken.new(initialSupply);
//     })

//     describe('token attributes', function() {
//         it('tests begin', async function() {
//             const test = true
//             test.should.equal(true);
//         });
//         it('has correct name', async function() {
//             const name = await this.token.name();
//             name.should.equal("TutorialToken");
//         });
//         it('has correct symbol', async function() {
//             const symbol = await this.token.symbol();
//             symbol.should.equal("TT");
//         });
//         it('has correct decimals', async function() {
//             let decimals = await this.token.decimals()
//             decimals = decimals.toNumber();
//             decimals.should.be.equal(18);
//         });
//         it('has correct intitialSupply', async function() {
//             let totalSupply = await this.token.totalSupply()
//             totalSupply = totalSupply.toNumber();
//             totalSupply.should.be.equal(initialSupply);
//         });
//     })

// })






    // describe('TutorialToken', () => {
    //     const initialSupply = 12000;
    //     //const[sender, receiver] = accounts;
    
    //     beforeEach(async function () {
    //         this.token = await TutorialToken.new(initialSupply);
    //         // this.value = new BN(1);
    //     });
    
    //     describe('token attributes', function() {
    //         it('has correct name', async function() {
    //             const name = await this.token.name();
    //             name.should.equal("TutorialToken");
    //         });
    //         it('has correct symbol', async function() {
    //             const symbol = await this.token.symbol();
    //             symbol.should.equal("TT");
    //         });
    //         it('has correct decimals', async function() {
    //             let decimals = await this.token.decimals()
    //             decimals = decimals.toNumber();
    //             decimals.should.be.equal(18);
    //         });
    //         it('has correct intitialSupply', async function() {
    //             let totalSupply = await this.token.totalSupply()
    //             totalSupply = totalSupply.toNumber();
    //             totalSupply.should.be.equal(initialSupply);
    //         });
    //     });
    
    //     // describe('token transfers', function() {
    //     //     it('reverts when transferring tokens to the zero address', async function () {
    //     //         await expectRevert(
    //     //             this.token.transfer(constants.ZERO_ADDRESS, this.value, {from: sender }),
    //     //             'ERC20: transfer to the zero address',
    //     //         );
    //     //     });
    //     // });
    // });