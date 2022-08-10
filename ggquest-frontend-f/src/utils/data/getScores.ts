
const url = 'https://gg.quest/api/reputation_scores';

var opts = {
    headers: {
      'mode':'cors'
    }
}

export default async function fetchScores(): Promise<object[]> {
    let response = await fetch(url,opts);
    return await response.json();
}