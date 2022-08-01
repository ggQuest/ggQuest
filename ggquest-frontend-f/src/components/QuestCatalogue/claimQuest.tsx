import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import { Button, transition } from "./common";

import { motion } from "framer-motion";
import { CardContext } from "./context";
import { Title } from "../common";

import CloseIcon from '@mui/icons-material/Close';
import { TitleText } from "./common";
import { ethers } from "ethers";
import contract_abi from "../../utils/contracts/commonABI.json";

const abi = contract_abi.abi;
const contractAddress = "0xDaF8E1B1b202047Abba7390284dc6ed24261f89D";

const BuyProductContainer = styled(motion.div)`
  min-width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 28px;
  background: #101111;
  background-size: cover;
  background-position: -380px -100px;
  padding: 10px;
`;
const gradient = keyframes`
from { transform: rotate(-10deg) translateX(0px) rotate(-10deg); }
to   { transform: rotate(300deg) translateX(30px) rotate(-280deg); }
`;

interface InfoCProps {
  variant?:any;
} 
const InfoContainer = styled.div<InfoCProps>`
  width: 80%;
  height: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: ${props=> 
    props.variant === "Sandbox" ? "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)" :
    props.variant === "Axie Infinity" ? "linear-gradient(90deg, rgba(216,188,197,1) 0%, rgba(174,215,238,1) 50%, rgba(148,233,183,1) 100%)" : 
    props.variant === "Illuvium" ? "linear-gradient(90deg, rgba(231,201,116,1) 2%, rgba(63,94,251,1) 100%, rgba(250,0,0,1) 100%)" : 
    props.variant === "Evio" ? "linear-gradient(90deg, rgba(216,188,197,1) 0%, rgba(159,74,226,1) 0%, rgba(14,26,198,1) 100%, rgba(148,233,183,1) 100%)" : 
    props.variant === "Bigtime" ? "linear-gradient(90deg, rgba(216,188,197,1) 0%, rgba(191,226,74,1) 0%, rgba(254,138,55,1) 100%)" : 
    props.variant === "StarAtlas" ? "linear-gradient(90deg, rgba(216,188,197,1) 0%, rgba(99,226,74,1) 0%, rgba(224,167,227,1) 91%);" : 

    "#fc0a54" 
  };
  animation: ${gradient} 10s ease infinite;
  border-radius: 30px;
  padding: 30px 18px;
`;

const Accessory = styled.div`
  width: auto;
  height: 6em;

  img {
    width: auto;
    height: 100%;
  }
`;

export interface BCProps {
  close?: any;
  long?: any;
  variant?:any;
}
interface CTProps {
  white?: any;
  variant?:any;
}

export const ButtonContainer = styled.div<BCProps>`
  display: flex;
  align-items: center;
  background: ${props => 
    props.variant === "Sandbox" ? "rgba(252, 10, 84, 0.12)" :
    props.variant === "Axie Infinity" ? "rgba(140,218,233,0.20774247198879547)" : 
    props.variant === "Illuvium" ? "rgba(232,168,29,0.1951374299719888)" : 
    props.variant === "Evio" ? "rgba(154, 10, 84, 0.12)" :
    props.variant === "StarAtlas" ? " rgba(130,216,112,0.1)" :
    props.variant === "Bigtime" ? "rgba(255,171,49,0.1)" :
    "rgba(100, 10, 74, 0.12)"
  };
  border-radius: ${props => props.long ? "10px" : "48px"};
  width: ${props => props.close ? "9%" : "70%"};
  padding: 4px 4px;
`;

const ClaimText = styled.span<CTProps>`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  text-transform: uppercase;
  color: ${props => 
    props.white ? "white" : 
    props.variant === "Sandbox" ? "#fc0a54" :
    props.variant === "Axie Infinity" ? "rgba(29,216,231,1)" : 
    props.variant === "Illuvium" ? "rgba(232,168,29,1)" : 
    props.variant === "Evio" ? "rgba(249,23,46,1)" :
    props.variant === "StarAtlas" ? "rgba(88,255,53,1)" :
    props.variant === "Bigtime" ? "rgba(255,171,49,1)" : 
    "rgba(100, 10, 74, 0.12)"
  };
  
  letter-spacing: 0.3px;
  padding-left:20px;
`;

export function ClaimQuest(props : any) {
  const { active, setActive } = useContext(CardContext);

  const infos = props.questInfos;

  const switchToOverview = () => {
    setActive("overview");
  };
  let animate = {};
  if (active === "overview") animate = { x: 0 };
  else if (active === "buy") animate = { x: -290 };

  async function claimReward() {
    if (typeof window.ethereum !== "undefined") {
        console.log(contractAddress);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(infos.contract_address, abi, signer);
      try {
        await contract.claimReward();

      } catch (error) {
          console.log(error)
      }
    }
  }
  
  return (
    <BuyProductContainer animate={animate} transition={transition}>
      <ButtonContainer onClick={switchToOverview} close variant={props.title}>
        <CloseIcon></CloseIcon>
      </ButtonContainer>
      <br></br>

      <TitleText insideCard>
        <ButtonContainer variant={props.title}>
          <ClaimText variant={props.title} >NAME OF THE QUEST</ClaimText>
        </ButtonContainer>
        <br></br>
        <ButtonContainer variant={props.title}>
          <ClaimText white variant={props.title}> {infos.title} </ClaimText>
        </ButtonContainer>
        <br></br>

        <ButtonContainer variant={props.title}>
          <ClaimText variant={props.title}>DESCRIPTION</ClaimText>
        </ButtonContainer> 
        <br></br>
        <ButtonContainer long variant={props.title}>
          <ClaimText white variant={props.title}> {infos.description} </ClaimText>
        </ButtonContainer>
        <br></br>
        <ButtonContainer variant={props.title}>
          <ClaimText variant={props.title}>REWARDS</ClaimText>
        </ButtonContainer>  
        <br/> 
        <ButtonContainer variant={props.title}>
          <ClaimText white variant={props.title}> {infos.reputation_reward} </ClaimText>
        </ButtonContainer>
      </TitleText>
      
      <InfoContainer variant={props.title}>
        <Accessory>
          <img src={props.srcToken} />
        </Accessory>
        <Button variant={props.title} onClick={claimReward}>
          <TitleText>
            CLAIM
          </TitleText>
        </Button>
      </InfoContainer>
    </BuyProductContainer>
  );
}
