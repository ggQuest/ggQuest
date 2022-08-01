import LeaderboardTable from "../components/LeaderboardTable";


const LeaderboardPage = () => {
    return (
        <LeaderboardTable data={data} />
    )
}
const data = [
    {
        player: "James",
        score: "james@hotmail.com",
        age: "32",
        food: "pizza",
    },
    {
        player: "Jennifer",
        score: "jennifer@hotmail.com",
        age: "23",
        food: "sushi",
    },
    {
        player: "Markus",
        score: "markus@hotmail.com",
        age: "21",
        food: "chicken parm",
    },
    {
        player: "Sarah",
        score: "sarah@hotmail.com",
        age: "30",
        food: "burritos",
    },
    {
        player: "Stella",
        score: "stella@hotmail.com",
        age: "27",
        food: "samosa",
    },
];


export default LeaderboardPage;