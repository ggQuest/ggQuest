import React, { useState } from 'react';

import styled, { keyframes } from 'styled-components';

import { BuyProduct } from "./claimQuest";
import { Overview } from "./overviewQuest";
import AxiePig2 from "./../../assets/images/axiePig2.png";

import { CardContext } from "./context";
import { motion } from "framer-motion";
import colors from '../../lib/colors';
import { Title } from '../common';


const CardContainer = styled.div`
  width: 290px;
  height: 580px;
  box-shadow: 0 0 12px 1px rgba(15, 15, 15, 0.12);
  position: relative;
  padding: 20px solid;
  border: 1px solid hsl(196, 100%, 50%);
  border-image-slice: 1;
  display:flex;
  margin:30px;
  
`;

const CardWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  
`;
const moving = keyframes`
from { transform: rotate(-10deg) translateX(0px) rotate(-10deg); }
to   { transform: rotate(300deg) translateX(10px) rotate(-250deg); }
`;
const rotateInDown =  keyframes`
0%, 100% {transform: translateX(0);}
	10%, 30%, 50%, 70%, 90% {transform: translateX(-10px);}
	20%, 40%, 60%, 80% {transform: translateX(10px);}
}
`
const AxieMoving = styled(motion.div)`
  position: absolute;
  width: auto;
  height: 23em;
  top: 3em;
  right: 0em;
  left: 14em;
  z-index: 99;
  animation: ${rotateInDown} 10s ease infinite;
  img {
    width: 130%;
  }
`;

export const BackgroundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const marquee = keyframes`
  from {
    transform: translateX(750px);
  }

  to {
    transform: translateX(-750px);
  }
`;

export const BackgroundText = styled(Title)`
  font-size: 160px;
  color: ${colors.primaryText}0A;
  animation: ${marquee} 30s linear infinite;
  white-space: nowrap;
`;

type QCProps = {
  game?: string;
  srcGame?:string;
  srcToken?:string;
  questItem?: any;
}

const QuestCatalogue = (props : QCProps) => {
    const [active, setActive] = useState("overview");

    const contextValue = { active, setActive };

    let animate = {};
    if (active === "buy") animate = { opacity: 1 };
    else if (active === "overview") animate = { opacity: 0 };

    return (
        <CardContext.Provider value={contextValue}>
            <CardContainer>
                
                <AxieMoving
                initial={{ opacity: 0 }}
                animate={animate}
                transition={{ type: "tween", duration: 1 }}
                >
                    <img src={props.srcGame} />
                </AxieMoving>
                
                <CardWrapper>
                    <Overview title={props.game} />
                    <BuyProduct srcToken={props.srcToken} title={props.game}/>
                </CardWrapper>
               
            </CardContainer>
        </CardContext.Provider>
    )
}

export default QuestCatalogue;
