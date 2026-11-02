const cookie = document.querySelector('.cookie');
let counter = document.querySelector('#count');

const upgardeBoard = document.querySelector(".upgrades");
const upgradeBtn = document.querySelector("#upgradeclick");
const costLabel = document.querySelector("#clickUpgradeCost");
const autoCostLabel = document.querySelector("#autoUpgradeCostLabel");
const upgradeTwo = document.querySelector(".upgradeTwo");
const upgradeAuto = document.querySelector("#upgradeAuto");

const thrownCookie = document.querySelector(".throw");
const cookieThrow = document.querySelector("#throwCookie");

let count = 0;
let APS = 0;
let CPS = 1;
let upgradeCost = 10;
let autoUpgradeCost = 200;
let autoIncomeStarted = false;

const progressStorageKey = "cookieClickerProgress";

function loadProgress() {
    const savedProgress = localStorage.getItem(progressStorageKey);
    if (!savedProgress) return;

    try {
        const progress = JSON.parse(savedProgress);
        count = progress.count ?? count;
        APS = progress.APS ?? APS;
        CPS = progress.CPS ?? CPS;
        upgradeCost = progress.upgradeCost ?? upgradeCost;
        autoUpgradeCost = progress.autoUpgradeCost ?? autoUpgradeCost;
        autoIncomeStarted = progress.autoIncomeStarted ?? autoIncomeStarted;
    } catch (error) {
        console.error("Could not load saved cookie clicker progress.", error);
    }
}

function saveProgress() {
    localStorage.setItem(progressStorageKey, JSON.stringify({
        count,
        APS,
        CPS,
        upgradeCost,
        autoUpgradeCost,
        autoIncomeStarted
    }));
}

function startAutoIncome() {
    if (!autoIncomeStarted) {
        autoIncomeStarted = true;
        saveProgress();
    }

    window.setInterval(() => {
        count += APS;
        counter.textContent = count;
        saveProgress();
    }, 1000);
}

loadProgress();
counter.textContent = count;
costLabel.textContent = upgradeCost;
autoCostLabel.textContent = autoUpgradeCost;
if (count >= 10) unlocksDisplay();
if (count >= 200) unlockAuto();
if (autoIncomeStarted) startAutoIncome();

const orbit = { angle: 0 };
gsap.to(orbit, {
    angle: Math.PI * 2,
    duration: 4,
    repeat: -1,
    ease: "none",
    onUpdate: () => {
        gsap.set(cookie, {
            x: Math.cos(orbit.angle) * 5,
            y: Math.sin(orbit.angle) * 5
        });
    }
});


cookie.addEventListener("click", () => {
    count += CPS;
    counter.innerHTML = count
    gsap.fromTo(".cookie", { scale: 0.9 }, { scale: 1, duration: 0.5 });
    if (count >= 10) {
        unlocksDisplay();
    }
    if (count >= 200) {
        unlockAuto();
    }
    saveProgress();
});

function unlocksDisplay() {
    upgardeBoard.style.display = "flex";
}

function unlockAuto() {
    upgradeTwo.style.display = "flex";
}

upgradeBtn.addEventListener("click", () => {
    if (count < upgradeCost) return;

    count -= upgradeCost;
    counter.textContent = count;
    CPS += 1;
    upgradeCost = Math.floor(upgradeCost * 2.5);
    costLabel.textContent = upgradeCost;
    saveProgress();
});

upgradeAuto.addEventListener("click", () => {
    if (count < autoUpgradeCost) return;

    count -= autoUpgradeCost;
    counter.textContent = count;
    APS += 1;
    autoUpgradeCost = Math.floor(autoUpgradeCost * 1.5);
    autoCostLabel.textContent = autoUpgradeCost;
    saveProgress();

    if (!autoIncomeStarted) startAutoIncome();
});


// minigame unlock

let isThrown = false

cookieThrow.addEventListener("click", () => {
    if (isThrown == false) {
        throwCookie();
        isThrown = true
    } else {
        throwAnimation.pause();
        isThrown = false
    }
    console.log(isThrown);
    
});

function throwCookie() {
    throwAnimation = gsap.to(".throw", {
        x: 1000,
        duration: 3,
        onComplete: () => {
            throwAnimation.pause(0);
        }
    });
}