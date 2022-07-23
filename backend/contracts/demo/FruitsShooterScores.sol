// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Dumb contract for demo
contract FruitsShooterScores {

    mapping(address => uint) bestScore;

    function gameEnded(uint _score) public {
        if(bestScore[msg.sender] < _score) {
            bestScore[msg.sender] = _score;
        }
    }

    function getBestScore(address _user) public view returns(uint){
        return bestScore[_user];
    }
}