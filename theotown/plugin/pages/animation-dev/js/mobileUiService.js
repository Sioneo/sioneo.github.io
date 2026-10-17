// 简洁版移动键盘模拟服务
class SimpleKeyboardService {
    constructor() {
        this.keyStates = {
            ctrl: false,
            shift: false
        };
        this.init();
    }
    
    init() {
        this.bindButtonEvents();
        console.log('简洁键盘模拟服务已启动');
    }
    
    bindButtonEvents() {
        // Ctrl键 - 切换激活
        const ctrlBtn = document.getElementById('uiButtonCtrl');
        if (ctrlBtn) {
            ctrlBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleModifier('ctrl', ctrlBtn);
            });
        }
        
        // Shift键 - 切换激活
        const shiftBtn = document.getElementById('uiButtonShift');
        if (shiftBtn) {
            shiftBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleModifier('shift', shiftBtn);
            });
        }
        
        // Q键
        this.bindKeyButton('uiButtonQ', 'q');
        
        // E键
        this.bindKeyButton('uiButtonE', 'e');
        
        // R键
        this.bindKeyButton('uiButtonR', 'r');
        
        // 方向键
        this.bindKeyButton('uiButtonArrowUp', 'ArrowUp');
        this.bindKeyButton('uiButtonArrowDown', 'ArrowDown');
        this.bindKeyButton('uiButtonArrowLeft', 'ArrowLeft');
        this.bindKeyButton('uiButtonArrowRight', 'ArrowRight');
    }
    
    // 绑定普通按键
    bindKeyButton(buttonId, key) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        
        btn.addEventListener('click', () => {
            this.simulateKey(key);
        });
    }
    
    // 切换修饰键状态
    toggleModifier(modifier, button) {
        this.keyStates[modifier] = !this.keyStates[modifier];
        
        // 切换active类（唯一的视觉效果）
        button.classList.toggle('active');
        
        console.log(`${modifier} ${this.keyStates[modifier] ? '激活' : '未激活'}`);
    }
    
    // 模拟按键
    simulateKey(key) {
        const target = document.activeElement || document.body;
        
        // 构建事件配置
        const eventConfig = {
            key: this.getKeyName(key),
            code: this.getKeyCode(key),
            keyCode: this.getKeyCodeValue(key),
            bubbles: true,
            cancelable: true,
            ctrlKey: this.keyStates.ctrl,
            shiftKey: this.keyStates.shift
        };
        
        console.log(`模拟: ${key}, Ctrl: ${eventConfig.ctrlKey}, Shift: ${eventConfig.shiftKey}`);
        
        // 发送键盘事件
        const keyDown = new KeyboardEvent('keydown', eventConfig);
        const keyUp = new KeyboardEvent('keyup', eventConfig);
        
        target.dispatchEvent(keyDown);
        target.dispatchEvent(keyUp);
        
        return eventConfig;
    }
    
    // 工具函数
    getKeyName(key) {
        const map = {
            'q': 'q', 'e': 'e', 'r': 'r',
            'ArrowUp': 'ArrowUp', 'ArrowDown': 'ArrowDown',
            'ArrowLeft': 'ArrowLeft', 'ArrowRight': 'ArrowRight'
        };
        return map[key] || key;
    }
    
    getKeyCode(key) {
        const map = {
            'q': 'KeyQ', 'e': 'KeyE', 'r': 'KeyR',
            'ArrowUp': 'ArrowUp', 'ArrowDown': 'ArrowDown',
            'ArrowLeft': 'ArrowLeft', 'ArrowRight': 'ArrowRight'
        };
        return map[key] || '';
    }
    
    getKeyCodeValue(key) {
        const map = {
            'q': 81, 'e': 69, 'r': 82,
            'ArrowUp': 38, 'ArrowDown': 40,
            'ArrowLeft': 37, 'ArrowRight': 39
        };
        return map[key] || 0;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.keyboardService = new SimpleKeyboardService();
    }, 100);
});