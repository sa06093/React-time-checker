const button = document.getElementById("button");
const startMessage = document.getElementById("startMessage");
const redMessage = document.getElementById("redMessage");
const greenMessage = document.getElementById("greenMessage");
const errorMessage = document.getElementById("errorMessage");
const ms = document.getElementById("ms");
const avg = document.getElementById("avg");
const best = document.getElementById("best");

const ol = document.querySelector("ol");
const deleteBtn = document.querySelector("button");

let firstTime;
let lastTime;
let reactTime;
let startTimeout;
let screenWidth = window.innerWidth;
let scoreArray;





// Score 관련
const handleScore = (event) => {
    const li = document.createElement("li");
    li.innerText = `${event}ms`;
    li.style.marginBottom = "0.5vh";
    ol.appendChild(li);

    const average = Math.floor(scoreArray.reduce((acc, num) => acc + num, 0) / scoreArray.length);
    const max = Math.floor(Math.min(...scoreArray));

    avg.innerText = `Average: ${average}ms`;
    best.innerText = `Best: ${max}ms`;

    // li가 5개를 넘어가면 지워버리기
    const maxCount = 5
    const liElements = ol.getElementsByTagName("li");
    if (liElements.length > maxCount) {
        ol.removeChild(liElements[0]);
    }
    if (liElements.length > maxCount - 1) {
        scoreArray.shift();
    }
};

if (localStorage.getItem("Score") !== null) {
    scoreArray = JSON.parse(localStorage.getItem("Score"));
    scoreArray.forEach(handleScore);
} else {
    scoreArray = [];
}

const handleDelete = () => {
    localStorage.removeItem("Score");
    scoreArray = [];
    ol.innerHTML = ''
};


// 빨강으로 바뀔시
const handleStart = () => {
    button.removeEventListener("click", handleStart);
    button.addEventListener("click", handleError);

    // display 설정
    startMessage.style.display = 'none';
    timeMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    redMessage.style.display = 'block';
    document.body.style.cursor = 'pointer';
    document.body.style.backgroundColor = '#ce2636';   

    //시간 흐르게 하기 (1~4초)
    const randomTime = Math.floor(Math.random()*3000 + 1000);
    startTimeout = setTimeout(handleTimeout, randomTime);
};

// 빨간색에서 클릭했을 시,
const handleError = () => {
    clearTimeout(startTimeout);
    redMessage.style.display = 'none';
    errorMessage.style.display = 'block';
    document.body.style.backgroundColor = '#2b87d1';
    document.body.style.cursor = 'pointer';
    button.addEventListener("click", handleStart);
}

// 초록으로 자동으로 넘어갈 시
const handleTimeout = () => {
    // display 설정
    redMessage.style.display = 'none';
    greenMessage.style.display = 'block';
    document.body.style.backgroundColor = '#4bdb6a';
    document.body.style.cursor = 'pointer';

    firstTime = performance.now();

    button.removeEventListener("click", handleError);
    button.addEventListener("click", handleCheckTime);
};

// 초록에서 클릭해서 파랑으로 넘어갈 시
const handleCheckTime = () => {
    // 이벤트리스너 제거
    button.removeEventListener("click", handleCheckTime);

    // 시간 설정
    lastTime = performance.now();

    screenWidth = window.innerWidth;
    
    if (screenWidth < 1024) {
        reactTime = Math.floor(lastTime - firstTime - 135);
    } else {
        reactTime = Math.floor(lastTime - firstTime - 35);
    }
    scoreArray.push(reactTime);
    localStorage.setItem("Score", JSON.stringify(scoreArray));

    handleScore(reactTime);

    // 배경 변경
    document.body.style.backgroundColor = '#2b87d1';
    greenMessage.style.display = 'none';
    ms.innerText = `${reactTime}ms`
    timeMessage.style.display = 'block';
    document.body.style.cursor = 'pointer';

    button.addEventListener("click", handleStart);
}

button.addEventListener("click", handleStart);
deleteBtn.addEventListener("click", handleDelete);