
const url = 'http://13.38.8.173:8080/api/reputation_scores';

var opts = {
    headers: {
      'mode':'cors'
    }
}

async function fetchScores() {
    let response = await fetch(url,opts);
    let data = await response.text();
    console.log(data);
    //return data;
}

const getScores =[
    {
        "name":  "genru"
    }
] 

export default getScores;