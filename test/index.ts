import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("EasterEggs", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEasterEggs() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const coordinateHashes = [
      ethers.utils.solidityKeccak256(["uint256", "uint256"],[ 13078, 16050 ]),
      ethers.utils.solidityKeccak256(["uint256", "uint256"],[ 20475, 19355 ]),
      ethers.utils.solidityKeccak256(["uint256", "uint256"],[ 95773, 45853 ])
    ];
    console.log("Coordinate hashes");

    const EtherEggsFactory = await ethers.getContractFactory("EtherEggs");
    const etherEggs = await EtherEggsFactory.deploy(coordinateHashes);
    await etherEggs.deployed();

    return { etherEggs, owner, otherAccount };
  }

  describe("EasterEggs", function () {
    it("Should not claim NFT with bad location", async function () {
      const { etherEggs, owner, otherAccount } = await loadFixture(deployEasterEggs);

      // Call deposit
      await expect(etherEggs.connect(otherAccount).mintEtherEgg(
        13079,
        16050,
        0,
        ""
      )).to.be.revertedWith("You did not find the egg.");

      const hash = ethers.utils.solidityKeccak256(["uint256", "uint256"],[ 13078, 16050 ]);
      expect(await(etherEggs.callStatic.claimedHashes(hash))).to.equal(false);
    });
    it("Should claim NFT with good location", async function () {
      const { etherEggs, owner, otherAccount } = await loadFixture(deployEasterEggs);

      const tokenURI = "myURL";

      // Call deposit
      await etherEggs.connect(otherAccount).mintEtherEgg(
        13078,
        16050,
        0,
        tokenURI
      );

      const hash = ethers.utils.solidityKeccak256(["uint256", "uint256"],[ 13078, 16050 ]);

      expect(await(etherEggs.callStatic.claimedHashes(hash))).to.equal(true);
      expect(await(etherEggs.callStatic.tokenURI(0))).to.equal(tokenURI);
    });
  });
});
