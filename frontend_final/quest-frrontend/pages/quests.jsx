import React from 'react';
import QuestCardComp from '../components/QuestCardComp';
import getInfosForCard from '../utils/data/getInfosFromCard.js';

import Footer from './../components/Footer';

function QuestsPage() {
  

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
                        getInfosForCard.map((item, key) => {
                            return (
                            <QuestCardComp 
                                key={key}
                                id={item.id} 
                                description={item.description} 
                                title={item.title}
                                reward={item.reward}
                                gameName={item.game_name}
                                contractAddress={item.contract_address}
                                img={item.image}
                            />
                            )
                            
                        })
                    }
              
            </div>
        </div>
    </section>
    <Footer/>
    </>
  )
}

export default QuestsPage