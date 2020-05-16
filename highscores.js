const highScoresList=document.getElementById('highScoresList')
const highScores=JSON.parse(localStorage.getItem('highscores')) || [];
console.log(highScores);
highScoresList.innerHTML+=highScores.map(score=>{
    return `<tr><th>${score.name}</th><th>${score.score}</th></tr>`
    }).join("");