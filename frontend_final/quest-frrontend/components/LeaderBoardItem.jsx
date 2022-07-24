import React from 'react';

function LeaderBoardItem({score, address}) {

  return (
    <>
     <div className="row" style={{background: '#0e0f15', padding: 15, margin: 5}}>
                <div style={{paddingRight: 10}}>Player : {address} </div>
                <div style={{background: 'red', width: 4}}></div>

                <div style={{paddingLeft: 10}} className="score">Score :  {score} </div>
      </div>
   
    </>
  )
}

export default LeaderBoardItem