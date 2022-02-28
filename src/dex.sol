// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/token/ERC20/IERC20.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Dex {
    using SafeMath for uint256;
    IERC20 token;

    uint256 public totalLiquidity;
    mapping (address => uint256) public liquidity;

    constructor (address token_addr) {
        token = IERC20(token_addr);
    }

    function init(uint256 tokens) public payable returns (uint256) {
        require(totalLiquidity == 0, "There is no need for liqudity");
        totalLiquidity = address(this).balance;
        liquidity[msg.sender] = totalLiquidity;
        require(token.transferFrom(msg.sender, address(this), tokens));
        return totalLiquidity;
    }

    function price(uint256 deposit, uint256 reserves, uint256 adjutedReserves) public view returns (uint256) {
        // Uses the famous Uniswap v1 formula
        //  x * y = k
        uint256 fee = 3;
        // calcualte both sides with 1000 because soldity does not support floating points
        uint256 adjustedDeposit = deposit.mul(1000 - fee);
        uint256 y = reserves.mul(1000).add(adjustedDeposit);
        uint256 x = adjustedDeposit.mul(adjutedReserves);
        return x / y;
    }

    function ethToToken() public payable returns (uint256) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 eth = msg.value;
        uint256 ethAdjustments = address(this).balance.sub(msg.value);
        uint256 tokensBougth = price(
            eth,
            ethAdjustments,
            tokenReserve
        );
        require(token.transfer(msg.sender, tokensBougth));
        return tokensBougth;
    }
}

