// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Quest.sol";
import "../ReputationSBT.sol";

contract FruitsShooterQuest1 is Quest {

    address public condition1Contract;

    constructor(
        ReputationSBT _reputationContract,
        string memory _metadataURL,
        address _condition1Contract
    ) Quest(_reputationContract, _metadataURL){
        condition1Contract = _condition1Contract;
    }

    function _questCompleted() private returns(bool) {
        bool isCompleted = true;

        // Condition 1: Score of claimer must be > 30
        (bool success, bytes memory data) = condition1Contract.call(
            abi.encodeWithSignature("getBestScore(address)", msg.sender)
        );
        require(success, "Condition 1: transaction reverted");
        if(abi.decode(data, (uint)) < 30) {
            isCompleted = false;
        } 

        return isCompleted;
    }

    function claimReward() external override {
        require(_questCompleted(), "Quest is not completed");

        // Reputation reward
        reputationContract.increaseReputationScore(msg.sender, 10);

        emit Claimed(msg.sender, true);
    }

}