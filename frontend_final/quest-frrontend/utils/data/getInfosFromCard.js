const url = 'http://13.38.8.173:8080/api/quests'

var opts = {
    headers: {
      'mode':'cors'
    }
}

async function fetchText() {
    let response = await fetch(url,opts);
    let data = await response.json();
    console.log(data);
    console.log(Array.isArray(data));
}

const getInfosForCard = fetchText();

export default getInfosForCard;