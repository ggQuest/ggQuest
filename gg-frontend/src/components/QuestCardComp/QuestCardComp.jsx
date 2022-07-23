import React from 'react';


function QuestsCardComp() {
  return (
    <>
    <div className="trending-gameplay-item mb-50">
        <div className="gameplay-thumb">
            <a href="https://www.youtube.com/watch?v=ssrNcwxALS4" className="popup-video">
                <img src={require('../../assets/img/images/Axie.png')} alt="" />
            </a>
            <div className="treand-gameplay-overlay">
                <ul>
                    <li className="quality">Bla</li>
                </ul>
            </div>
        </div>
        <div className="d-block d-sm-flex align-items-start">
            <div className="gameplay-content">
                <h5 className="title"><a href="#">Bla</a></h5>
                <div className="gameplay-meta">
                    <ul>
                        <li>Reputation score: 232</li>
                        <li>Rewards Token : 12</li>
                        <li>Actual Price of the token : 123 </li>
                    </ul>
                </div>
            </div>
            <div className="gameplay-status">
                <span>live</span>
            </div>
        </div>
    </div>
    </>
  )
}

export default QuestsCardComp