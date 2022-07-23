import React from 'react';

function StartItem({reputation, gameName}) {

  return (
    <>
        <ul>
            <li>Score Reputation for {gameName} is {reputation}</li>
        </ul>
    </>
  )
}

export default StartItem