import styled from "styled-components";
import sizes from "../lib/sizes";
import QuestCatalogue from "../components/QuestCatalogue";
import AxiePig2 from "./../assets/images/axiePig2.png";
import SandboxCharac from "./../assets/images/sandboxCharac2.png"
import AxieToken from "./../assets/images/axieToken.png";
import SandToken from "./../assets/images/sandboxLogo.png";
import EvioCharac from "./../assets/images/evioCharac.png";
import IlluCharac from "./../assets/images/illuWolf.png";
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

const Homepage = () => {
  const [questInfos, setQuestsInfos] = useState([]);
  useEffect(()=> {
    const data = quests();
    setQuestsInfos(data);
  },[])

  return (
        <>
        <ContainerQuest>
          
          <QuestCatalogue game="Axie" srcGame={AxiePig2} srcToken={AxieToken}  />
          <QuestCatalogue game="Sandbox" srcGame={SandboxCharac} srcToken={SandToken}/>
          <QuestCatalogue game="Evio" srcGame={EvioCharac} srcToken={AxieToken}/>
          <QuestCatalogue game="Illuvium" srcGame={IlluCharac} srcToken={AxieToken}/>
        </ContainerQuest>
        </>
  )
}
export default Homepage;

