import React from 'react';

function StartItem({reputation, gameName}) {

  return (
    <>
    <div className="row" style={{background: '#0e0f15', padding: 15, margin: 5}}>
      <ul>
        <li style={{paddingRight: 10}}>Score Reputation for {gameName} is {reputation}</li>
      </ul>
    </div>
       
    </>
  )
}

export default StartItem