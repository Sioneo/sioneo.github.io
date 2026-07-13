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
    {
        name: "西奥小镇 | 交流群🍊",
        type: Type.QQ_GROUP,
        id: "779806001",
        link: "https://qun.qq.com/universal-share/share?ac=1&authKey=QgJAAycfVW4PCj7mEfl2E%2BXqrhEFddZNUlC2UT1kYAempWqCHF%2BQp8JbvhQ1y5TP&busi_data=eyJncm91cENvZGUiOiI3Nzk4MDYwMDEiLCJ0b2tlbiI6Ik42WmZid21ESnVpTVVoc3RhUGxTYTJ5Q2lEZlBpcGw2bkg0R2lac1ZtN1RVaVp6Z1c5RklLNzBERlpSSVNrUEIiLCJ1aW4iOiIxMzYwMjIzMTg0In0%3D&data=QEcnDiYFHJejj3ZS-xOTj2Cyj0aRSTLRPm99fM1tPNZ9-7fTeDb60J1YK41nhmuhWeG6N9Yf5HC7XsDw3w0-_g&svctype=4&tempid=h5_group_infoi",
        tags: [Tag.LOVE]
    },
    {
        name: "西奥小镇 | TheoTown",
        type: Type.QQ_CHANNEL,
        id: "46u9375311",
        link: "https://pd.qq.com/s/5uzl3hg9k?b=9",
        tags: [Tag.LOVE]
    },
    {
        name: "「ℝ𝕒𝕞𝕖𝕟~」游戏综合交流群～",
        type: Type.QQ_GROUP,
        id: "700250215",
        link: "https://qun.qq.com/universal-share/share?ac=1&authKey=D53mVwRt5SNSPyqTtPk2IvwSjqKWnFscBzx%2BqYt3qYmuBiuk55jOdI0lkfyOmtNo&busi_data=eyJncm91cENvZGUiOiI3MDAyNTAyMTUiLCJ0b2tlbiI6IjNRRC9YNFV0UmdnRHVWVVBOWHJRSlJpNllFR0pLQUl1MkhpbkQ1WTl5eGlBOUhtakJidTR5OGdxZ1gzSkV5RkYiLCJ1aW4iOiIxMzYwMjIzMTg0In0%3D&data=Za3qxJYO9DWO0u1eCsRETpXQd9V7p-GKEyvWGTOYfH4s70aH4xJvntHH_yK5oZXeGD4aErFiAoOqZ99jceL-6w&svctype=4&tempid=h5_group_info",
        tags: [Tag.LOVE]
    },
    {
        name: "西奥小镇 | TheoTown | 京师小镇",
        type: Type.QQ_GROUP,
        id: "817443877",
        link: "https://qun.qq.com/universal-share/share?ac=1&authKey=cIvWGA%2FVN9X0squCS9ZWZQKoN4YjyL3Xr86P0NL9PH2YIlLD89cKMZJKYeuNeJvm&busi_data=eyJncm91cENvZGUiOiI4MTc0NDM4NzciLCJ0b2tlbiI6InNSSUZJZktFT3I0WWZSOXkrblkya2MwUXg1UWlyTXZvU1Y5K1lleGk4VFNCdTBBbHF3akxkWW5EcmFhQjRjaTQiLCJ1aW4iOiIxMzYwMjIzMTg0In0%3D&data=ukTeNvjH1JJfC-Fg563ueOjlW9iFaRq-HpBOyjvADOZi1k659uPAVn7LPXbZ3KZ6r7J-hRZlNb1w_jzNb-IQUQ&svctype=4&tempid=h5_group_info",
        tags: [Tag.COMMERCIAL]
    },
    {
        name: "西奥小镇 | 地图插件交流群🍉",
        type: Type.QQ_GROUP,
        id: "568868006",
        link: "https://qun.qq.com/universal-share/share?ac=1&authKey=FF4ssQiMNuHuNca0FCqf4GM%2FqQhlmzskFHSQgUrU3Hh7YA1zwZ8oKrBsUUv6866V&busi_data=eyJncm91cENvZGUiOiI1Njg4NjgwMDYiLCJ0b2tlbiI6IjVQU3o2dWIvd0VyY1NlcDRGY0t0U0JLV01JT2x1L0haTGVjWjhwR3RRa3o0emJvcHNmbElYMmMwWlY3bDg0Y0wiLCJ1aW4iOiIxMzYwMjIzMTg0In0%3D&data=CRldQRxZdKCJSKVHdgHXM-AsdK2rxqeWDv4O47B_5j_MENWShg17XQ4PUJlcIudqapTWV2YMcK8GQCjHtHxSzw&svctype=4&tempid=h5_group_info",
        tags: []
    },
    {
        name: "西奥小镇|| TheoTown | 养老群🥑",
        type: Type.QQ_GROUP,
        id: "782673166",
        link: "https://qun.qq.com/universal-share/share?ac=1&authKey=VUrSQW7NI6vpVoGlNKgTCqemNEGFb3iWoa6MhpY8AR8mkK0Qb3MCvhnmQ2XuhnP%2F&busi_data=eyJncm91cENvZGUiOiI3ODI2NzMxNjYiLCJ0b2tlbiI6IkE4WEU5VHVEak0xRURDV0EvRGVReHRNK1Z2MnhjQUg3UDRENjFHRXc0SmIvV0xJdy9DMUMxZ0JqQnJkVGMvSE4iLCJ1aW4iOiIxMzYwMjIzMTg0In0%3D&data=QzLGhZg7gPndrdSorDAAf0442gg7-ULYBkbAI5l5K-T5SnGjiVelQ9cT8oleCAUaaUUb7l7qwShX028HVrVIOw&svctype=4&tempid=h5_group_info",
        tags: []
    },
    {
        name: "●西奥小镇||Theo Town●",
        type: Type.QQ_GROUP,
        id: "207984925",
        link: "./",
        tags: []
    },
    {
        name: "西奥小镇 | SPE城建交流频道",
        type: Type.QQ_CHANNEL,
        id: "pd35076572",
        link: "https://pd.qq.com/s/9nnrpurq5?b=9",
        tags: []
    },
    {
        name: "Theotown | 红烧鱼工作室🐟",
        type: Type.QQ_GROUP,
        id: "1057073123",
        link: "https://qm.qq.com/q/4sWt5QClvO",
        tags: []
    },
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
