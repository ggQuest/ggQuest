import styled from "styled-components";
import sizes from "../lib/sizes";
import QuestCatalogue from "../components/QuestCatalogue";

import AxiePig2 from "./../assets/images/axiePig2.png";
import SandboxCharac from "./../assets/images/sandboxCharac2.png"
import AxieToken from "./../assets/images/axieToken.png";
import SandToken from "./../assets/images/sandboxLogo.png";
import EvioCharac from "./../assets/images/evioCharac.png";
import IlluCharac from "./../assets/images/illuWolf.png";
import BigTimeCharac from "./../assets/images/bigTimeCharac.png";
import StarAtlasCharac from "./../assets/images/starAtlasCharac.png";

import quests from "./../utils/data/getQuests";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";

import Carsl from "../components/Carousel"

const QuestTitle = styled.div`
display: none;
font-size: 24px;
text-align: center;
margin-top: 16px;

@media (max-width: ${sizes.md}px) {
  display: block;
}
`;

const ContainerQuest = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 30px 80px 30px 150px;
`

export const GameWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  padding-top: 20px;
`

const Button = styled.button`
  padding: 5px 15px;
  border-radius: 5px;
  color:white;
  margin: 10px 0px;
  background-color: transparent;
`;

export const Thing = styled.div`
  box-sizing: border-box;
  mix-blend-mode: screen;
  opacity: 1;
  box-shadow: 0px 3.93651px 3.93651px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  border-width : 2px;
  border-style: solid;
  border-image-slice: 1;
  font-family: Soft, sans-serif;
  font-style: normal;
  font-weight: bold;
  border-image-source: linear-gradient(to left, #1AFFE3, #8499DA);
  padding: 10px 100px;
`

export interface QuestInfo {
  title: string;
  reputation_reward: string | number;
  description: string;
  add_rewards: any;
  contract_address: string | number;
}

const Homepage = () => {
  const [questInfos, setQuestsInfos] = useState<object[]>([]);

  useEffect(() => {
    quests().then((data)=> {
      setQuestsInfos(data);
    })
  },[]);
  
  console.log(questInfos);
  console.log(Array.isArray(questInfos));

  const infos : QuestInfo = {
    title: "GAME 1",
    reputation_reward: 200,
    description: "tem.description",
    add_rewards: 21,
    contract_address: "0x0000000"
  }

  return (
        <>
        <Carsl/>
        <GameWrapper>
          <Thing>CHOOSE YOUR GAME</Thing>
        </GameWrapper>

        <ContainerQuest>
          {/* UNCOMMENT WHEN SERVER IS BACK 
          {
            questInfos && questInfos.map((item : any, index : any) => {
                const infos : QuestInfo = {
                  title: item.title,
                  reputation_reward: item.reputation_reward,
                  description: item.description,
                  add_rewards: item.additional_rewards,
                  contract_address: item.quest_contract
                }
                const srcGame = 
                    item.game_name === "Illuvium" ? IlluCharac : 
                    item.game_name === "Axie Infinity" ? AxiePig2 : 
                    item.game_name === "Sandbox" ? SandboxCharac : 
                    item.game_name === "Evio" ? EvioCharac : 
                    item.game_name === "Bigtime" ? BigTimeCharac : 
                    item.game_name === "StarAtlas" ? StarAtlasCharac : 
                    item.game_name === "Sandbox" ? SandboxCharac :
                    AxiePig2
                ; 
                const srcToken = item.game_name === "Sandbox" ? SandToken : AxieToken; 

                return (
                  <QuestCatalogue key={index} game={item.game_name} srcGame={srcGame} srcToken={srcToken} questInfos={infos} />
                )

            })
          }
          */}
          {/* TEMPORARY WE NED TO FETCH ASSETS FROM SERVER */}
          
          <QuestCatalogue questInfos={infos} game="Sandbox"/>
          <QuestCatalogue questInfos={infos} game="2"/>
          <QuestCatalogue questInfos={infos} game="3"/>
          <QuestCatalogue questInfos={infos} game="4"/>
          <QuestCatalogue questInfos={infos} game="5"/>
          <QuestCatalogue questInfos={infos} game="6"/>

        </ContainerQuest>
        <Footer/>

        </>
  )
}
export default Homepage;

