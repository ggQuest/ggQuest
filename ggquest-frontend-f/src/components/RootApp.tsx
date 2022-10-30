import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StatsPage from "../pages/StatsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import MyProfile from "../pages/MyProfile";
import Homepage from "../pages/Homepage";
import Header from "./Header/Header";
import Quests from "../pages/Quests";
import GameQuest from "../pages/GameQuest";

import { BackgroundContainer, BackgroundText } from "./QuestCatalogue";
import { Footer } from "./Footer";

const Root = styled.div`
    background-color: black;
    min-height: 100vh;
    color:white;
`;

const RootApp = () => {
    return (
        <Root>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Homepage/>} />

                    <Route path="/leaderboard" element={ <LeaderboardPage />} />
     
                    <Route path="/stats" element={<StatsPage/>} />
                 
                    <Route path="/myprofile" element={<MyProfile/>} />

                    <Route path="/quests" element={<Quests/>} />

                    <Route path="quest/:game" element={<GameQuest/>} />
                </Routes>
            </Router>
        </Root>
        
    )
}

export default RootApp;