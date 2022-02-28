# micro-dex
_Speedrunning_ solidity.

This is just a hello world project (for solidity / ETH ecosystem) that is based off the following articles 
- https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c
- https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90

I used Remix as IDE, it had some flaws, but nice for someone trying to get into solidity.

**Code should only be used for educational reasons, and not be put in production, or deployed on the blockchain.**

### Todo
- [x] Try to get tests working
    - Remix-tests is "wack", it does not find OpenZeppelin without direct path and has unhelpful error messages. Try something else like  
        - [ ] trufflesuite
        - [ ] hardhat
    - [ ] write tests for the contract

- [ ] Fuzz the contract
    - [ ] https://github.com/crytic/echidna

- [ ] Run automated static analysis
    - [x] https://github.com/crytic/slither

- [ ] Complete the implementation.

