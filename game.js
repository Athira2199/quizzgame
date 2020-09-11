const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice"));
const progressText=document.getElementById("progressText");
const scoreText=document.getElementById("score");
const progressBar=document.getElementById("progressBar");
const loader=document.getElementById("loader");
const loaderText=document.getElementById("loaderText");
const home=document.getElementById("home");
const timerValue=document.getElementById("timer-value");
console.log(choices);
let currentQuestion={};
let acceptingAnswers=false;
let score=0
let questionCounter=0;
let availableQuestions=[];
let questions=[];
const urloptions=window.location.href.split("?")[1].split("&");
let optionValues=[]
let url="https://opentdb.com/api.php?"
urloptions.forEach(item=>{
    optionValues.push(item.split("=")[1])
})
if(optionValues[0]!="")
    url+=`amount=${optionValues[0]}&`
if(optionValues[1]!="")
    url+=`category=${optionValues[1]}&`
if(optionValues[2]!="")
    url+=`difficulty=${optionValues[2]}&`
url+='type=multiple'
let timeLeft=60*optionValues[0];
let counter=0;
fetch(url)
    .then(res=>{
        return res.json();
    }).then(loadedQuestions=>{
        questions=loadedQuestions.results.map(loadedQuestion=>{
            const question=loadedQuestion.question.replace(/&quot;/g, '\"')
                                                  .replace(/&amp;/g,'\&')
                                                  .replace(/&#039;/g,'\'')
                                                  .replace(/&ouml;/g,'Ö')
                                                  .replace(/&aring;/g,'Å')
            const formattedQuestion={
                question:question
            };
            const answerChoices=[...loadedQuestion.incorrect_answers];
            formattedQuestion.answer=Math.floor(Math.random() * (answerChoices.length))+1;
            answerChoices.splice(formattedQuestion.answer-1,0,loadedQuestion.correct_answer);
            answerChoices.forEach((choice,index)=>{
                choice=choice.replace(/&quot;/g, '\"')
                             .replace(/&amp;/g,'\&')
                             .replace(/&#039;/g,'\'')
                             .replace(/&ouml;/g,'Ö')
                             .replace(/&aring;/g,'Å')
                formattedQuestion["choice"+(index+1)]=choice;
            })
            return formattedQuestion;
        })
        startGame();
    })
    .catch(err=>{
        console.log(err)
    })
const CORRECT_BONUS=10;
const MAX_QUESTIONS=optionValues[0];
function timer(){
    counter++;
    let timer=timeLeft-counter
    let min=Math.floor(timer/60);
    let sec=timer%60;
    if(min<=9)
        min="0"+min
    if(sec<=9)
        sec="0"+sec
    if(min<2){
        timerValue.classList.add("bg-danger")
        timerValue.classList.remove("bg-success")
    }
    timerValue.innerText=`${min}:${sec}`
    if(min=="00" && sec=="00"){
        localStorage.setItem('mostRecentScore',score)
        home.classList.add("hidden")
        document.getElementById("timeimage").classList.remove("hidden")
        setInterval(redirect,1000)
    }
}
function redirect(){
    return window.location.assign("end.html")
}
startGame=()=>{
    questionCounter=0;
    score=0;
    availableQuestions=[...questions];
    console.log(availableQuestions);
    getNewQuestion();
    loader.classList.add("hidden");
    loaderText.classList.add("hidden");
    home.classList.remove("hidden");
    setInterval(timer,1000)
};
getNewQuestion=()=>{
    if(availableQuestions.length===0 || questionCounter>=MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore',score)
        return window.location.assign("end.html")
    }
    else{
    questionCounter++;
    progressText.innerText=`Question: ${questionCounter}/${MAX_QUESTIONS}`;
   progressBar.style.width=`${(questionCounter/MAX_QUESTIONS)*100}%`;
    scoreText.innerText=score;
    const questionIndex=Math.floor(Math.random() *availableQuestions.length);
    currentQuestion=availableQuestions[questionIndex]
    question.innerText=currentQuestion.question;
    choices.forEach(choice=>{
        const number=choice.dataset['number']
        choice.innerText=currentQuestion['choice'+number]
    });
    availableQuestions.splice(questionIndex,1);
    acceptingAnswers=true;
    }
}
choices.forEach(choice=>{
    choice.addEventListener("click",e=>{
        if(!acceptingAnswers) return;
        acceptingAnswers=false;
        const selectedChoice=e.target;
        const selectedAnswer=selectedChoice.dataset["number"];
        const classToApply=selectedAnswer==currentQuestion.answer? 'correct' : 'incorrect';
        if(classToApply==='correct'){
            incrementScore(CORRECT_BONUS)
        }
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(()=>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);
       
    });
});
incrementScore=num=>{
    score+=num;
    scoreText.innerText=score;
}
