import React from 'react';

import getPlayers from '../utils/data/getPlayers';

import Footer from './../components/Footer';


function LeaderBoard() {
  return (
    <>
    <section className="trending-gamepay-area">
        <div className="container">
            <div className="row align-items-center mb-30">
                <div className="col-sm-6">
                    <div className="hf-section-title">
                        <h4 className="title">Best of the Week</h4>
                    </div>
                </div>
                <div className="col-sm-6 d-none d-sm-block">
                </div>
            </div>
            <div className="row">
                {
                    getPlayers.map((player,index) => {
                        return (
                            <>
                                <div className="name" key={index}>Player1</div>
                                <div className="score">430</div>
                            </>
                        )
                    })
                }
            </div>          
        </div>
    </section>
        <section className="trending-gamepay-area">
        <div className="container">
            <div className="row align-items-center mb-30">
                <div className="col-sm-6">
                    <div className="hf-section-title">
                        <h4 className="title">Best of all time</h4>
                    </div>
                </div>
                <div className="col-sm-6 d-none d-sm-block">
                </div>
            </div>
            <div className="row" style={{background: '#0e0f15', padding: 15, margin: 5}}>
                <div style={{paddingRight: 10}}>Player1</div>
                <div style={{background: 'red', width: 4}}></div>

                <div style={{paddingLeft: 10}} className="score">430</div>
            </div>

            <div className="row" style={{background: '#0e0f15', padding: 15, margin: 5}}>
                <div className="name">Player2</div><div className="score">580</div>
            </div>

            <div className="row">
                <div className="name">Player3</div><div className="score">310</div>
            </div>

            <div className="row">
                <div className="name">Player4</div><div className="score">640</div>
            </div>

            <div className="row">
                <div className="name">Player5</div><div className="score">495</div>
            </div>
            
            <div className="row">
                <div className="name">Player1</div><div className="score">430</div>
            </div>

            <div className="row">
                <div className="name">Player2</div><div className="score">580</div>
            </div>

            <div className="row">
                <div className="name">Player3</div><div className="score">310</div>
            </div>

            <div className="row">
                <div className="name">Player4</div><div className="score">640</div>
            </div>

            <div className="row">
                <div className="name">Player5</div><div className="score">495</div>
            </div>
        </div>
    </section>
    <Footer/>
    </>
  )
}

export default LeaderBoard