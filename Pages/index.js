const quizContainer = document.getElementById("question-container");
const progressBar = document.getElementById("progress");
const scoreContainer = document.getElementById("score-container");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
let currentQuestionIndex = 0;
let score = 0;

let questions = [];

// Fetch the CSV file containing the questions
fetch("questions.csv")
  .then((response) => response.text())
  .then((csv) => {
    loadQuestionsFromCSV(csv);
    createQuestion(questions[0], 0);
  })
  .catch((error) => console.error("Error loading CSV file:", error));

function loadQuestionsFromCSV(csv) {
  const lines = csv.split("\n");
  lines.forEach((line) => {
    const [, value] = line.split(",");
    questions.push(value.trim());
  });

  console.log("Loaded questions:", questions);
}

function createQuestion(question, index) {
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";
  questionDiv.innerHTML = `
    <p>${question}</p>
    <div class="options">
      <button class="option-btn" data-value="1">Strongly Disagree</button> <br/>
      <button class="option-btn" data-value="2">Disagree</button><br/>
      <button class="option-btn" data-value="3">Neutral</button><br/>
      <button class="option-btn" data-value="4">Agree</button><br/>
      <button class="option-btn" data-value="5">Strongly Agree</button><br/>
    </div>
  `;
  quizContainer.innerHTML = "";
  quizContainer.appendChild(questionDiv);

  const optionButtons = questionDiv.querySelectorAll(".option-btn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      optionButtons.forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");

      nextButton.disabled = false;
    });
  });

  const selectedOption = document.querySelector(".options .selected");
  if (selectedOption) {
    optionButtons.forEach((button) => {
      if (
        button.getAttribute("data-value") ===
        selectedOption.getAttribute("data-value")
      ) {
        button.classList.add("selected");
      }
    });
  }
}

function showScore() {
  quizContainer.style.display = "none";
  progressBar.style.display = "none";
  const maxScore = questions.length * 5; // Assuming each question has a maximum score of 5
  const rawScore = score;
  score = (rawScore / maxScore) * 9 + 1; // Scale the raw score to a range between 1 and 10
  scoreContainer.textContent = `Your score is: ${score.toFixed(1)}`;
  scoreContainer.style.display = "block";
}

prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    createQuestion(questions[currentQuestionIndex], currentQuestionIndex);
    progressBar.style.width = `${
      ((currentQuestionIndex + 1) / questions.length) * 100
    }%`;

    const selectedOption = document.querySelector(".options .selected");
    if (selectedOption) {
      const value = parseInt(selectedOption.getAttribute("data-value"));
      score -= value; // Subtract the selected option's value from the score
    }
  }
});
nextButton.addEventListener("click", () => {
  const selectedOption =
    document.querySelector(".options .selected") ||
    document.getElementById(`answer-${currentQuestionIndex}`);
  if (selectedOption) {
    const value = parseInt(selectedOption.getAttribute("data-value"));
    score += value; // Add the selected option's value to the score
    progressBar.style.width = `${
      ((currentQuestionIndex + 1) / questions.length) * 100
    }%`;

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      createQuestion(questions[currentQuestionIndex], currentQuestionIndex);
    } else {
      showScore();
    }
  } else {
    alert("Please select an option before proceeding to the next question.");
  }
});

nextButton.disabled = true;

createQuestion(questions[0], 0);
