# Ether Eggs Contracts

This repo contains the contract code for the Ether Eggs project, a Harvard Blockchain Conference 2023 Hackathon submission.

The contract UI code can be found at https://github.com/NJCinnamond/ether-eggs-ui

## EtherEggs.sol

EtherEggs.sol defines an ERC721 contract to handle Ether Egg NFT minting. The contract is initialized with two variables. The first is an array of bytes32 data called coordinateHashes, which correspond to the keccack256 hashes of the latitude and longitude locations of eggs that should be discovered by users to enable minting. The second constructor argument is an array of string data, hints, which correspond to human-readable strings hinting to users as to where the eggs lie. It is expected that the length of both arguments is the same, such that the egg at coordinateHashes[n] can be found by the following the hint at hints[n].

# Minting

To mint an egg, the mintEtherEgg function is called. This function takes four arguments
- latitude of the egg location guess
- longitude of the egg location guess
- index indicating which egg the caller is trying to mint. This can be understood as index == n indicates the caller believes the (lat,lon) argument pair corresponds to coordinateHashes[n]
- _tokenURI is the URI string for the token metadata.

mintEtherEgg calculates the hash of the provided latitude and longitude pair and asserts that it is equal to coordinateHashes[n]. If it does, it mints the EtherEgg and transfer it to the user, before incrementing the token count. We keep a mapping claimedHashes such that claimedHashes[hash] returns true for hashes that have already been claimed, ensuring each egg can only be minted once.

## Deploying Contracts

We can deploy using

```bash
npm thirdweb deploy
```
