import React from 'react';

function LeaderBoardItem({score, address}) {

  return (
    <>
        <div className="name">Player : {address} </div>
        <div className="score">Score : {score}</div>
    </>
  )
}

export default LeaderBoardItem