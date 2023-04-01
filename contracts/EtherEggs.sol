pragma solidity ^0.8.9;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract EtherEggs is ERC721 {
  // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // Hashes of easter egg location coordinate pairs
  bytes32[] public coordinateHashes;

  // Hints corresponding to coordinateHashes
  string[] public hints;

  // Mapping containing coordinates which were found
  mapping(bytes32 => bool) public claimedHashes;

  // Optional mapping for token URIs
  mapping (uint256 => string) private _tokenURIs;

  // We need to pass the name of our NFTs token and its symbol.
  constructor(
    bytes32[] memory _coordinateHashes,
    string[] memory _hints
  ) ERC721 ("EtherEggs", "ETHEGG") {
    coordinateHashes = _coordinateHashes;
    hints = _hints;
  }

  // A function our user will hit to get their NFT.
  function mintEtherEgg(uint256 lat, uint256 lon, uint index, string memory _tokenURI) external {
    bytes32 coordinateHash = coordinateHashes[index];
    require(
      claimedHashes[coordinateHash] != true,
      "This egg has been found."
    );
    require(
      keccak256(abi.encode(lat, lon)) == coordinateHash,
      "You did not find the egg."
    );

    // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();

     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);
    
    // Return the NFT's metadata
    _setTokenURI(newItemId, _tokenURI);

    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();

    // Set the egg as claimed
    claimedHashes[coordinateHash] = true;
  }

  // Set the NFT's metadata
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_exists(_tokenId));
    return _tokenURIs[_tokenId];
  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }

  function getCoordinateHashes() public view returns (bytes32[] memory) {
    return coordinateHashes;
  }

  function getHints() public view returns (string[] memory) {
    return hints;
  }

  function totalSupply() public view returns(uint256) {
    return _tokenIds.current();
  }
}