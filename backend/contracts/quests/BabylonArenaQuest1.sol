// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../IQuest.sol";
import "../ReputationSBT.sol";

contract BabylonArenaQuest1 is IQuest {

    mapping(address => bool) public completedBy;
    ReputationSBT reputationContract;

    address public condition1Contract;
    
    event Claimed(address caller, bool completed);

    constructor(ReputationSBT _reputationContract, address _condition1Contract) {
        reputationContract = _reputationContract;
        condition1Contract = _condition1Contract;
    }

    function _questCompleted() private returns(bool) {
        bool isCompleted = true;

        // Condition 1: Address must own "Elven" Helmet, Armor, Gauntlets, Sword and Shield
        (bool success, bytes memory data) = condition1Contract.call(
            abi.encodeWithSignature("balanceOf(address,uint256)", msg.sender, 1)
        );
        require(success, "Condition 1: transaction reverted");
        if(abi.decode(data, (uint)) == 0) {
            isCompleted = false;
        } 

        return isCompleted;
    }

    function claimReward() external override {
        require(_questCompleted(), "Quest is not completed");

        // Reputation reward
        reputationContract.increaseReputationScore(msg.sender, 10);

        // Additional reward 1: Elf Warrior Title NFT
        // TODO create a NFT, allow this contract to mint and mint NFT to msg.sender here

        emit Claimed(msg.sender, true);
    }

}