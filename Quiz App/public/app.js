let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('answer-options');
const progressEl = document.getElementById('question-progress');
const nextButton = document.getElementById('next-button');
const feedbackEl = document.getElementById('feedback-message');
const resultsView = document.getElementById('results-view');
const finalScoreEl = document.getElementById('final-score');
const scoreMessageEl = document.getElementById('score-message');
const reviewListEl = document.getElementById('review-list');

// Fetch quiz data
async function fetchQuiz() {
  try {
    const res = await fetch('/api/fetch-quiz');
    const data = await res.json();
    if (!data.data) throw new Error('Quiz data not found');
    questions = data.data;
    showQuestion();
  } catch (err) {
    questionTextEl.textContent = 'Failed to load quiz. Please refresh and try again.';
    console.error(err);
  }
}

// Decode Base64 strings from API
function decodeBase64(str) {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

// Shuffle answer options
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Display a question
function showQuestion() {
  const q = questions[currentQuestionIndex];
  const question = decodeBase64(q.question);
  const correct = decodeBase64(q.correct_answer);
  const options = shuffleArray([...q.incorrect_answers.map(decodeBase64), correct]);

  questionTextEl.textContent = question;
  optionsContainer.innerHTML = '';
  feedbackEl.textContent = '';
  nextButton.disabled = true;
  nextButton.textContent = 'Submit Answer';

  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'answer-option';
    btn.onclick = () => selectAnswer(btn);
    optionsContainer.appendChild(btn);
  });

  progressEl.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
}

// Select an answer
function selectAnswer(btn) {
  optionsContainer.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
  btn.classList.add('selected');
  nextButton.disabled = false;
}

// Submit answer
function handleAnswer() {
  const selectedButton = optionsContainer.querySelector('.selected');
  if (!selectedButton) return;

  const currentQ = questions[currentQuestionIndex];
  const selectedAnswer = selectedButton.textContent;
  const correctAnswer = decodeBase64(currentQ.correct_answer);
  const isCorrect = selectedAnswer === correctAnswer;

  userAnswers.push({
    question: decodeBase64(currentQ.question),
    correct: correctAnswer,
    selected: selectedAnswer,
    isCorrect: isCorrect,
  });

  feedbackEl.textContent = isCorrect
    ? '✅ Correct!'
    : `❌ Wrong. Correct answer: ${correctAnswer}`;
  feedbackEl.className = isCorrect ? 'feedback correct' : 'feedback incorrect';

  optionsContainer.querySelectorAll('button').forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) btn.classList.add('correct');
    else if (btn.textContent === selectedAnswer) btn.classList.add('incorrect');
  });

  nextButton.textContent =
    currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results';
  nextButton.onclick = nextOrResults;
}

// Move to next or show results
function nextOrResults() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
    nextButton.onclick = handleAnswer;
  } else {
    showResults();
  }
}

// Display results
function showResults() {
  document.getElementById('quiz-content').classList.add('hidden');
  resultsView.classList.remove('hidden');

  const score = userAnswers.filter((a) => a.isCorrect).length;
  finalScoreEl.textContent = `${score} / ${questions.length}`;
  scoreMessageEl.textContent =
    score >= questions.length * 0.75 ? '🎉 Great job!' : '👍 Keep practicing!';

  reviewListEl.innerHTML = '';
  userAnswers.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'review-card';
    div.innerHTML = `
      <p><strong>Question ${i + 1}:</strong> ${a.question}</p>
      <p>Your Answer: <span class="${a.isCorrect ? 'correct' : 'incorrect'}">${
      a.selected
    }</span></p>
      ${!a.isCorrect ? `<p>Correct Answer: <span class="correct">${a.correct}</span></p>` : ''}
    `;
    reviewListEl.appendChild(div);
  });
}

nextButton.onclick = handleAnswer;
window.onload = fetchQuiz;
