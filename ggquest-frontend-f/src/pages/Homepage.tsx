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
  },[])
  console.log(questInfos);
  console.log(Array.isArray(questInfos));
  return (
        <>
        <ContainerQuest>
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
                    item.game_name === "Axie" ? AxiePig2 : 
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
          {/*
            <QuestCatalogue game="Axie" srcGame={AxiePig2} srcToken={AxieToken}  />
            <QuestCatalogue game="Sandbox" srcGame={SandboxCharac} srcToken={SandToken}/>
            <QuestCatalogue game="Evio" srcGame={EvioCharac} srcToken={AxieToken}/>
            <QuestCatalogue game="Illuvium" srcGame={IlluCharac} srcToken={AxieToken}/>
          */}
        </ContainerQuest>
        </>
  )
}
export default Homepage;

