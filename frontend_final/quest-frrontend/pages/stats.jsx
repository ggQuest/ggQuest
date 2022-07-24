import React from 'react';
import StatItem from '../components/StatItem';
import { ethers } from 'ethers';
import { useAccount, useBalance } from 'wagmi';
import {useState, useEffect} from 'react';
import Footer from '../components/Footer';

function StatsPage() {

    const { address, isConnecting, isDisconnected } = useAccount();
    console.log(address);
  
  const [dataInfos, setDataInfos] = useState([]);

  const url = ' http://13.38.8.173:8080/api/reputation_scores/'+ address;

  var opts = {
      headers: {
        'mode':'cors'
      }
  }

  async function fetchOwnUser() {
      let response = await fetch(url,opts);
      let data = await response.json();
      console.log(data);
      console.log(Array.isArray(data));
      setDataInfos(data);
  }
  

  useEffect(() => {
    fetchOwnUser();
  },[]);

  return (
    <>
    <section className="trending-gamepay-area">
        <div className="container">
            <div className="row align-items-center mb-30">
                <div className="col-sm-6">
                    <div className="hf-section-title">
                        <h4 className="title">My Stats</h4>
                    </div>
                </div>
                <div className="col-sm-6 d-none d-sm-block">
  
                </div>
            </div>
  
            <div className="row">
                    {
                        dataInfos.map((item, key) => {
                            return (
                            <StatItem 
                                key={key}
                                reputation={item.reputation_score} 
                                gameName={item.game_name}
                            />
                            )
                            
                        })
                    }
              
            </div>
        </div>
       
    </section>
    </>
  )
}

export default StatsPage
