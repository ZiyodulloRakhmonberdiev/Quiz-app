const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");


const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
}    

let questions = [],
time = 30,
score = 0,
currentQuestion, 
timer;

const startBtn = document.querySelector(".start"),
numQuestions = document.querySelector("#num-questions"),
difficulty = document.querySelector("#difficulty"),
category = document.querySelector("#category"),
timePerQuestion = document.querySelector("#time"),
quiz = document.querySelector(".quiz"),
startScreen = document.querySelector(".start-screen"),
nextBtn = document.querySelector(".next"),
submitBtn = document.querySelector(".submit");

const startQuiz = () => {
    const num = numQuestions?.value,
    cat = category?.value,
    diff = difficulty?.value;

    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

    fetch(url).then(res => res.json()).then((data) => {
        questions = data.results;
        // console.log(questions);
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[1])
        })
}

startBtn.addEventListener("click", startQuiz)


const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answers"),
    questionNumber = document.querySelector(".number");
    questionText.innerHTML = question?.question;
    submitBtn.disabled = true;

    const answers = [
        ...question?.incorrect_answers        ,
        question?.correct_answer?.toString()
    ]
    // console.log(answers)
    answers.sort(() => Math.random() - 0.5);
    answersWrapper.innerHTML = "";
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `
        <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
            <span class="icon">✔</span>
        </span>
    </div>
        `
    })

    questionNumber.innerHTML = ` Question <span class="current">${questions.indexOf(question)}</span> 
    <span class="total">/${questions?.length}</span>`;

    const answerEls = document.querySelectorAll(".answer");
    answerEls.forEach((answer) => {
        answer.addEventListener("click", () => {
            if(!answer.classList.contains("checked")){
               answerEls.forEach((answer) => {
                   answer.classList.remove("selected")
               })
               answer.classList.add("selected");
               submitBtn.disabled = false
            }
        })
    })
    time = timePerQuestion.value;
    startTimer(time)
}

const startTimer = (time) => {
    timer = setInterval(() => {
        // if time more than 0 means time remaining
        if (timer >= 0){
            progress(time);
            time--;
        }
        else {
            checkAnswer();
        }
    }, 1000)
}

submitBtn.addEventListener("click", () => {
    checkAnswer();
})

const checkAnswer = () => {
    clearInterval(timer);
console.log(questions[currentQuestion]);
    const selectedAnswer = document.querySelector(".selected");
    if(selectedAnswer){
        const answer = selectedAnswer.querySelector(".text");
        if(answer === questions[currentQuestion - 1].correct_answer){
            // increase score
            score++;
            selectedAnswer.classList.add("correct");
        }
        else{
            // if wrong selected
            selectedAnswer.classList.add("wrong");
            const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
                if(answer.querySelector('.text').innerHTML === questions[currentQuestion].correct_answer){
                    answer.classList.add("correct")
                }
            });
        }
    }
}