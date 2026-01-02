/**
 * 为对话框添加拖拽功能
 * @param {Object} options - 配置选项
 * @param {string} options.dialogID - 对话框的ID
 * @param {string} [options.handleSelector='.header'] - 拖拽手柄的选择器（默认是 .header）
 * @param {boolean} [options.constrainToViewport=true] - 是否限制在视口内
 * @param {boolean} [options.savePosition=false] - 是否保存位置到localStorage
 * @param {string} [options.saveKey] - 保存位置的key（默认: dialogID + '_position'）
 */
function addDragService(options) {
    // 参数验证
    if (!options || !options.dialogID) {
        console.error('addDragService: dialogID 参数是必需的');
        return;
    }
    
    const dialog = document.getElementById(options.dialogID);
    if (!dialog) {
        console.error(`addDragService: 未找到ID为 "${options.dialogID}" 的元素`);
        return;
    }
    
    // 默认配置
    const config = {
        handleSelector: '.header',
        constrainToViewport: true,
        savePosition: false,
        saveKey: `${options.dialogID}_position`,
        ...options
    };
    
    // 获取拖拽手柄
    const dragHandle = dialog.querySelector(config.handleSelector);
    if (!dragHandle) {
        console.error(`addDragService: 未找到选择器 "${config.handleSelector}"`);
        return;
    }
    
    // 拖拽状态变量
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    
    // 恢复保存的位置
    if (config.savePosition) {
        restorePosition();
    }
    
    // 添加拖拽样式
    dragHandle.style.cursor = 'move';
    dragHandle.style.userSelect = 'none';
    
    // 添加事件监听器
    dragHandle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // 触摸屏支持
    dragHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', stopDrag);
    
    // 键盘支持（按ESC取消拖拽）
    document.addEventListener('keydown', handleKeyDown);
    
    // ========== 函数定义 ==========
    
    function startDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isDragging = true;
        
        // 获取鼠标/触摸位置
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        // 记录初始位置
        startX = clientX;
        startY = clientY;
        
        // 获取对话框当前位置
        const rect = dialog.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        
        // 添加拖拽中样式
        dragHandle.classList.add('dragging');
        dialog.classList.add('dragging');
        
        // 确保对话框是fixed定位
        dialog.style.position = 'fixed';
        dialog.style.zIndex = '9999'; // 拖拽时置顶
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        // 获取鼠标/触摸位置
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        // 计算移动距离
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        // 计算新位置
        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;
        
        // 限制在视口内
        if (config.constrainToViewport) {
            const maxX = window.innerWidth - dialog.offsetWidth;
            const maxY = window.innerHeight - dialog.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));
        }
        
        // 应用新位置
        dialog.style.left = `${newLeft}px`;
        dialog.style.top = `${newTop}px`;
        
        // 添加transform优化性能（可选）
        // dialog.style.transform = `translate(${newLeft}px, ${newTop}px)`;
    }
    
    function stopDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        
        // 移除拖拽样式
        dragHandle.classList.remove('dragging');
        dialog.classList.remove('dragging');
        dialog.style.zIndex = ''; // 恢复z-index
        
        // 保存位置
        if (config.savePosition) {
            savePosition();
        }
    }
    
    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            startDrag(e);
        }
    }
    
    function handleTouchMove(e) {
        if (e.touches.length === 1) {
            drag(e);
        }
    }
    
    function handleKeyDown(e) {
        if (e.key === 'Escape' && isDragging) {
            stopDrag();
            // 恢复原位置
            dialog.style.left = `${initialLeft}px`;
            dialog.style.top = `${initialTop}px`;
        }
    }
    
    function savePosition() {
        const position = {
            left: parseInt(dialog.style.left) || 0,
            top: parseInt(dialog.style.top) || 0,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem(config.saveKey, JSON.stringify(position));
        } catch (e) {
            console.warn('无法保存位置到localStorage:', e);
        }
    }
    
    function restorePosition() {
        try {
            const saved = localStorage.getItem(config.saveKey);
            if (saved) {
                const position = JSON.parse(saved);
                if (position.left !== undefined && position.top !== undefined) {
                    dialog.style.position = 'fixed';
                    dialog.style.left = `${position.left}px`;
                    dialog.style.top = `${position.top}px`;
                    return true;
                }
            }
        } catch (e) {
            console.warn('无法从localStorage恢复位置:', e);
        }
        return false;
    }
    
    // 返回控制方法（可选）
    return {
        enable: function() {
            dragHandle.style.pointerEvents = 'auto';
            dragHandle.style.cursor = 'move';
        },
        disable: function() {
            isDragging = false;
            dragHandle.style.pointerEvents = 'none';
            dragHandle.style.cursor = 'default';
        },
        resetPosition: function() {
            dialog.style.left = '';
            dialog.style.top = '';
            if (config.savePosition) {
                localStorage.removeItem(config.saveKey);
            }
        },
        updateOptions: function(newOptions) {
            Object.assign(config, newOptions);
        }
    };
}

/**
 * 专门为 <dialog> 元素优化的拖拽函数
 */
function addDragServiceForDialog(options) {
    const { dialogID } = options;
    const dialog = document.getElementById(dialogID);
    
    if (!dialog) return;
    
    // 覆盖对话框的showModal方法
    const originalShowModal = dialog.showModal;
    const originalShow = dialog.show;
    
    dialog.showModal = function(...args) {
        // 先调用原始方法
        originalShowModal.apply(this, args);
        
        // 移除浏览器的居中样式
        this.style.position = 'fixed';
        this.style.margin = '0';
        
        // 初始化位置（如果没有设置过）
        if (!this.style.left && !this.style.top) {
            this.style.left = '50%';
            this.style.top = '50%';
            this.style.transform = 'translate(-50%, -50%)';
        }
        
        // 确保不在顶层图层（通过polyfill或hack）
        this.style.setProperty('--dialog-layer', 'normal');
    };
    
    dialog.show = function(...args) {
        originalShow.apply(this, args);
        this.style.position = 'fixed';
        this.style.margin = '0';
    };
    
    // 调用普通的拖拽函数
    return addDragService(options);
}