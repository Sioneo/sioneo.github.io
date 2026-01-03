document.addEventListener("keydown", (event) => {
    if (event.ctrlKey) {
        event.preventDefault();
        if (event.shiftKey) {
            // Ctrl + Shift + [key]
            switch (event.key) {
                case "ArrowUp":
                    origin.y -= 10;
                    refreshCanvas();
                    hint("坐标原点: 向上10像素");
                    break;
                case "ArrowDown":
                    origin.y += 10;
                    refreshCanvas();
                    hint("坐标原点: 向下10像素");
                    break;
                case "ArrowLeft":
                    origin.x -= 10;
                    refreshCanvas();
                    hint("坐标原点: 向左10像素");
                    break;
                case "ArrowRight":
                    origin.x += 10;
                    refreshCanvas();
                    hint("坐标原点: 向右10像素");
                    break;
                default:
                    break;
            }
        } else {
            // Ctrl + [key]
            switch (event.key) {
                case "ArrowUp":
                    origin.y -= 1;
                    refreshCanvas();
                    hint("坐标原点: 向上1像素");
                    break;
                case "ArrowDown":
                    origin.y += 1;
                    refreshCanvas();
                    hint("坐标原点: 向下1像素");
                    break;
                case "ArrowLeft":
                    origin.x -= 1;
                    refreshCanvas();
                    hint("坐标原点: 向左1像素");
                    break;
                case "ArrowRight":
                    origin.x += 1;
                    refreshCanvas();
                    hint("坐标原点: 向右1像素");
                    break;
                case "e":
                    origin = { x: 200, y: 600 };
                    refreshCanvas();
                    hint("坐标原点: 重置");
                    break;
                case "q":
                    animationData[animationIndex] = { x: 0, y: 0 };
                    refreshCanvas();
                    hint("动画: 重置");
                    break;
                case "r":
                    refreshCanvas();
                    hint("刷新");
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    animationIndex = parseInt(event.key);
                    hint(`Animation: ${animationIndex}`);
                    refreshCanvas();
                    break;
                default:
                    break;
            }
        }
    } else if (event.shiftKey) {
        switch (event.key) {
            // Shift + [key]
            case "ArrowUp":
                animationData[animationIndex].y -= 10;
                event.preventDefault();
                refreshCanvas();
                hint("动画: 向上10像素");
                break;
            case "ArrowDown":
                animationData[animationIndex].y += 10;
                event.preventDefault();
                refreshCanvas();
                hint("动画: 向下10像素");
                break;
            case "ArrowLeft":
                animationData[animationIndex].x -= 10;
                event.preventDefault();
                refreshCanvas();
                hint("动画: 向左10像素");
                break;
            case "ArrowRight":
                animationData[animationIndex].x += 10;
                event.preventDefault();
                refreshCanvas();
                hint("动画: 向右10像素");
                break;
            default:
                break;
        }
    } else {
        switch (event.key) {
            // [key]
            case "ArrowUp":
                animationData[animationIndex].y -= 1;
                event.preventDefault();
                refreshCanvas();
                hint("动画: 向上1像素");
                break;
            case "ArrowDown":
                animationData[animationIndex].y += 1;
                event.preventDefault();
                refreshCanvas();
                hint("动画: 向下1像素");
                break;
            case "ArrowLeft":
                animationData[animationIndex].x -= 1;
                event.preventDefault();
                refreshCanvas();
                hint("动画: 向左1像素");
                break;
            case "ArrowRight":
                animationData[animationIndex].x += 1;
                event.preventDefault();
                refreshCanvas();
                hint("动画: 向右1像素");
                break;
            default:
                break;
        }
    }
});