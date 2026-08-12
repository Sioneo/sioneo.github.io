const Type = {
    QQ_GROUP: "QQ群",
    QQ_CHANNEL: "QQ频道",
    DISCORD_SERVER: "Discord服务器",
    WEBSITE: "网站"
}

const Tag = {
    COMMERCIAL: {text: "商业化", color: "#006dcc"},
    OFFICIAL: {text: "官方", color: "#0b9900"},
    LOVE: {text: "LOVE", color: "#e60000"}
}

const chinaCommunityData = [
];
const intlCommunityData = [
    {
        name: "官方论坛",
        type: Type.WEBSITE,
        id: "forum.theotown.com",
        link: "https://forum.theotown.com/",
        tags: [Tag.OFFICIAL, Tag.LOVE]
    },
    {
        name: "官方Discord",
        type: Type.DISCORD_SERVER,
        id: "discord.gg/theotown",
        link: "https://discord.gg/theotown",
        tags: [Tag.OFFICIAL]
    },
    {
        name: "SPE_Building_Studio",
        type: Type.DISCORD_SERVER,
        id: "discord.gg/mfWznHPz",
        link: "https://discord.gg/mfWznHPz",
        tags: [Tag.LOVE]
    },
    {
        name: "ARK | Vönark | TheoTown",
        type: Type.DISCORD_SERVER,
        id: "discord.gg/3BC4JYfG",
        link: "https://discord.gg/3BC4JYfG",
        tags: []
    },
    {
        name: "The Leaf",
        type: Type.DISCORD_SERVER,
        id: "discord.gg/FdNAZnwWd3",
        link: "https://discord.gg/FdNAZnwWd3",
        tags: []
    },
    {
        name: "Yakka_Plugin_Center",
        type: Type.DISCORD_SERVER,
        id: "discord.gg/qnx5YDjDg7",
        link: "https://discord.gg/qnx5YDjDg7",
        tags: [Tag.COMMERCIAL]
    }
];
const chinaContainer = document.getElementById("china-communities");
const intlContainer = document.getElementById("intl-communities");

// 添加社区信息
function addInfo(data, target) {
    for (let i = 0; i < data.length; i++) {
        const communityData = data[i];
    
        let card = document.createElement("a");
        card.className = "card";
        card.target = "_blank";
        card.href = communityData.link;

        // 社区标签
        let tagContainer = document.createElement("div");
        tagContainer.style.display = "inline-block";
        for (let j = 0; j < communityData.tags.length; j++) {
            let tag = document.createElement("span");
            tag.textContent = communityData.tags[j].text;
            tag.style.backgroundColor = communityData.tags[j].color;
            tag.className = "tag";
            tagContainer.appendChild(tag);
        }
        card.appendChild(tagContainer);

        // 社区标题
        let title = document.createElement("h6");
        title.style.display = "inline-block";
        title.innerHTML = communityData.name;
        card.appendChild(title);
    
        // 社区类型
        let typeInfo = document.createElement("div");
        typeInfo.textContent = communityData.type;
        typeInfo.style.color = "var(--color-grey)";
        typeInfo.style.fontSize = "12pt";
        card.appendChild(typeInfo);
        
        // 社区ID
        let idInfo = document.createElement("div");
        idInfo.textContent = communityData.id;
        idInfo.style.color = "var(--color-grey)";
        idInfo.style.fontSize = "12pt";
        card.appendChild(idInfo);

        target.appendChild(card);
    }
}

addInfo(chinaCommunityData, chinaContainer);
addInfo(intlCommunityData, intlContainer);
