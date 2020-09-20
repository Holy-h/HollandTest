import { tests } from "./test.js";

const questionEl = document.querySelector(".question");
const answersEl = document.querySelector(".answers");
const codeEl = document.querySelector(".current-code");

const userAnswerList = [];
let testNumber = 0;
const test = {
  current: tests[testNumber],
};

window.addEventListener("load", init);

function init() {
  showQuestion();
  showCode();
}

function showCode() {
  codeEl.innerText = test.current.code;
}

function showQuestion() {
  let textIndex = 0;
  let typingText = "";
  questionEl.innerHTML = "";
  const currentQuestion = test.current.question;
  const typing = setInterval(() => {
    typingText += currentQuestion[textIndex];
    questionEl.innerText = typingText;
    textIndex++;
    if (textIndex === currentQuestion.length) {
      clearInterval(typing);
      showAnswers();
    }
  }, 100);
}

function showAnswers() {
  answersEl.addEventListener("click", onAnswerClick);
  if (testNumber !== 0) {
    return;
  }
  let answerIndex = 0;
  const hideEl = document.querySelectorAll(".answers .hide");
  const showing = setInterval(() => {
    hideEl[answerIndex].classList.remove("hide");
    answerIndex++;
    if (answerIndex == hideEl.length) {
      clearInterval(showing);
    }
  }, 300);
}

function onAnswerClick(event) {
  const { target } = event;
  if (!target.classList.contains("answer")) {
    return;
  }
  target.classList.toggle("selected");
  answersEl.removeEventListener("click", onAnswerClick);
  setTimeout(() => {
    target.classList.remove("selected");
    submitAnswer(+target.innerText);
    showNextTest();
  }, 1000);
}

function showNextTest() {
  testNumber++;
  test.current = tests[testNumber];
  if (test.current) {
    init();
  } else {
    const queryString = getUserTotalScore();
    window.location.href(`result.html?${queryString}`);
  }
}

function submitAnswer(value) {
  userAnswerList.push(value);
}

function getUserTotalScore() {
  if (userAnswerList.length === 0) {
    return;
  }
  const queryList = [];
  const userTotalScore = {
    R: 0,
    E: 0,
    I: 0,
    A: 0,
    C: 0,
    S: 0,
  };
  tests.map((test, index) => {
    userTotalScore[test.code] += userAnswerList[index];
  });
  const scorePairList = Object.entries(userTotalScore);
  for (let scorePair of scorePairList) {
    queryList.push(`${scorePair[0]}=${scorePair[1]}`);
  }
  const queryString = queryList.join("&");
  console.log(queryString);
  return queryString;
}
