/*
import contract from "./contracts/NumberBox.json";

const contractAddress = "0xFDA9C8A3d94A9786d9639Dca33b92604802ba6e0";
const abi = contract.abi;*/
import React from 'react';
import QuestCardComp from '../components/QuestCardComp';
import getInfosForCard from '../utils/data/getInfosFromCard.js';
import { useState, useEffect } from 'react';
import Footer from './../components/Footer';


export default function Home() {
  const [dataInfos, setDataInfos] = useState([]);

  const url = 'http://13.38.8.173:8080/api/quests';

  var opts = {
      headers: {
        'mode':'cors'
      }
  }

  async function fetchText() {
      let response = await fetch(url,opts);
      let data = await response.json();
      console.log(data);
      console.log(Array.isArray(data));
      setDataInfos(data);
  }
  

  useEffect(() => {
    fetchText();
  },[]);
  return (

    <>
    <section className="trending-gamepay-area">
        <div className="container">
            <div className="row align-items-center mb-30">
                <div className="col-sm-6">
                    <div className="hf-section-title">
                        <h4 className="title">Trending quests</h4>
                    </div>
                </div>
                <div className="col-sm-6 d-none d-sm-block">
  
                </div>
            </div>
  
            <div className="row">
                    {
                          dataInfos.map((item, key) => {
                            return (
                            <QuestCardComp 
                                key={key}
                                id={item.id} 
                                description={item.description} 
                                title={item.title}
                                reward={item.reputation_reward}
                                gameName={item.game_name}
                                contractAddress={item.quest_contract}
                                img={item.image}
                            />
                            )
                            
                        })
                    }
              
            </div>
        </div>
    </section>
    <Footer />

    </>  
  )
}
