const urlParams = new URLSearchParams(window.location.search);

const subject = urlParams.get("subject");
const mode = urlParams.get("mode");

let questions = [];
let currentQuestion = 0;
let mistakes = 0;

const questionNumber =
    document.getElementById("question-number");

const questionText =
    document.getElementById("question-text");

const questionImage =
    document.getElementById("question-image");

const answersContainer =
    document.getElementById("answers");

const nextButton =
    document.getElementById("next-button");

async function loadQuestions() {

    const response =
        await fetch(`data/${subject}`);

    questions = await response.json();

    shuffleArray(questions);

    if (mode !== "all") {
        questions =
            questions.slice(0, parseInt(mode));
    }

    showQuestion();
}

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];
    }
}

function showQuestion() {

    nextButton.style.display = "none";

    const q = questions[currentQuestion];

    questionNumber.innerText =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    questionText.innerText =
        q.question;

    answersContainer.innerHTML = "";

    if (q.image) {

        questionImage.src = q.image;
        questionImage.style.display = "block";

    } else {

        questionImage.style.display = "none";
    }

    shuffleArray(q.answers);

    q.answers.forEach(answer => {

        const button =
            document.createElement("button");

        button.innerText =
            answer.text;

        button.classList.add("answer-button");

        button.onclick = () =>
            selectAnswer(button, answer.correct);

        answersContainer.appendChild(button);
    });
}

function selectAnswer(button, correct) {

    const buttons =
        document.querySelectorAll(".answer-button");

    buttons.forEach(btn => {
        btn.disabled = true;
    });

    if (correct) {

        button.classList.add("correct");

    } else {

        button.classList.add("wrong");

        mistakes++;

        buttons.forEach(btn => {

            const answer =
                questions[currentQuestion]
                .answers.find(a => a.text === btn.innerText);

            if (answer.correct) {
                btn.classList.add("correct");
            }
        });
    }

    nextButton.style.display = "block";
}

nextButton.onclick = () => {

    currentQuestion++;

    if (currentQuestion >= questions.length) {

        finishQuiz();

    } else {

        showQuestion();
    }
};

function finishQuiz() {

    document.getElementById("quiz-container")
        .style.display = "none";

    document.getElementById("result-container")
        .style.display = "block";

    const correct =
        questions.length - mistakes;

    const percent =
        Math.round((correct / questions.length) * 100);

    document.getElementById("score").innerHTML = `
        Correct: ${correct}<br>
        Mistakes: ${mistakes}<br>
        Score: ${percent}%
    `;
}

function goHome() {
    window.location.href = "index.html";
}

loadQuestions();