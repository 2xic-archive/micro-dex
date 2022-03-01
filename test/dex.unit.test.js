const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dex", function () {
  it("Should be able to init a dex", async function () {
    const BSCToken = await hre.ethers.getContractFactory("BasicToken");
    const token = await BSCToken.deploy('100');

    await token.deployed();

    const tokenAddress = token.address;
    const dex = await ethers.getContractFactory("Dex");
    const basicDex = await dex.deploy(tokenAddress);

    const [_owner, addr1] = await ethers.getSigners();

    const dexBalance = await token.balanceOf(basicDex.address);
    expect(dexBalance).to.equal(0);

    await token.connect(addr1).approve(basicDex.address, 1);
    
    expect((await token.balanceOf(addr1.address))).to.equal(0);
    await token.transfer(addr1.address, 50);
    expect((await token.balanceOf(addr1.address))).to.equal(50);
    await basicDex.connect(addr1).init(1);

    expect((await token.balanceOf(basicDex.address))).to.equal(1);
  });
});
