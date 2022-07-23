import React from 'react';
import LeaderBoardItem from '../components/LeaderBoardItem';
import {useState, useEffect} from 'react';

function LeaderBoard() {
  const [dataInfos, setDataInfos] = useState([]);

  const url = ' http://13.38.8.173:8080/api/reputation_scores';

  var opts = {
      headers: {
        'mode':'cors'
      }
  }

  async function fetchReput() {
      let response = await fetch(url,opts);
      let data = await response.json();
      console.log(data);
      console.log(Array.isArray(data));
      setDataInfos(data);
  }
  

  useEffect(() => {
    fetchReput();
  },[]);

  dataInfos.sort((a, b) => (a.score < b.score) ? 1 : -1);


  return (
    <>
    <section className="trending-gamepay-area">
        <div className="container">
            <div className="row align-items-center mb-30">
                <div className="col-sm-6">
                    <div className="hf-section-title">
                        <h4 className="title">Top Ranking</h4>
                    </div>
                </div>
                <div className="col-sm-6 d-none d-sm-block">
                </div>
            </div>
            <div className="row">
                {
                    dataInfos.map((player,index) => {
                        return (
                            <LeaderBoardItem 
                                key={index} 
                                address={player.address}
                                score={player.score}
                            >
                            </LeaderBoardItem>
                        )
                    })
                }
            </div>

           
        </div>
    </section>
    </>
  )
}

export default LeaderBoard