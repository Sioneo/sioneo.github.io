-- SIO/九如喵的像素画生成器，1.0版本

-- 构建GUI的函数
-- 数据表样本：data = {icon = Icon.EXAMPLE, text = string, size = number, disableIcon = boolean或nil, labelLine = boolean或nil, extraTextWidth = number或nil}
local function addLine(parent, data)
    local textWidth = parent:getWidth() - data.size
    local line = parent:addLayout{height = data.size}
    
    if data.labelLine ~= true then -- 如果不为true，则设置较短的标签宽度
        textWidth = math.floor(parent:getWidth() / 5.5)
    end
    if data.extraTextWidth ~= nil and type(data.extraTextWidth) == "number" then
        textWidth = textWidth + math.floor(data.extraTextWidth)
    end
    -- 添加图标
    if data.labelLine ~= true and data.disableIcon ~= true then
        line:addIcon{icon = data.icon, height = data.size, width = data.size}
    end
    
    -- 添加文本/标签
    local text = line:addLabel{text = data.text, w = textWidth}
    text:setAlignment(0, 0.5)
    return line:addLayout{x = parent:getWidth() / 8 * 3}
end

local baseDraft, inTool, citySize
local itemSize = 25
local pos = {x = 0, y = 0}
-- 根据数据构建像素画的函数
local function build()
    for y = 1, #data do
        for x = 1, #data[1] do
            if data[#data + 1 - y][x] ~= 0 then
                Builder.buildBuilding(baseDraft, x - 1 + pos.x, y - 1 + pos.y)
                local building = Tile.getBuilding(x - 1 + pos.x, y - 1 + pos.y)
                building:setAnimationColor(data[#data + 1 - y][x][1], data[#data + 1 - y][x][2], data[#data + 1 - y][x][3])              
            end
        end
    end
    Debug.toast("完成")
end

-- 显示设置对话框的函数（用于加载数据和设置位置）
local function showSettingsDialog()
    local dialog = GUI.createDialog{
        title = "数据设置",
        width = 400,
        height = 230,
        actions = {{icon = Icon.OK, text = "完成"}}
    }
    local layout = dialog.content:addLayout{vertical = true}
    
    -- 添加坐标设置行
    local posLine = addLine(layout, {icon = Icon.MAP, text = "位置", size = itemSize})
    local posXTextField = posLine:addTextField{
        width = 75,
        height = itemSize,
        text = "X坐标"
    }
    local posYTextField = posLine:addTextField{
        width = 75,
        height = itemSize,
        text = "Y坐标"
    }
    posLine:addButton{
        icon = Icon.OK,
        text = "确认",
        height = itemSize,
        width = 0,
        onClick = function()
            local posInput = {x = posXTextField:getText(), y = posYTextField:getText()}
            if type(tonumber(posInput.x)) ~= "number" or type(tonumber(posInput.y)) ~= "number" then
                Debug.toast("坐标数据错误")
            elseif tonumber(posInput.x) < 0 or tonumber(posInput.y) < 0 then
                Debug.toast("坐标应大于等于0")
            else
                pos.x = math.floor(tonumber(posInput.x))
                pos.y = math.floor(tonumber(posInput.y))
                Debug.toast("位置设置成功：" .. tostring(pos.x) .. "," .. tostring(pos.y))
            end
        end
    }
    
    local noteLine = addLine(layout, {text = "坐标默认为(0, 0)；生成可能需要数十秒甚至2~3分钟的时间，请耐心等待", size = 20, labelLine = true})
end

-- 显示主界面的函数
local function showMainUI()
    TheoTown.registerToolAction{
        icon = Icon.BUILD,
        name = "生成",
        onClick = function()
            if data ~= nil then
                build()
            else
                Debug.toast("请先导入数据")
            end
        end
    }
    TheoTown.registerToolAction{
        icon = Icon.MENU,
        name = "数据",
        onClick = function()
            showSettingsDialog()
        end
    }
end

-- 脚本事件处理函数
function script:event(_, _, _, event)
    if event == Script.EVENT_TOOL_ENTER then
        showMainUI()
        screenSizeWidth, screenSizeHeight = Drawing.getSize()
        inTool = true
    end
    
    if event == Script.EVENT_TOOL_LEAVE then
        inTool = false
    end
end

-- 进入城市时调用的函数
function script:enterCity()
    citySize = tostring(City.getHeight())
    inTool = false
    
    
end
