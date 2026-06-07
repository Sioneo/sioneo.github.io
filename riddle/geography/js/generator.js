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

function generateGame() {
    let riddleRange = document.getElementById("riddle-range-select").value;
    let riddleDifficuly = parseInt(document.getElementById("riddle-difficulty-select").value);

    if (riddleRange == "" || riddleDifficuly == "") {
        Utils.hint("请选择题库范围和难度", "warning");
        return;
    }

    Utils.hint("正在生成游戏");
    let candidates;
    switch (riddleRange) {
        case "nation":
            candidates = Object.keys(nations).filter(name => nations[name].level === riddleDifficuly);
            gameData.answer = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
            addTags(nations[gameData.answer].tags);
            gameData.type = "nation";
            break;
        case "city-globe":
            candidates = Object.keys(cities).filter(name => cities[name].level === riddleDifficuly);
            gameData.answer = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
            addTags(cities[gameData.answer].tags);
            gameData.type = "city";
            break;
    }
    console.log("The answer is", reverseAliases[gameData.answer], gameData.answer, "with tags", gameData.tags);
}