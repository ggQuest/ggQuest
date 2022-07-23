import React from 'react';
import QuestCardComp from '../components/QuestCardComp/QuestCardComp.jsx';
import getInfosForCard from '../data/getInfosFromCard.js';

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
                <div className="col-lg-4 col-md-6">
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
                            />
                            )
                            
                        })
                    }
                </div>
              
            </div>
        </div>
    </section>
    </>
  )
}

export default QuestsPage