// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ggProfiles.sol";
import "./ggStructs.sol";

/**
 * @title ggQUests
 * @author h0tmilk
 * @notice ggQuests are challenges for players. They are linked to web3 games and allow to 
 * win rewards and increase ggProfile reputation
 */
contract ggQuests {

    mapping(address => bool) public operators;

    // Players' profiles
    ggProfiles private profiles;
    ggStructs.Game[] private games;
    ggStructs.GameStudio[] private gameStudios;
    ggStructs.Quest[] private quests;
    mapping(address => uint[]) private completedQuests; // profile => list of questIDs
    mapping(uint => mapping(address => bool)) private questsCompletedBy; // questID => address => bool completed

    constructor(ggProfiles _ggProfiles) {
        profiles = _ggProfiles;
        operators[msg.sender] = true;
    }

    // Operators --------------------------------------------

    event AddOperator(address _operator);
    event RemoveOperator(address _operator);

    /**
    * @notice Add operator
    * @param _operator address of the new operator
    **/
    function addOperator(address _operator) external {
        require(operators[msg.sender], "Only operators can manage operators");
        operators[_operator] = true;
        emit AddOperator(_operator);
    }

    /**
    * @notice Remove operator
    * @param _operator address of the operator to remove
    **/
    function removeOperator(address _operator) external {
        require(operators[msg.sender], "Only operators can manage operators");
        delete operators[_operator];
        emit RemoveOperator(_operator);
    }

    // Quests ----------------------------------------------
    event CreateQuest(uint questID, string gameName);
    event UpdateQuest(uint questID, string gameName);
    event ActivateQuest(uint questID, string gameName);
    event DeactivateQuest(uint questID, string gameName);

    /**
    * @notice Create a quests
    * @param _quest quest data
    * @return generated questID
    **/
    function createQuest(ggStructs.UpdatableQuestFields memory _quest) external returns (uint) {
        require(games[_quest.gameID].exists, "No game is linked to this gameID");
        ggStructs.Quest memory newQuest;
        newQuest.gameID = _quest.gameID;
        newQuest.metadataURL = _quest.metadataURL;
        newQuest.reputationReward = _quest.reputationReward;
        newQuest.exists = true;

        quests.push(newQuest);
        emit CreateQuest(quests.length, games[_quest.gameID].gameName);
        return quests.length;
    }

    /**
    * @notice Update a quests
    * @param _questID quest index
    * @param _quest quest data
    **/
    function updateQuest(uint _questID, ggStructs.UpdatableQuestFields memory _quest) external {
        require(games[_quest.gameID].exists, "No game is linked to this gameID");
        require(quests[_questID].exists, "Quest doesn't exist");
        quests[_questID].gameID = _quest.gameID;
        quests[_questID].metadataURL = _quest.metadataURL;
        quests[_questID].reputationReward = _quest.reputationReward;

        emit UpdateQuest(_questID, games[_quest.gameID].gameName);
    }

    /**
    * @notice Activate a quest
    * @param _questID quest index
    **/
    function activateQuest(uint _questID) external {
        require(quests[_questID].exists, "Quest doesn't exist");
        quests[_questID].isActive = true;
        emit ActivateQuest(_questID, games[quests[_questID].gameID].gameName);
    }

    /**
    * @notice Deactivate a quest
    * @param _questID quest index
    **/
    function deactivateQuest(uint _questID) external {
        require(quests[_questID].exists, "Quest doesn't exist");
        emit DeactivateQuest(_questID, games[quests[_questID].gameID].gameName);
    }

    // Rewards ---------------------------------------------
    event AddReward(address caller, bool completed);
    event RemoveReward(address caller, bool completed);
    event ClaimReward(address caller, bool completed);
    // Games & Game studios --------------------------------
    event AddGameStudio(address _operator);
    event AddGame(address _operator);
}