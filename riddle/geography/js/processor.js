var gameReady = true;
let riddleType;
const Utils = new Utilities({ hintTargetId: "start-menu-hint" });
const riddleTitle = document.getElementById("riddle-title");
const riddleTagContainer = document.getElementById("tag-container");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const guessRecord = document.getElementById("guess-record");
const congratulations = document.getElementById("congratulations");
const backToStartButton = document.getElementById("back-to-start-button");
const restartButton = document.getElementById("restart-button");
var gameData = {
    type: null,
    answer: null,
    tags: []
}

function updateTags(mode) {
    riddleTagContainer.innerHTML = "";
    if (mode == "init") {
        for (let i = 0; i < gameData.tags.length; i++) {
            let tag = document.createElement("div");
            tag.className = "tag unknown";
            tag.textContent = "未知";
            tag.id = gameData.tags[i].id;
            riddleTagContainer.appendChild(tag);
        }
    } else {
        for (let i = 0; i < gameData.tags.length; i++) {
            let tag = document.createElement("div");
            if (gameData.tags[i].revealed) {
                tag.className = "tag match";
                tag.textContent = gameData.tags[i].name;
            } else {
                tag.className = "tag unknown";
                tag.textContent = "未知";
            }
            tag.id = gameData.tags[i].id;
            riddleTagContainer.appendChild(tag);
        }
    }
}

function initilizeGame() {
    if (!gameReady) {
        Utils.hint("游戏未准备好，初始化中止", "error");
        return;
    }

    Utils.hint("正在初始化游戏");

    // 初始化标题
    switch (gameData.type) {
        case "nation":
            riddleType = "国家";
            break;
        case "city":
            riddleType = "城市";
            break;
    }
    riddleTitle.textContent = `正确的${riddleType}是: ?????`;

    // 初始化标签栏
    updateTags("init");

    // 初始化猜测记录列表
    guessRecord.innerHTML = "";

    // 初始化祝贺消息
    congratulations.style.display = "none";

    Utils.hint("初始化已完成");
}

function addGuessRecord(name = "???", tags = [{ name: "???", isMatch: false }]) {
    let recordLine = document.createElement("div");
    recordLine.className = "guess-record-line";

    let itemName = document.createElement("p");
    itemName.textContent = name;
    itemName.classList = "title";
    recordLine.appendChild(itemName);

    let tagContainer = document.createElement("div");
    tagContainer.className = "tags";
    for (let i = 0; i < tags.length; i++) {
        let tag = document.createElement("div");
        tag.textContent = tags[i].name;
        if (tags[i].isMatch) {
            tag.className = "tag match";
        } else {
            tag.className = "tag mismatch";
        }
        tagContainer.appendChild(tag);
    }
    recordLine.appendChild(tagContainer);
    guessRecord.prepend(recordLine);
}

// 游戏胜利
function gameWin() {
    congratulations.style.display = "block";
    riddleTitle.textContent = `正确的${riddleType}是: ${reverseAliases[gameData.answer]} / ${gameData.answer}`;
}

// 监听猜测按钮
guessButton.addEventListener("click", () => {
    const content = guessInput.value;

    if (content.startsWith("#")) {
        // 如果以#开头则表明猜测标签
        let isMatch = false;
        for (let i = 0; i < gameData.tags.length; i++) {
            if (gameData.tags[i].name == content.slice(1)) {
                gameData.tags[i].revealed = true;
                isMatch = true;
                updateTags();
            }
        }
        console.log("猜测", content, "结果", isMatch);
        addGuessRecord(content, [{ name: content.slice(1), isMatch: isMatch }]);
    } else {
        const keyName = aliases[content] ?? content; // 尝试查询别名表
        const keyData = nations[keyName] ?? cities[keyName]; // 尝试查询信息
        if (!keyData) {
            Utils.hint(`${content} 目标不存在`, "error");
        } else {
            // 首先把keyData转写为带isMatch的形式
            let keyTagData = [];
            for (let i = 0; i < keyData.tags.length; i++) {
                keyTagData.push({
                    name: keyData.tags[i],
                    isMatch: false
                })
            }
            // 目标存在则匹配tag
            let result = [];
            for (let i = 0; i < gameData.tags.length; i++) {
                for (let j = 0; j < keyTagData.length; j++) {
                    if (gameData.tags[i].name == keyTagData[j].name) {
                        gameData.tags[i].revealed = true;
                        keyTagData[j].isMatch = true;
                        updateTags();
                    }
                }
            }
            console.log("猜测", content, "结果", keyTagData);
            addGuessRecord(content, keyTagData);
        }

        if (keyName == gameData.answer) {
            gameWin();
        }
    }
})

restartButton.addEventListener("click", () => {
    generateGame();
})

backToStartButton.addEventListener("click", () => {
    initilizeGame();
    gameMenu.style.display = "none";
    startMenu.style.display = "block";
})