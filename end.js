const username=document.getElementById("username")
const saveScoreButton=document.getElementById("saveScoreBtn")
const finalScore=document.getElementById("finalScore")
const mostRecentScore=localStorage.getItem('mostRecentScore')
const highscores=JSON.parse(localStorage.getItem("highscores")) || [];

const MAX_HIGH_SCORE=5
finalScore.innerText=mostRecentScore;

username.addEventListener("keyup",()=>{
    saveScoreButton.disabled=!username.value;
});
saveHighScore=(e)=>{
    e.preventDefault();
    const score={
        score:mostRecentScore,
        name:username.value
    }
    highscores.push(score);
    highscores.sort((a,b)=> b.score-a.score);
    highscores.splice(MAX_HIGH_SCORE);
    localStorage.setItem('highscores',JSON.stringify(highscores));
    window.location.assign('index.html');
    console.log(highscores);
}