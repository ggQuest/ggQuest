import React, { useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import AxieBackgroundImg from "./../../assets/images/axie2.png";
import SandBackgroundImg from "./../../assets/images/sand4.png";
import EvioBackgroundImg from "./../../assets/images/evio.png";
import IlluBackgroundImg from "./../../assets/images/illuHome.png";

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
  background: url(${props => props.game === "Axie" ? AxieBackgroundImg : props.game === "Sandbox" ? SandBackgroundImg :  props.game === "Evio" ? EvioBackgroundImg : IlluBackgroundImg}) center;
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

export function Overview(props : any) {
  const { active, setActive } = useContext(CardContext);

  const switchToBuy = () => {
    setActive("buy");
  };

  let animate = {};
  if (active === "overview") animate = { x: 0 };
  else if (active === "buy") animate = { x: 0, y:600 };

  return (
    <OverviewContainer animate={animate} transition={transition} game={props.title}>
      <Button onClick={switchToBuy} overview>
        <TitleText variant>
          Overview
        </TitleText>
        </Button>
      <TitleContainer>
        <TitleText>{props.title}</TitleText>
      </TitleContainer>
    </OverviewContainer>
  );
}
