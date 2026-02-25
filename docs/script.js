let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;
let answered = false;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressEl = document.getElementById("progress");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("result");
const bestScoreEl = document.getElementById("bestScore");
const restartBtn = document.getElementById("restartBtn");

restartBtn.addEventListener("click", restartQuiz);

async function loadQuestions() {
  const response = await fetch("questions.json");
  questions = await response.json();

  // Mélange toutes les questions
  questions.sort(() => Math.random() - 0.5);

  // Prendre 20 max
  selectedQuestions = questions.slice(0, 20);

  showQuestion();
}

function startTimer() {
  timeLeft = 10;
  timeEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function showQuestion() {
  answered = false;

  const q = selectedQuestions[currentQuestion];

  questionEl.textContent =
    "Question " + (currentQuestion + 1) + " / 20 : " + q.question;

  answersEl.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;

    button.addEventListener("click", () => selectAnswer(button, index));

    answersEl.appendChild(button);
  });

  updateProgress();
  startTimer();
}

function selectAnswer(button, index) {
  if (answered) return;

  answered = true;
  clearInterval(timer);

  const correctIndex = selectedQuestions[currentQuestion].correct;
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;

    if (i === correctIndex) {
      btn.classList.add("correct");
    }

    if (i === index && i !== correctIndex) {
      btn.classList.add("wrong");
    }
  });

  if (index === correctIndex) {
    score++;
  }

  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < selectedQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function updateProgress() {
  const percent = (currentQuestion / selectedQuestions.length) * 100;
  progressEl.style.width = percent + "%";
}

function showResult() {
  questionEl.textContent = "Quiz terminé 🎉";
  answersEl.innerHTML = "";

  let message =
    score <= 5 ? "Débutant 👶" :
    score <= 12 ? "Intermédiaire 💻" :
    "Expert IT 🚀";

  resultEl.innerHTML =
    "Score final : " + score + " / 20<br>" + message;

  progressEl.style.width = "100%";

  // Sauvegarde meilleur score
  let best = localStorage.getItem("bestScore") || 0;

  if (score > best) {
    localStorage.setItem("bestScore", score);
    best = score;
  }

  bestScoreEl.textContent = "Meilleur score : " + best + " / 20";

  restartBtn.style.display = "block";
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  resultEl.innerHTML = "";
  restartBtn.style.display = "none";

  questions.sort(() => Math.random() - 0.5);
  selectedQuestions = questions.slice(0, 20);

  showQuestion();
}

loadQuestions();