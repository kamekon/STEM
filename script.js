const urlParams =
    new URLSearchParams(window.location.search);

const subject =
    urlParams.get("subject");

const mode =
    urlParams.get("mode");

const quizContainer =
    document.getElementById("quiz-container");

const finishButton =
    document.getElementById("finish-button");

const resultContainer =
    document.getElementById("result-container");

let mistakes = 0;

async function loadQuestions() {

    const response =
        await fetch(`data/${subject}`);

    let questions =
        await response.json();

    shuffleArray(questions);

    if (mode !== "all") {

        questions =
            questions.slice(0, parseInt(mode));
    }

    renderQuestions(questions);
}

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];
    }
}

function renderQuestions(questions) {

    questions.forEach((q, index) => {

        const questionDiv =
            document.createElement("div");

        questionDiv.classList.add("question-card");

        let imageHTML = "";

        if (q.image) {

            imageHTML = `
                <img
                    src="${q.image}"
                    class="question-image"
                >
            `;
        }

        questionDiv.innerHTML = `
            <h3>
                ${index + 1}. ${q.question}
            </h3>

            ${imageHTML}

            <div class="answers"></div>
        `;

        const answersDiv =
            questionDiv.querySelector(".answers");

        shuffleArray(q.answers);

        q.answers.forEach(answer => {

            const button =
                document.createElement("button");

            button.innerText =
                answer.text;

            button.classList.add("answer-button");

            button.onclick = () =>
                handleAnswer(
                    button,
                    q.answers,
                    answer.correct
                );

            answersDiv.appendChild(button);
        });

        quizContainer.appendChild(questionDiv);
    });
}

function handleAnswer(button, answers, correct) {

    const parent =
        button.parentElement;

    const buttons =
        parent.querySelectorAll("button");

    buttons.forEach(btn => {
        btn.disabled = true;
    });

    if (correct) {

        button.classList.add("correct");

    } else {

        button.classList.add("wrong");

        mistakes++;

        buttons.forEach(btn => {

            const matching =
                answers.find(
                    a => a.text === btn.innerText
                );

            if (matching.correct) {

                btn.classList.add("correct");
            }
        });
    }
}

finishButton.onclick = () => {

    const total =
        document.querySelectorAll(".question-card")
        .length;

    const correct =
        total - mistakes;

    const percent =
        Math.round((correct / total) * 100);

    resultContainer.innerHTML = `
        <h2>Results</h2>

        <p>Correct: ${correct}</p>

        <p>Mistakes: ${mistakes}</p>

        <p>Score: ${percent}%</p>
    `;

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

loadQuestions();
