// Initialization
const startMenu = document.getElementById("start-menu");
const gameMenu = document.getElementById("game");


// 游戏开始
document.getElementById("start-button").addEventListener("click", () => {
    if (gameReady) {
        // 生成游戏
        generateGame();
        startMenu.style.display = "none";
        gameMenu.style.display = "block";
        Utils.hint("生成完成");

        initilizeGame();
    } else {
        Utils.hint("正在加载...请等待", "info");
    }
})