import React, { useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

import AxieBackgroundImg from "./../../assets/images/axieP.png";
import SandBackgroundImg from "./../../assets/images/sand4.png";
import EvioBackgroundImg from "./../../assets/images/evio.png";
import IlluBackgroundImg from "./../../assets/images/illuHome.png";
import BigTimeBackgroundImg from "./../../assets/images/bigtimeHome.jpeg";
import StarAtlasBackgroundImg from "./../../assets/images/starAtlasHome.jpeg";

// TODO : remove the above ones new GAMES
import one from "./../../assets/images/homepage_games/Sandbox.png";
import two from "./../../assets/images/homepage_games/2.png";
import three from "./../../assets/images/homepage_games/3.png";
import four from "./../../assets/images/homepage_games/4.png";
import five from "./../../assets/images/homepage_games/5.png";
import six from "./../../assets/images/homepage_games/6.png";

import { Button, TitleText, transition } from "./common";
import { CardContext } from "./context";
import colors from "../../lib/colors";
import { Title } from "../common";

interface OCProps {
  game?: string;
}

const OverviewContainer = styled(motion.div)<OCProps>`
  min-width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  background: url(${props => 
    //props.game === "Axie Infinity" ? AxieBackgroundImg : 
    //props.game === "Sandbox" ? SandBackgroundImg :  
    props.game === "Evio" ? EvioBackgroundImg :
    props.game === "Bigtime" ? BigTimeBackgroundImg :  
    props.game === "StarAtlas" ? StarAtlasBackgroundImg : 
    props.game === "Sandbox" ? one :
    props.game === "2" ? two :
    props.game === "3" ? three :
    props.game === "4" ? four :
    props.game === "5" ? five :
    props.game === "6" ? six :
    IlluBackgroundImg}
  ) center;
  background-size: cover;
  background-position: -85px 0px;
  
  padding-bottom: 3em;
  z-index: 100;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  margin-bottom: 1.8em;
`;

const SpanBottomQuest = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.1em;
  background-color: black;
  width: 100%;
  height: 50px;
  border : 2px solid white;
  justify-content:center;
  font-family:Soft;
  font-size: 20px;
`

export function OverviewQuest(props : any) {
  const { active, setActive } = useContext(CardContext);

  const navigate = useNavigate();

  const switchToBuy = () => {
    setActive("buy");
  };

  const switchToQuest = (path : string) => {
    navigate(path)
  }

  let animate = {};
  if (active === "overview") animate = { x: 0 };
  else if (active === "buy") animate = { x: 0, y:600 };

  return (
    <OverviewContainer animate={animate} transition={transition} game={props.title}>
      {/** 
      <Button onClick={switchToBuy} overview>
        <TitleText variant>
          Overview
        </TitleText>
        </Button>
      */}
      <SpanBottomQuest onClick={() => switchToQuest(`/quest/${props.title}`)}>
        View Quests
      </SpanBottomQuest>
    </OverviewContainer>
  );
}
