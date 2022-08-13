// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ggProfiles.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title ggQuest
 * @author h0tmilk
 * @notice ggQuest is deployed by ggQuests
 */
contract ggQuest {

    enum RewardType { ERC20, ERC721, ERC1155 }

    struct Reward {
        RewardType rewardType;
        address rewardContract; // The ERC20 contract for example
        uint tokenAmount;
        uint amount; // Number of rewards available
        uint id; // optional (if ERC1155 for example)
    }

    string public metadataURL;
    uint reputationReward;
    bool public isActive;
    bool public lockedRewards;

    address[] public completedBy;
    mapping(address => bool) public operators;
    Reward[] public additionalRewards;

    constructor(string memory _metadataURL, uint _reputationReward) {
        metadataURL = _metadataURL;
        reputationReward = _reputationReward;
        operators[msg.sender] = true;
    }

    event AddOperator(address _operator);
    event RemoveOperator(address _operator);
    event AddReward(Reward reward);
    event SendReward(address player, Reward reward);
    event UpdateReputationReward(uint);
    event ActivateQuest();
    event DeactivateQuest(address _withdrawAddress);

    // Operators --------------------------------------------

    /**
    * @notice Add operator
    * @param _operator address of the new operator
    **/
    function addOperator(address _operator) external onlyOperator{
        require(operators[msg.sender], "Only operators can manage operators");
        operators[_operator] = true;
        emit AddOperator(_operator);
    }

    /**
    * @notice Remove operator
    * @param _operator address of the operator to remove
    **/
    function removeOperator(address _operator) external onlyOperator{
        delete operators[_operator];
        emit RemoveOperator(_operator);
    }

    function isOperator(address _address) external view returns(bool) {
        return operators[_address];
    }

    /**
    * @notice Add additional reward to quest
    * @param _reward reward struct to add
    * @return rewardID
    **/
    function addReward(Reward memory _reward) external onlyOperator returns (uint){
        // Verify if rewards are unique (not twice the same ERC721 for example)
        for (uint256 i = 0; i < additionalRewards.length; i++) {
            require(_rewardHash(_reward) != _rewardHash(additionalRewards[i]), "Token contract already used in another reward of the quest");
        }

        // Verify if the quest contract owns enough tokens to distribute the reward
        if(_reward.rewardType == RewardType.ERC20) {
            ERC20 token = ERC20(_reward.rewardContract);
            require(token.balanceOf(address(this)) >= _reward.tokenAmount * _reward.amount, 
                "ggQuest contract doesn't own enough tokens");
        } else if(_reward.rewardType == RewardType.ERC721) {
            ERC721 token = ERC721(_reward.rewardContract);
            require(token.ownerOf(_reward.id) == address(this), "ggQuests contract doesn't own this ERC721 token");
            require(_reward.tokenAmount == 1 && _reward.amount == 1, "tokenAmount and amount should be 1 as ERC721 is unique");

        } else if(_reward.rewardType == RewardType.ERC1155) {
            ERC1155 token = ERC1155(_reward.rewardContract);
            require(token.balanceOf(address(this), _reward.id) >= _reward.tokenAmount * _reward.amount, 
                "ggQuests contract doesn't own enough tokens");
        }

        // Add reward to quest
        additionalRewards.push(_reward);
        emit AddReward(_reward);

        return additionalRewards.length-1;
    }

    function getRewards() external view returns (Reward[] memory) {
        return additionalRewards;
    }

    /**
    * @notice Send rewards to a player for completing the quest
    * @param _player player to add
    **/
    function sendReward(address _player) external onlyOperator {
        Reward memory reward;
        for (uint256 i = 0; i < additionalRewards.length; i++) {
            reward = additionalRewards[i];
            if(reward.amount <= completedBy.length) {
                if(reward.rewardType == RewardType.ERC20) {
                    ERC20 token = ERC20(reward.rewardContract);
                    token.transfer(_player, reward.tokenAmount);
                } else if(reward.rewardType == RewardType.ERC721) {
                    ERC721 token = ERC721(reward.rewardContract);
                    token.safeTransferFrom(address(this), _player, reward.id);
                } else if(reward.rewardType == RewardType.ERC1155) {
                    ERC1155 token = ERC1155(reward.rewardContract);
                    token.safeTransferFrom(address(this), _player, reward.id, 
                    reward.tokenAmount, "");
                }
            }
        }
        completedBy.push(_player);
        emit SendReward(_player, reward);
    }

    /**
    * @notice Update the reputation reward rate of the quest
    * @param _newValue new reputation added to profile when quest is completed
    **/
    function updateReputationReward(uint _newValue) external onlyOperator {
        reputationReward = _newValue;
        emit UpdateReputationReward(_newValue);
    }

    /**
    * @notice Activate the quest once all rewards have been set
    * @dev REWARDS CANNOT BE MODIFIED AFTER ACTIVATION - IRREVESIBLE
    **/
    function activateQuest() external onlyOperator {
        isActive = true;
        lockedRewards = true;
        emit ActivateQuest();
    }

    /**
    * @notice Deactivate the quest (irreversible)
    * @param _withrawalAddress address to which send all remaining rewards
    **/
    function deactivateQuest(address _withrawalAddress) external onlyOperator {
        isActive = false;
        // Transfer all tokens
        for (uint256 i = 0; i < additionalRewards.length; i++) {
            _withdrawReward(i, _withrawalAddress);
        }
        emit DeactivateQuest(_withrawalAddress);
    }


    function getQuestURI() external view returns(string memory) {
        return metadataURL;
    }

    /**
    * @notice Gives a hash of the reward content
    * @dev Useful to avoid multiple rewards with the same token address for example
    * @param _reward reward to hash
    **/
    function _rewardHash(Reward memory _reward) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_reward.rewardContract, _reward.id));
    }

    /**
    * @notice Transfer all the remaining tokens of a reward to the given address
    * @param _rewardID reward to hash
    * @param _withrawalAddress address for the transfer
    **/
    function _withdrawReward(uint _rewardID, address _withrawalAddress) private {
        if(additionalRewards[_rewardID].rewardType == RewardType.ERC20) {
            ERC20 token = ERC20(additionalRewards[_rewardID].rewardContract);
            token.transfer(_withrawalAddress, token.balanceOf(address(this)));
        } else if(additionalRewards[_rewardID].rewardType == RewardType.ERC721) {
            ERC721 token = ERC721(additionalRewards[_rewardID].rewardContract);
            token.safeTransferFrom(address(this), _withrawalAddress, additionalRewards[_rewardID].id);
        } else if(additionalRewards[_rewardID].rewardType == RewardType.ERC1155) {
            ERC1155 token = ERC1155(additionalRewards[_rewardID].rewardContract);
            token.safeTransferFrom(address(this), _withrawalAddress, additionalRewards[_rewardID].id, 
                token.balanceOf(address(this), additionalRewards[_rewardID].id), "");
        }
    }

    modifier onlyOperator() {
        require(operators[msg.sender], "Only quest operators can call this function");
        _;
    }
}