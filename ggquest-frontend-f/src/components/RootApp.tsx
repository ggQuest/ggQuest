import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StatsPage from "../pages/StatsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import Homepage from "../pages/Homepage";
import Header from "./Header";
import { BackgroundContainer, BackgroundText } from "./QuestCatalogue";

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
                    <Route path="/" element={<Homepage />}>
                    </Route>
                    <Route path="/leaderboard" element={ <LeaderboardPage />}>
                    </Route>
                    <Route path="/stats" element={<StatsPage/>}>
                    </Route>
                </Routes>
            </Router>
        </Root>
        
    )
}

export default RootApp;