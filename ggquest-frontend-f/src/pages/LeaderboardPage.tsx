import { useEffect, useState } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import getScores from "../utils/data/getScores";

const LeaderboardPage = () => {
    const [scoresInfos, setScoresInfos] = useState<object[]>([]);

    useEffect(()=> {
        getScores().then((data)=> {
            setScoresInfos(data);
        })
    },[])
    console.log(scoresInfos);
    
    return (
        <LeaderboardTable data={scoresInfos} />
    )
}


export default LeaderboardPage;