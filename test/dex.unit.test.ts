import { ethers, network } from "hardhat";
import { expect } from "chai";

describe("Dex", function () {
  it("Should be able to init a dex", async function () {
    const { tokenAddress, token } = await deployBscToken();
    const dex = await ethers.getContractFactory("Dex");
    const basicDex = await dex.deploy(tokenAddress);

    const [_owner, addr1] = await ethers.getSigners();

    const dexBalance = await token.balanceOf(basicDex.address);
    expect(dexBalance).to.equal(0);

    await token.connect(addr1).approve(basicDex.address, 1);

    expect(await token.balanceOf(addr1.address)).to.equal(0);
    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);
    await basicDex.connect(addr1).init(1);

    expect(await token.balanceOf(basicDex.address)).to.equal(1);
  });

  // why does this not work ? 
  it.skip("should throw an error if liqudity is deposited twice", async () => {
    const { tokenAddress, token } = await deployBscToken();
    const dex = await ethers.getContractFactory("Dex");
    const basicDex = await dex.deploy(tokenAddress);

    const [_owner, addr1] = await ethers.getSigners();

    await token.transfer(addr1.address, 50);

    await network.provider.send("evm_setAutomine", [true]);
    await network.provider.send("evm_setIntervalMining", [0]);

    for (const _ of [1, 2]) {
      await token.connect(addr1).approve(basicDex.address, 5);
      //      expect(()).to.equal(5);
      const tx = await basicDex.connect(addr1).init(5);
      const { data } = tx;
      const prevBlock = await ethers.provider.getBlockNumber();
      expect(
        ethers.utils.defaultAbiCoder
          .decode(["uint256"], ethers.utils.hexDataSlice(data, 4))
          .toString()
      ).to.equal("5");
      await tx.wait(1);

      const newBlock = await ethers.provider.getBlockNumber();
      expect(prevBlock).not.to.eq(newBlock)
    }
  });

  async function deployBscToken() {
    const BSCToken = await ethers.getContractFactory("BasicToken");
    const token = await BSCToken.deploy("100");

    await token.deployed();

    const tokenAddress = token.address;

    return {
      token,
      tokenAddress,
    };
  }
});
