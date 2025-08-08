// 内容
const version = "1.2.1";
const title = "";
const news = "<em>Version 1.2.0:</em> <br>1.做了一个索引页<br>2.增加了分类的JSON生成器<br>3.增加了基础建筑那里的分类选项<br>下次再见～<br><em>Version 1.2.1:</em> 修复了一个错误";

var versionInfo = document.getElementById("versionInfo");
var newsTitle = document.getElementById("newsTitle");
var newsInfo = document.getElementById("newsInfo");

versionInfo.innerText = version;
if (newsTitle != null) {
    newsTitle.innerHTML = title;
}
if (newsInfo != null) {
    newsInfo.innerHTML = news;
}