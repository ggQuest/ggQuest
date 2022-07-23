import React from 'react';


function QuestsCardComp({id, description, gameName, title, reward, img }) {
  return (
    <>
    <div className="trending-gameplay-item mb-50">
        <div className="gameplay-thumb">
            <a href="https://www.youtube.com/watch?v=ssrNcwxALS4" className="popup-video">
                <img src={img} alt="" />
            </a>
            <div className="treand-gameplay-overlay">
                <ul>
                    <li className="quality">Bla</li>
                </ul>
            </div>
        </div>
        <div className="d-block d-sm-flex align-items-start">
            <div className="gameplay-content">
                <h5 className="title"><a href="#"></a></h5>
                <div className="gameplay-meta">
                    <ul>
                        <li>Title : {title}</li>
                        <li>Description : {description}</li>
                        <li>Rewards : {reward}</li>
                        <li>Game Name : {gameName} </li>
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