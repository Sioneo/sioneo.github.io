/* keymap.js —— 动画开发工具的按键映射表
 * 只声明「组合键 -> 动作」，绑定与匹配由 /web/modules/keyboard.js 负责
 */
import { TARGET } from "../../../modules/module-animation-dev.js";

// 方向键 -> [dx, dy, 位移提示文案 key]
const ARROWS = {
    ArrowUp: [0, -1, "MOVE_UP"],
    ArrowDown: [0, 1, "MOVE_DOWN"],
    ArrowLeft: [-1, 0, "MOVE_LEFT"],
    ArrowRight: [1, 0, "MOVE_RIGHT"],
};

export function createAnimationDevKeymap({ tool, strings, hint }) {
    const mappings = [];

    const move = (target, dx, dy, direction, fast) => {
        tool.move(target, dx, dy);
        const prefix = target === TARGET.ORIGIN ? strings.ORIGIN_STR : strings.ANIMATION_STR;
        const pixels = fast ? strings.PIXELS_10 : strings.PIXEL_1;
        hint(`${prefix}: ${strings[direction]} ${pixels}`);
    };

    for (const [key, [dx, dy, direction]] of Object.entries(ARROWS)) {
        // Ctrl(+Shift) + 方向键：移动坐标原点
        mappings.push(
            { keys: ["Ctrl", "Shift", key], action: () => move(TARGET.ORIGIN, dx * 10, dy * 10, direction, true) },
            { keys: ["Ctrl", key], action: () => move(TARGET.ORIGIN, dx, dy, direction, false) },
            // (Shift) + 方向键：移动当前动画
            { keys: ["Shift", key], action: () => move(TARGET.ANIMATION, dx * 10, dy * 10, direction, true) },
            { keys: [key], action: () => move(TARGET.ANIMATION, dx, dy, direction, false) }
        );
    }

    // 重置 / 刷新
    mappings.push(
        {
            keys: ["Ctrl", "E"],
            action: () => {
                tool.resetOrigin();
                hint(`${strings.ORIGIN_STR}: ${strings.RESET_STR}`);
            },
        },
        {
            keys: ["Ctrl", "Q"],
            action: () => {
                if (tool.resetAnimation()) {
                    hint(`${strings.ANIMATION_STR}(${tool.selected}): ${strings.RESET_STR}`);
                }
            },
        },
        {
            keys: ["Ctrl", "R"],
            action: () => {
                tool.refresh();
                hint(strings.REFRESH_STR);
            },
        }
    );

    // 缩放（Ctrl+Shift 用 +/-，Ctrl 用 =/-）
    mappings.push(
        { keys: ["Ctrl", "Shift", "+"], action: () => tool.zoom(0.5) },
        { keys: ["Ctrl", "Shift", "_"], action: () => tool.zoom(-0.5) },
        { keys: ["Ctrl", "="], action: () => tool.zoom(0.1) },
        { keys: ["Ctrl", "-"], action: () => tool.zoom(-0.1) }
    );

    // Ctrl + 数字键：切换动画
    for (let index = 0; index <= 9; index++) {
        mappings.push({ keys: ["Ctrl", String(index)], action: () => tool.selectAnimation(index) });
    }

    return mappings;
}
