import { results } from "./test.js";

const containerEl = document.querySelector(".container");
const loadingEl = document.querySelector(".loading");
const resultEl = document.querySelector(".result");

const params = new URLSearchParams(window.location.search.slice(1));
const user = {
  mainType: { code: "", score: 0 },
  subType: { code: "", score: 0 },
};

window.addEventListener("load", () => {
  showLoading();
  let maxScore = 0;
  for (let pair of params.entries()) {
    console.group(pair);
    pair[1] = +pair[1];
    if (+pair[1] > maxScore) {
      // 한 단계 아래로
      user.subType = { ...user.mainType };
      user.mainType.code = pair[0];
      user.mainType.score = pair[1];
      maxScore = pair[1];
    } else if (pair[1] > user.subType.score) {
      user.subType.code = pair[0];
      user.subType.score = pair[1];
    }
    console.groupEnd();
  }

  for (let result of results) {
    console.group(result);
    if (result.code === user.mainType.code) {
      user.mainType = { ...user.mainType, ...result };
    } else if (result.code === user.subType.code) {
      user.subType = { ...user.subType, ...result };
    }
    console.groupEnd();
  }
  console.log(user);
});

function showLoading() {
  let innerText = "내 유형은...";
  let textIndex = 0;
  const typing = setInterval(() => {
    loadingEl.innerText = innerText.slice(0, textIndex);
    textIndex++;
    if (textIndex > innerText.length) {
      textIndex = 0;
    }
  }, 300);
  setTimeout(() => {
    clearInterval(typing);
    loadingEl.remove();
    showResult();
  }, 300);
}

function showResult() {
  resultEl.innerHTML = `
    <div class="result__main">
      <div class="code">MAIN CODE: ${user.mainType.enName}</div>
      <div class="name">${user.mainType.name}</div>
      <div class="summary">${user.mainType.summary}</div>
      <div class="desc">${user.mainType.desc}</div>
    </div>
    <div class="result__sub">
      <div class="code">SUB CODE: ${user.subType.enName}</div>
      <div class="name">${user.subType.name}</div>
      <div class="summary">${user.subType.summary}</div>
      <div class="desc">${user.subType.desc}</div>
    </div>
  `;
  resultEl.classList.remove("hide");
}
