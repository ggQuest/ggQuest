import {useParams} from "react-router-dom";
import styled from "styled-components";
import { GameWrapper, Thing } from "./Homepage";
import Sandbox from "./../assets/images/quests_banner/Sandbox.png"

interface GHProps {
    game?: string
}

const GameHeader = styled.div<GHProps>`
    display: flex;
    width: 100%;
    height: 300px;
    background: url(${props => 
        props.game === "sandbox" ? Sandbox :
        Sandbox
    }) center;
    background-size: cover;
`
const GameQuest = () => {
    const { game }  = useParams();
    // TODO : fetch to get quests for this game
    const gameLC = game?.toLowerCase();
    return (
        <>
            <GameHeader game={gameLC}/>
            <GameWrapper>
                <Thing>AVAILABLE QUESTS</Thing>
            </GameWrapper>

            <h1>GAME QUEST {gameLC}</h1>
        </>
    )
}

export default GameQuest;