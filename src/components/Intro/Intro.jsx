import React from 'react';
import './Intro.scss';  

import {BsCalendar3} from 'react-icons/bs';
import {BsClock} from 'react-icons/bs';
import {FaPlay} from 'react-icons/fa';

function Intro() {
  return (
    <div className="intro">
      <div className="intro__item">
        <div className="intro__up">
          <span></span>
          <h4>BEST OF 2022</h4>
        </div>
        <h1 className="intro__title">GG QUEST</h1>
        <h2 className="intro__after-title">
        YOUR GAMING <span>SAFEHEAVEN</span>
        </h2>
        <div class="banner-meta wow fadeInUp" data-wow-delay=".8s" data-wow-duration="1.8s">
          <ul className='intro__collection'>
            <li class="quality">
              <span>Pg 18</span>
              <span>hd</span>
            </li>
            <li class="category">
              <a href="#">Romance,</a>
              <a href="#">Drama</a>
            </li>
            <li class="release-time">
              <BsCalendar3 className='ico'/>
              <span>2021</span>
              <BsClock className='ico'/>
              <span>128 min</span>
            </li>
            </ul>
          </div>
        <a className="intro__watch border-btn"><FaPlay/>watch now</a>
        
      </div>
    </div>
  )
}

export default Intro