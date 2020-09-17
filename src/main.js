import { tests } from "./test.js";

const questionEl = document.querySelector(".question");
const answersEl = document.querySelector(".answers");

const userAnswerList = [];
let testNumber = 0;
const test = {
  current: tests[testNumber],
};

window.addEventListener("load", init);

// answersEl.addEventListener("click", onAnswerClick);

function showAnswers() {
  answersEl.addEventListener("click", onAnswerClick);

  if (testNumber !== 0) {
    return;
  }

  const hideEl = document.querySelectorAll(".answers .hide");
  let i = 0;
  const showing = setInterval(() => {
    hideEl[i].classList.remove("hide");
    i++;
    if (i == hideEl.length) {
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

function init() {
  let i = 0;
  let typingText = "";
  questionEl.innerHTML = "";

  const question = test.current.question;
  const typing = setInterval(() => {
    typingText += question[i];
    questionEl.innerText = typingText;
    i++;
    if (i === question.length) {
      clearInterval(typing);
      showAnswers();
    }
  }, 100);
}

function showNextTest() {
  testNumber++;
  test.current = tests[testNumber];
  if (test.current) {
    init();
  } else {
    window.location.href = "/index.html";
  }
  console.log(userAnswerList);
}

function submitAnswer(value) {
  userAnswerList.push(value);
}
