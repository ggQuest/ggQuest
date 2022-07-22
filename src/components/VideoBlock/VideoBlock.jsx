import React from 'react';
import './VideoBLock.scss';
import {FaPlay} from 'react-icons/fa';

function VideoBlock() {
  return (
    <div className="video__block">
      <div className="video__screen">
        <img className="video__screen__image" src="https://images.pexels.com/photos/36744/agriculture-arable-clouds-countryside.jpg?auto=compress&cs=tinysrgb&w=600" alt=''/>
        <div className="video__screen__date">
          <div className="video__center"><FaPlay/></div>
          <ul className='video__down'>
            <li class="duration">01:45</li>
            <li class="quality">HD</li>
          </ul>
          </div>
      </div>
      <div className="video__pod__screen">
        <div className="video__pod__top">
          <h2 className="video__title">Mark Sniper sells House</h2>
          <h4 className="video__status">LIVES</h4>
        </div>
        <div className="video__pod__lower">
          <h4 class = "video__tag">35k views</h4>
          <h4 class = "video__tag">JANUARY 25, 2021</h4>
        </div>
      </div>
    </div>
  )
}

export default VideoBlock