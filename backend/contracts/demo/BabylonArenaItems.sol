// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Dumb contract for demo

contract BabylonArenaItems is ERC1155 {
    uint256 public constant ElvenHelmet = 1;
    uint256 public constant ElvenArmor = 2;
    uint256 public constant ElvenGauntlets = 3;
    uint256 public constant ElvenSword = 4;
    uint256 public constant ElvenShield = 5;

    constructor() ERC1155("https://ipfs.io/ipfs/QmWKwDaqMBVk2AfVv5jbuYP5cPSAcRUmjHweibZkiLdS58/") {
        _mint(msg.sender, ElvenHelmet, 1, "");
        _mint(msg.sender, ElvenArmor, 1, "");
        _mint(msg.sender, ElvenGauntlets, 1, "");
        _mint(msg.sender, ElvenSword, 1, "");
        _mint(msg.sender, ElvenShield, 1, "");
    }

    function giveAllItems(address _destination) public {
        _mint(_destination, ElvenHelmet, 1, "");
        _mint(_destination, ElvenArmor, 1, "");
        _mint(_destination, ElvenGauntlets, 1, "");
        _mint(_destination, ElvenSword, 1, "");
        _mint(_destination, ElvenShield, 1, "");
    }

    function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/QmWKwDaqMBVk2AfVv5jbuYP5cPSAcRUmjHweibZkiLdS58/",
                Strings.toString(_tokenid),".json"
            )
        );
    }
}