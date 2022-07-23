import React from 'react';
import QuestCardComp from '../components/QuestCardComp/QuestCardComp.jsx';

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
                    <QuestCardComp filename="Axie.png" title="Axie" reward="Solana" />
                </div>
                <div className="col-lg-4 col-md-6">
                    <QuestCardComp filename="BigTime.jpg" title="Illuvium" reward="Ethereum"/>
                </div>
                <div className="col-lg-4 col-md-6">
                    <QuestCardComp filename="EVIO.jpg" title="Ev.io" reward="Matic"/>
                </div>
                <div className="col-lg-4 col-md-6">
                    <QuestCardComp filename="illuvium2.jpg" title="Illuvium" reward="BNB"/>
                </div>
                <div className="col-lg-4 col-md-6">
                    <QuestCardComp filename="staratlas.png" title="Star Atlas" reward="Ethereum"/>
                </div>
                <div className="col-lg-4 col-md-6">
                    <QuestCardComp filename="Sandbox.jpg" title="Sandbox" reward="Solana"/>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default QuestsPage