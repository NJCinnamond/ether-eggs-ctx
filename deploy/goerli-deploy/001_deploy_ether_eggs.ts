import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    const positions = [
        [42.346676, -71.097221], // Fenway Park
        [42.356202, -71.063116], // Brewer Fountain
        [42.376351, -71.060775], // Bunker Hill Monument
        [42.372641, -71.056414], // USS Constitution
        [42.374652, -71.118551], // Harvard Yard
    ]

    const hints = [
        "Home of the 2018 World Series champs",
        "A gift to the city by Gardner Brewer",
        "It is the first obelisk in the US",
        "President Washington named it himself",
        "Gateway to the historic centre of Harvard campus"
    ]

    const transformPosition = (pos: number) => Math.round((pos+90)*1000);

    const coordinateHashes = positions.map((position) => {
        return ethers.utils.solidityKeccak256(["uint256", "uint256"],[ transformPosition(position[0]), transformPosition(position[1])])
    });

    console.log("coordinateHashes: ", coordinateHashes);

    /*await deploy('EtherEggs', {
        from: deployer,
        args: [
            coordinateHashes,
            hints
        ],
        log: true,
        autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });*/
};
module.exports = func;
func.tags = ['EtherEggs'];