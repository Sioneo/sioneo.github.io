let selectionAInput, selectionBInput, loopCountInput, isExportDetail;

let selectionA = [];
let selectionB = [];

const detail = document.getElementById("simulation-detail");
// 用于输出信息到详情区的函数
function print(msg = "Unknown Message") {
    detail.innerHTML += msg;
}

function updateValues() {
    selectionAInput = document.getElementById("selection-a-input").value;
    selectionBInput = document.getElementById("selection-b-input").value;
    loopCountInput = parseInt(document.getElementById("loop-count-input").value);
    isExportDetail = document.getElementById("detail-switch").checked;
}

function loadInput() {
    // 初始化
    updateValues();
    selectionA = [];
    selectionB = [];

    // 检查输入合法性
    if (!(selectionAInput && selectionBInput && loopCountInput)) { throw new Error("Invalid Input!"); }
    const selectionLength = selectionAInput.length == selectionBInput.length ? selectionAInput.length : null;
    if (!selectionLength) { throw new Error("The length of two selections must be same and > 0!"); }

    // 将输入加入到选择数组中
    for (let i = 0; i < selectionLength; i++) {
        selectionA.push(parseInt(selectionAInput.at(i)));
        selectionB.push(parseInt(selectionBInput.at(i)));
        if (Number.isNaN(selectionA[i]) || Number.isNaN(selectionB[i])) { throw new Error("Invalid Input! Input should contains numbers only.")}
        if (
            (selectionA[i] != 0 && selectionA[i] != 1) ||
            (selectionB[i] != 0 && selectionB[i] != 1)
        ) { throw new Error("Invalid Input! Section Input should contains 0 or 1 only.")}
    }

    console.log("Successfully loaded input");
    return true;
}

// 模拟投掷硬币
function tossCoin() {
    return Math.random() < 0.5 ? 0 : 1;
}

// 比较是否匹配
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// 模拟主函数
function simulate(selectionA, selectionB, loopCount, selectionLength) {
    let winCount = {a: 0, b: 0}

    for (let i = 0; i < loopCount; i++) {
        // 初始化相关变量
        let counter = 0;
        let currentSelection = []; // 用于存放模拟投掷结果的对比数组
        let winner;

        // 主循环
        while(true) {
            counter++;
            // 当投掷次数没有达到选择数组的长度时，只进行投掷的模拟，不进行比较
            if (counter < selectionLength) {
                currentSelection.push(tossCoin());
            // 当投掷次数等于选择数组长度时，进行对比
            } else if (counter == selectionLength) {
                currentSelection.push(tossCoin());
                if (arraysEqual(selectionA, currentSelection)) { winCount.a++; winner = "A"; break; }
                if (arraysEqual(selectionB, currentSelection)) { winCount.b++; winner = "B"; break; }
            // 当投掷次数大于选择数组长度时，移除对比数组第0位并在末尾追加新投掷结果
            } else {
                currentSelection.shift();
                currentSelection.push(tossCoin());
                if (arraysEqual(selectionA, currentSelection)) { winCount.a++; winner = "A"; break; }
                if (arraysEqual(selectionB, currentSelection)) { winCount.b++; winner = "B"; break; }
            }

            if (counter >= 10000) { throw new Error("WARNING: Possible Infinite Loop Detected! (Loop Count >= 10000)")}

        }
        if (isExportDetail) { print(`[${i}] 投掷了 ${counter} 次硬币; 胜利者: ${winner};<br>`); }
    }

    return winCount;
}


const resultDisplay = document.getElementById("result-display");
document.getElementById("simulation-start-button").addEventListener("click", () => {
    detail.innerHTML =  ""; // 清空详情栏
    try {
        loadInput();
    } catch (error) {
        alert(error);
        return;
    }
    // 开始模拟
    const selectionLength = selectionA.length;
    const result = simulate(selectionA, selectionB, loopCountInput, selectionLength);
    console.log("Simulation End, Result:", result);
    resultDisplay.innerHTML = `进行了 ${loopCountInput} 次循环;<br> 
    A胜利次数: ${result.a} (${Math.round((result.a / loopCountInput)*1e4)/1e2}%);<br> 
    B胜利次数: ${result.b} (${Math.round((result.b / loopCountInput)*1e4)/1e2}%)`;
})
