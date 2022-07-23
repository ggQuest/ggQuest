const url = 'http://13.38.8.173:8080/api/quests'

var opts = {
    headers: {
      'mode':'cors'
    }
}

async function fetchText() {
    let response = await fetch(url,opts);
    let data = await response.text();
    console.log(data);
}

fetchText();

const getInfosForCard =
        [
            {
                "id": 1,
                "game_name": "Babylon Arena",
                "title": "Elve Warrior",
                "description": "Get the full Elve outfit to become a Elve Warrior !",
                "reward": "+10 reputation and 1 Elve Warrior NFT",
                "image": "https://image.png"
            },
            {
                "id": 2,
                "game_name": "Fruits Shooter",
                "title": "Fruit Slayer",
                "description": "Score at least 30 points in one game !",
                "reward": "+5 reputation",
                "image": "https://image.png"
            }
        ]
;

export default getInfosForCard;