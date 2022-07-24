// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ReputationSBT.sol";

abstract contract Quest {

    mapping(address => bool) public completedBy;
    ReputationSBT public reputationContract;
    string public metadataURL;

    event Claimed(address caller, bool completed);

    constructor(
        ReputationSBT _reputationContract,
        string memory _metadataURL
    ) {
        reputationContract = _reputationContract;
        metadataURL = _metadataURL;
    }

    function getMetadata() external view returns(string memory) {
        return metadataURL;
    }

    function hasCompletedQuest(address _player) external view returns(bool) {
        return completedBy[_player];
    }

    function claimReward() external virtual;

}