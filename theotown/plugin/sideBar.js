const sideBar = document.getElementById("sideBar");
const data = [
    {name: "基础建筑", href: "helper.html"},
    {name: "插件清单", href: "manifest.html"},
    {name: "分类", href: "category.html"},
    {name: "数值计算器", href: "value_calculator.html"},
    {name: "JSON检查器(Beta)", href: "json_checker.html"},
    {name: "动画开发工具", href: "animation_dev.html"}
]

let result = "";
for (let i = 0; i < Object.keys(data).length; i++) {
    if (i != 0) {
        result = result + "<br>";
    }
    result = result + `<a href="${data[i].href}" target="_blank">${data[i].name}</a>`;
}

sideBar.innerHTML = result;