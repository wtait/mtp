Measured Transfer Protocol (mtp) for transaction mediated value
-Wade Tait 2019
-inspired by Marc Gauvin's BIBO Currency Standard: bibocurrency.com

Description:
Users can deposit items, hereafter referred to as "tokens" (i.e. erc20, erc271, ifps files, etc.), using the MTP protocol for transfer staking. Transfer staking allows any other protocol user to take possession of tokens free of charge and without payment to sender,
although network transaction fees may still be required unless using a gas-free or meta-transaction implementation. An internal unit of measure, here referred to as a "BIBO", is then used to record the circulation of tokens amongst MTP users and to mediate token deposits, withdrawals, and transfer pauses.

The most primitive requirement of the MTP protocol is to preserve a time ordered mapping of each transferable item to it's users. This mapping is represented here as a series of transfer lists, or 'stake chains', where a new ordered list is generated for every new receiver of the token. Thus if Alice stakes token "A" and transfers it to Bob we have a stake chain for "A" consisting of:

[{Alice},{Bob}]

If token "A" is subsequently transferred to Charles and David we would have the following stake Chains:

[{Alice}, {Bob}],
[{Alice}, {Bob}, {Charles}],
[{Alice}, {Bob}, {Charles}, {David}]


BIBO is a term borrowed from control systems engineering and is short for "Bounded Input Bounded Output". BIBOs use signed integers for notation and are a measure of each users relative position in the history of transfers from original depositor to the current user. For each new token transfer, a measurement is applied to each account and is equal to:  (number of users after) - (number of users before). We also introduce the notion of including the transferring item as party to the measurement and place it at the root of the transfer chain. 
Thus if measurement is applied to the previous transfer space we arrive at the following account balances:


                        [{token: 0}]
    token deposited     [{token: 1}, {alice: -1}]
    1st transfer        [{token: 2}, {alice: 0}, {bob: -2}]
    2nd transfer        [{token: 3}, {alice: 1}, {bob: -1}, {charles: -3}]

    balances:        token: 6    Alice: 0    Bob: -3    Charles: -3


BIBOs are not transferrable themselves and are not limited or made scarce by any limit on supply. however, as evident above, the sum total of all balances must necessarily equal 0 at all times. This system requirement means that 

TODO: fungible versus non-fungible transfers

TODO: the stake queue and transfer pausing 

TODO: withdrawal and stake burning


FAQs

why measure transfers? 
    economic transactions can be organized into three basic categories: 
        1) atomic (direct exchange/barter): a two way transaction of like valued goods between two parties. One set of goods
        is transferred from one party to another in exchange in return for a second set of goods.
            pros: reciprocation is instant and values are assessed directly by the parties to the transaction.
            cons: requires equivalence of value between both sets of transferring items. thus the number of possible economic interactions is limited by the number of possible pairs of equivalently valued goods.
            requires settlement of physical goods.
        2) mediated(money): a two way transaction of, on one side goods, and on the other currency. 
            pros: allows for exchange of disparate values; can be implemented as either centralized or decentralized 
            cons: instability. reciprocity enforced by collateralized assets. susceptible to monopolization. 
        3) measured (token-less): one way transaction/transfer. one party transfers goods to another with no return goods required. all transactions are measured and reciprocity ensured systematically via protocol
            pros: no counterparty inputs required. no artificial limits to the number of possible transactions.
            cons: requires a ledger capable of indexing 

    defining a self-consistent measure precludes the requirement of measurement via 
    comparison. transacting may be the most universal representation of value. With transfer backed value,
    measurement happens at the point of valuation and units do not exist independently or 
    a priori to measurement. Reciprocity can be guaranteed by protocol requirements which necessitate the broad distribution of tokens amongst accounts.
    This increased distribution of valued assets in turn increases the creation of
    new synthetic assets which then become transferrable themselves.

why passive/bibo?
    stability. stability increases liquidity by assuring consistent
    value comparison. traditional money systems are inherently instable and require
    careful management based on complex indicators to achieve stability. mtp is
    fundamentally stable by design. stability is insured via protocol 
    rather than ab extra management. scalars are mathematically defined and thus value measurements
    can be calculated deterministically.




corollaries:

-alternative to scarcity dependent value systems; value is derived only from the broad distribution of transferrable items.

-as there are no artificial limits on transactions, mtp enabled assets are transferred at much higher rates and across a 
much greater set of accounts than non mtp enabled counterparts.
-highly efficient distribution and utilization of assets. Valuable tokens have little to no downtime in usage.
-price independent measure of value and stable asset peg.




roadmap:

+fungible transfers:
protocol supports fungible token transfers

+Feeless transactions: 
mtp receivers are not required to have eth as transaction fees are deferred until item withdrawal at which time 
1) if item is fungible (i.e. erc20 tokens) fees can be paid for directly from withdrawn tokens
2) if item is non-fungible or more tokens are required; withdrawing user is required to deposit more tokens for staking
note; transaction fee payment must occur 'ab extra' to mtp measurements as otherwise could result 
in a leak of staked tokens and loss of passivity.

+instant transfers:
transactions are instant due to sidechain or other implementation


+composition/decomposition:
transferable items can be composed into multi-component objects and transferred as new synthetic items.


+protocol is cross-chain compatible


+protocol is chain agnostic