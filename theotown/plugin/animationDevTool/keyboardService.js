document.addEventListener("keydown", (event) => {
    if (event.ctrlKey) {
        event.preventDefault();
        if (event.shiftKey) {
            // Ctrl + Shift + [key]
            switch (event.key) {
                case "ArrowUp":
                    origin.y -= 10;
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.MOVE_UP} ${Strings.PIXELS_10}`);
                    break;
                case "ArrowDown":
                    origin.y += 10;
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.MOVE_DOWN} ${Strings.PIXELS_10}`);
                    break;
                case "ArrowLeft":
                    origin.x -= 10;
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.MOVE_LEFT} ${Strings.PIXELS_10}`);
                    break;
                case "ArrowRight":
                    origin.x += 10;
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.MOVE_RIGHT} ${Strings.PIXELS_10}`);
                    break;
                case "+":
                    adjustAnimationZoomFactor(0.5);
                    break;
                case "_":
                    adjustAnimationZoomFactor(-0.5);
                    break
                default:
                    break;
            }
        } else {
            // Ctrl + [key]
            switch (event.key) {
                case "ArrowUp":
                    origin.y -= 1;
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.MOVE_UP} ${Strings.PIXEL_1}`);
                    break;
                case "ArrowDown":
                    origin.y += 1;
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.MOVE_DOWN} ${Strings.PIXEL_1}`);
                    break;
                case "ArrowLeft":
                    origin.x -= 1;
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.MOVE_LEFT} ${Strings.PIXEL_1}`);
                    break;
                case "ArrowRight":
                    origin.x += 1;
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.MOVE_RIGHT} ${Strings.PIXEL_1}`);
                    break;
                case "e":
                    origin = { x: 200, y: 600 };
                    refreshCanvas();
                    hint(`${Strings.ORIGIN_STR}: ${Strings.RESET_STR}`);
                    break;
                case "q":
                    animationData[animationIndex] = { x: 0, y: 0 };
                    refreshCanvas();
                    hint(`${Strings.ANIMATION_STR}(${animationIndex}): ${Strings.RESET_STR}`);
                    break;
                case "r":
                    refreshCanvas();
                    hint(`${Strings.REFRESH_STR}`);
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
                    if (parseInt(event.key) < animationData.length) {
                        animationIndex = parseInt(event.key);
                        hint(`${Strings.ANIMATION_STR}: ${animationIndex}`);
                    } else {
                        hint(`${Strings.ERROR_NO_ANIMATION}`);
                    }
                    refreshCanvas();
                    break;
                case "=":
                    adjustAnimationZoomFactor(0.1);
                    break;
                case "-":
                    adjustAnimationZoomFactor(-0.1);
                    break
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
                hint(`${Strings.ANIMATION_STR}: ${Strings.MOVE_UP} ${Strings.PIXELS_10}`);
                break;
            case "ArrowDown":
                animationData[animationIndex].y += 10;
                event.preventDefault();
                refreshCanvas();
                hint(`${Strings.ANIMATION_STR}: ${Strings.MOVE_DOWN} ${Strings.PIXELS_10}`);
                break;
            case "ArrowLeft":
                animationData[animationIndex].x -= 10;
                event.preventDefault();
                refreshCanvas();
                hint(`${Strings.ANIMATION_STR}: ${Strings.MOVE_LEFT} ${Strings.PIXELS_10}`);
                break;
            case "ArrowRight":
                animationData[animationIndex].x += 10;
                event.preventDefault();
                refreshCanvas();
                hint(`${Strings.ANIMATION_STR}: ${Strings.MOVE_RIGHT} ${Strings.PIXELS_10}`);
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
                hint(`${Strings.ANIMATION_STR}: ${Strings.MOVE_UP} ${Strings.PIXEL_1}`);
                break;
            case "ArrowDown":
                animationData[animationIndex].y += 1;
                event.preventDefault();
                refreshCanvas();
                hint(`${Strings.ANIMATION_STR}: ${Strings.MOVE_DOWN} ${Strings.PIXEL_1}`);
                break;
            case "ArrowLeft":
                animationData[animationIndex].x -= 1;
                event.preventDefault();
                refreshCanvas();
                hint(`${Strings.ANIMATION_STR}: ${Strings.MOVE_LEFT} ${Strings.PIXEL_1}`);
                break;
            case "ArrowRight":
                animationData[animationIndex].x += 1;
                event.preventDefault();
                refreshCanvas();
                hint(`${Strings.ANIMATION_STR}: ${Strings.MOVE_RIGHT} ${Strings.PIXEL_1}`);
                break;
            default:
                break;
        }
    }
});