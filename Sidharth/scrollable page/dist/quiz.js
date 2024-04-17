const questions = [
  "E1: I am the life of the party.",
  "E2: I don't talk a lot.",
  "E3: I feel comfortable around people.",
  "E4: I keep in the background.",
  "E5: I start conversations.",
  "E6: I have little to say.",
  "E7: I talk to a lot of different people at parties.",
  "E8: I don't like to draw attention to myself.",
  "E9: I don't mind being the center of attention.",
  "E10: I am quiet around strangers.",
  "N1: I get stressed out easily.",
  "N2: I am relaxed most of the time.",
  "N3: I worry about things.",
  "N4: I seldom feel blue.",
  "N5: I am easily disturbed.",
  "N6: I get upset easily.",
  "N7: I change my mood a lot.",
  "N8: I have frequent mood swings.",
  "N9: I get irritated easily.",
  "N10: I often feel blue.",
  "A1: I feel little concern for others.",
  "A2: I am interested in people.",
  "A3: I insult people.",
  "A4: I sympathize with others' feelings.",
  "A5: I am not interested in other people's problems.",
  "A6: I have a soft heart.",
  "A7: I am not really interested in others.",
  "A8: I take time out for others.",
  "A9: I feel others' emotions.",
  "A10: I make people feel at ease.",
  "C1: I am always prepared.",
  "C2: I leave my belongings around.",
  "C3: I pay attention to details.",
  "C4: I make a mess of things.",
  "C5: I get chores done right away.",
  "C6: I often forget to put things back in their proper place.",
  "C7: I like order.",
  "C8: I shirk my duties.",
  "C9: I follow a schedule.",
  "C10: I am exacting in my work.",
  "O1: I have a rich vocabulary.",
  "O2: I have difficulty understanding abstract ideas.",
  "O3: I have a vivid imagination.",
  "O4: I am not interested in abstract ideas.",
  "O5: I have excellent ideas.",
  "O6: I do not have a good imagination.",
  "O7: I am quick to understand things.",
  "O8: I use difficult words.",
  "O9: I spend time reflecting on things.",
  "O10: I am full of ideas.",
];

const weights = {
  E: [1, 2, 3, 4, 5],
  N: [1, 2, 3, 4, 5],
  A: [1, 2, 3, 4, 5],
  C: [1, 2, 3, 4, 5],
  O: [1, 2, 3, 4, 5],
};

const quizContainer = document.getElementById("question-container");
const progressBar = document.getElementById("progress");
const scoreContainer = document.getElementById("score-container");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
let currentQuestionIndex = 0;
let score = 0;

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
  const maxScore = Object.values(weights).reduce(
    (acc, val) => acc + Math.max(...val),
    0
  );
  const finalScore = (score / maxScore) * 10;
  scoreContainer.textContent = `Your score is: ${finalScore.toFixed(1)}`;
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
      const trait = questions[currentQuestionIndex].charAt(0);
      score -= weights[trait][value - 1];
    }
  }
});
nextButton.addEventListener("click", () => {
  const selectedOption =
    document.querySelector(".options .selected") ||
    document.getElementById(`answer-${currentQuestionIndex}`);
  if (selectedOption) {
    const value = parseInt(selectedOption.getAttribute("data-value"));
    const trait = questions[currentQuestionIndex].charAt(0);
    score += weights[trait][value - 1];
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
