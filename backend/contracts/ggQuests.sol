// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ggProfiles.sol";
import "./ggQuest.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ggQuests
 * @author h0tmilk
 * @notice ggQuests are challenges for players. They are linked to web3 games and allow to 
 * win rewards and increase ggProfile reputation
 */
contract ggQuests {

    using SafeMath for uint;

    mapping(address => bool) public operators;

    // Players' profiles
    ggProfiles private profiles;

    ggQuest[] private quests;
    string public questsMetadataBaseURI;
    mapping(uint => uint) private completedQuests; // questID => anumber of profiles who completed the quest
    mapping(address => uint[]) private completedQuestsByProfile; // profile => list of questIDs

    string[] public games; // array of game name
    string public gamesMetadataBaseURI; // Base URI to get game metadata

    mapping(uint => uint[]) public gameIdToQuestIds;
    mapping(uint => uint) public questIdToGameId;

    constructor(ggProfiles _ggProfiles, string memory _questsMetadataBaseURI, string memory _gamesMetadataBaseURI) {
        profiles = _ggProfiles;
        gamesMetadataBaseURI = _gamesMetadataBaseURI;
        questsMetadataBaseURI = _questsMetadataBaseURI;
        operators[msg.sender] = true;
    }

    // Operators --------------------------------------------

    event AddOperator(address _operator);
    event RemoveOperator(address _operator);

    /**
    * @notice Add operator
    * @param _operator address of the new operator
    **/
    function addOperator(address _operator) external onlyOperator {
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

    // Quests ----------------------------------------------

    event CreateQuest(uint questID, string gameName);

    /**
    * @notice Create a quests
    * @param _reputationReward reputation reward of the quest
    * @param _gameId game of the quest
    * @return generated questID
    **/
    function createQuest(uint _reputationReward, uint _gameId) external onlyOperator returns (uint) {
        uint questId = quests.length;
        ggQuest newQuest = new ggQuest(string(abi.encodePacked(questsMetadataBaseURI, Strings.toString(questId))), _reputationReward);
        quests.push(newQuest);

        questIdToGameId[questId] = _gameId;
        gameIdToQuestIds[_gameId].push(questId);

        emit CreateQuest(questId, games[_gameId]);

        return questId;
    }

    function getQuestURI(uint _questId) external view returns (string memory) {
        require(quests.length > _questId, "QuestID does not exist");
        return ggQuest(quests[_questId]).getQuestURI();
    }

    function getQuests() external view returns (ggQuest[] memory) {
        return quests;
    }

    function addQuestOperator(uint _questId, address _operator) external onlyOperator {
        require(quests.length > _questId, "QuestID does not exist");
        ggQuest(quests[_questId]).addOperator(_operator);
    }

    function removeQuestOperator(uint _questId, address _operator) external onlyOperator {
        require(quests.length > _questId, "QuestID does not exist");
        ggQuest(quests[_questId]).removeOperator(_operator);
    }

    // Games & Game studios --------------------------------

    event AddGame(string gameName, uint gameId);

    function addGame(string memory _gameName) external onlyOperator returns (uint) {
        games.push(_gameName);
        emit AddGame(_gameName, games.length-1);
        return games.length-1;
    }

    function getUrlMetadata(uint _gameId) external view returns (string memory){
        require(games.length > _gameId, "GameId does not exist");
        return string(abi.encodePacked(gamesMetadataBaseURI, Strings.toString(_gameId)));
    }

    function getGames() external view returns (string[] memory) {
        return games;
    }

    modifier onlyOperator() {
        require(operators[msg.sender], "Only operators can call this function");
        _;
    }
    
}