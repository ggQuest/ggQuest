import React from 'react';
import './collection.scss';
import {FaPlay} from 'react-icons/fa';
import VideoBlock from '../VideoBlock/VideoBlock';

function Collectin() {
  return (
    <div className='collection'>
      <div className="container">
        <div className="collection__header">
          <div className="intro__up">
            <span></span>
            <h2>TRENDING</h2>
          </div>
          <a className="intro__watch border-btn"><FaPlay/>watch now</a>
        </div>
        <div className="collection__blocks">
          <VideoBlock title="Mark Sniper sells House"/>
          <VideoBlock title="Mark Sniper sells House"/>
          <VideoBlock title="Mark Sniper sells House"/>

          <VideoBlock title="Mark Sniper sells House"/>
          <VideoBlock title="Mark Sniper sells House"/>
          <VideoBlock title="Mark Sniper sells House"/>
        </div>
      </div>
    </div>
  )
}

export default Collectin