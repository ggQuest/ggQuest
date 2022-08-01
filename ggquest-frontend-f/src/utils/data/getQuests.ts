const url = 'http://13.38.8.173:8080/api/quests'

var opts = {
    headers: {
      'mode':'cors'
    }
}

export default async function fetchText(): Promise<object[]> {
    let response = await fetch(url,opts);
    return await response.json();
}