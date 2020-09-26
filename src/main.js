import { defaultTests } from "./test.js";

const questionEl = document.querySelector(".question");
const answersEl = document.querySelector(".answers");
const codeEl = document.querySelector(".current-code");
const progressBarEl = document.querySelector(".progressBar");

const userAnswerList = [];
let testNumber = 0;
const tests = [];
const test = {};

window.addEventListener("load", () => {
  setUpTests();
  init();
});

function init() {
  test.current = tests[testNumber];
  if (!test.current) {
    submitTests();
  }
  progressBarEl.style.width = `${((testNumber + 1) / tests.length) * 100}%`;
  showQuestion();
  showCode();
}

function setUpTests() {
  const tempTests = { r: [], e: [], i: [], a: [], c: [], s: [] };
  defaultTests.map((test) => {
    // 난수 배정
    test.randomNumber = Math.random() * 101;

    // 코드단위로 분류
    tempTests[test.code.toLowerCase()].push(test);
  });

  // 각 배열을 정렬
  for (let key in tempTests) {
    tempTests[key].sort((a, b) => a.randomNumber - b.randomNumber);
  }

  // 각 배열의 맨 뒤 2개를 제거 후 tests 배열에 추가하여, 하나의 배열로 통합
  for (let key in tempTests) {
    tempTests[key].splice(1, 2);
    tests.push(...tempTests[key]);
  }

  // tests 배열을 randomNumber 순으로 정렬
  tests.sort((a, b) => a.randomNumber - b.randomNumber);
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
    testNumber++;
    init();
  }, 1000);
}

function submitTests() {
  const queryString = getUserTotalScore();
  let pathName = window.location.pathname.split("/");
  pathName.splice(-1, 1);
  pathName = pathName.join("/");
  const resultUrl =
    window.location.hostname === "127.0.0.1"
      ? `${pathName}/result.html?${queryString}`
      : `${pathName}/result?${queryString}`;
  window.location.replace(resultUrl);
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
