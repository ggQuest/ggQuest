const url = 'http://13.38.8.173:8080/api/quests'

var opts = {
    headers: {
      'mode':'cors'
    }
}

async function fetchStats() {
    let response = await fetch(url,opts);
    let data = await response.text();
    console.log(data);
}

//fetchStats();

const getStats = {

}
export default getStats;