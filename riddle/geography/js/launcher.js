// Initialization
const startMenu = document.getElementById("start-menu");
const gameMenu = document.getElementById("game");

function addTags(tags) {
    gameData.tags = [];
    for (let i = 0; i < tags.length; i++) {
        gameData.tags.push({
            name: tags[i],
            revealed: false,
            id: "Tag-" + crypto.randomUUID().substring(0, 7)
        })
    }
}

// 游戏开始
document.getElementById("start-button").addEventListener("click", () => {
    if (gameReady) {
        // 生成游戏
        generateGame();
    } else {
        Utils.hint("正在加载...请等待", "info");
    }
})