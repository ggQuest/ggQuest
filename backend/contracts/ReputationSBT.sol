// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ReputationSBT {

    using SafeMath for uint;

    enum Flag{ NORMAL, BLACKLISTED, SUSPICIOUS }

    struct Reputation {
        uint reputationScore;
        Flag flag;
    }
    
    string public gameName;
    uint public maxReputationScorePerUser;
    mapping(address => bool) public operators; // addresses allowed to update the score

    mapping(address => Reputation) public ggQuestReputation;
    
    event IncreaseScore(address _user, uint _value);
    event DecreaseScore(address _user, uint _value);
    event FlagUser(address _operator, Flag _flag);
    event AddOperator(address _operator);
    event RemoveOperator(address _operator);

    constructor(string memory _gameName, uint _maxReputationScorePerUser) {
      gameName = _gameName;
      maxReputationScorePerUser = _maxReputationScorePerUser;
      operators[msg.sender] = true;
    }

    function increaseReputationScore(address _user, uint _amount) external {
        require(operators[msg.sender], "Only operators can update reputation score");
        require(_amount > 0, "Amount must be above 0");
        require(ggQuestReputation[_user].reputationScore.add(_amount) <= maxReputationScorePerUser, "Reputation score reached maximum value");
        ggQuestReputation[_user].reputationScore = ggQuestReputation[_user].reputationScore.add(_amount);
        emit IncreaseScore(_user, _amount);
    }

    function decreaseReputationScore(address _user, uint _amount) external {
        require(operators[msg.sender], "Only operators can update reputation score");
        require(_amount > 0, "Amount must be above 0");
        ggQuestReputation[_user].reputationScore = ggQuestReputation[_user].reputationScore.sub(_amount);
        emit DecreaseScore(_user, _amount);
    }

    function addOperator(address _operator) public {
        require(operators[msg.sender], "Only operators can manage operators");
        operators[_operator] = true;
    }

    function removeOperator(address _operator) public {
        require(operators[msg.sender], "Only operators can manage operators");
        operators[_operator] = false;
    }

    function flag(address _user, Flag _flag) external{
        require(operators[msg.sender], "Only operators can flag address");
        ggQuestReputation[_user].flag = _flag;
        emit FlagUser(_user, _flag);
    }

    function getReputationScore(address _user) external view returns (uint) {
        return ggQuestReputation[_user].reputationScore;
    }
}