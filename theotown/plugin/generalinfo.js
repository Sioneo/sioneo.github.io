// 内容
const version = "1.1.4";
const title = "";
const news = "Version 1.1.4: 进行了一些修改";

var versionInfo = document.getElementById("versionInfo");
var newsTitle = document.getElementById("newsTitle");
var newsInfo = document.getElementById("newsInfo");

versionInfo.innerText = version;
if (newsTitle != null) {
    newsTitle.innerText = title;
}
if (newsInfo != null) {
    newsInfo.innerText = news;
}