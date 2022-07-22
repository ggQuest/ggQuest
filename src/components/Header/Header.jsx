import React from 'react'
import logo from '../../assets/media/logo.png';
import './header.scss';

//icons (react-icons)
import {BsTwitter,BsVimeo,BsYoutube} from 'react-icons/bs';
import {CgFacebook} from 'react-icons/cg';
import {BiMessageSquareEdit} from 'react-icons/bi';
import {FaSearch} from 'react-icons/fa';

function Header() {
  return (
    <header>
      <div className="header__top">
        <div className="header__top__left">
          <div>FOLLOW</div>
          <a href="" className="header__social"><BsTwitter className="icon"/></a>
          <a href="" className="header__social"><CgFacebook  className="icon"/></a>
          <a href="" className='header__social'>
          <BsVimeo  class="icon"/>
          </a>
          <a href="" className="header__social">
          <BsYoutube  class="icon"/>
          </a>
        </div>
        <div className="header__top__center">
          <img src={logo} alt="" />
        </div>
        <div className="header__top__right">
          <a><BiMessageSquareEdit  class="icon icon-margin" />CONNECT WALLET</a>
        </div>
      </div>
      <div className="menu__bottom">
        <div className="menu__bottom__right">
          <a href="home">HOME</a>
          <a href="home" className='menu__btn'>Quests</a>
          <a href="home" className='menu__btn'>Leader Board</a>
          <a href="home" className='menu__btn'>Community</a>
        </div>
        <div className="menu__bottom__left">
          <a href="">blog</a>
          <a href="" className='menu__btn'>contact</a>
          <a href="" className='menu__btn menu__bottom__up'><FaSearch  class="icon"/></a>
        </div>
      </div>
    </header>
  )
}

export default Header