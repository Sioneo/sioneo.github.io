export const FORM_BASIC_ITEMS = [
    {
        name: "id",
        type: "string",
        label: "ID",
        required: true,
        placeholder: "建筑的id"
    },
    {
        name: "type",
        type: "select",
        label: "类型",
        required: true,
        value: null, // 默认选占位项
        options: [
            { label: "🏠 住宅", value: "residential" },
            { label: "🏢 商业", value: "commercial" },
            { label: "🏭 工业", value: "industrial" },
            { label: "🌾 农场", value: "farm" },
            { label: "⚓ 港口工业", value: "harbor ind" },
            { label: "🌳 公园", value: "park" },
            { label: "⚽ 体育", value: "sport" },
            { label: "🏛️ 公共", value: "public" },
            { label: "⛪ 宗教", value: "religion" },
            { label: "🏆 奖励", value: "award" },
            { label: "⚡ 供电", value: "energy" },
            { label: "💧 供水", value: "water" },
            { label: "🚑 医疗", value: "medic" },
            { label: "🚔 警察", value: "police" },
            { label: "🚓 特警", value: "swat" },
            { label: "🚒 消防", value: "fire brigade" },
            { label: "🎓 教育", value: "education" },
            { label: "🎨 装饰", value: "decoration" },
            { label: "🚆 轨道交通", value: "railway station" },
            { label: "♻️ 垃圾处理", value: "waste disposal" },
            { label: "⚰️ 殡葬服务", value: "body disposal" },
        ],
    },
    {
        name: "level",
        type: "select",
        label: "等级",
        required: false,
        value: null, // 默认选占位项
        options: [
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
        ],
    },
    {
        name: "title",
        type: "string",
        label: "标题",
        placeholder: "建筑的标题"
    },
    {
        name: "width",
        type: "number",
        label: "宽度",
        placeholder: "建筑的宽度"
    },
    {
        name: "height",
        type: "number",
        label: "高度",
        placeholder: "建筑的高度"
    },
    {
        name: "price",
        type: "number",
        label: "价格",
        placeholder: "建筑的价格"
    },
    {
        name: "author",
        type: "string",
        label: "作者",
        placeholder: "插件的作者"
    }
];
