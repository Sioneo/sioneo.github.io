// 内容
const version = "1.3.3";
const title = "";
const news = `<em>Version 1.2.0:</em> <br>1.做了一个索引页<br>2.增加了分类的JSON生成器<br>3.增加了基础建筑那里的分类选项<br>下次再见～<br>
<em>Version 1.2.1:</em> 修复了一个错误；<br>
<em>Version 1.2.2:</em>做了一个数值计算器；<br>
<em>Version 1.3.0:</em>做了一个动画开发工具；<br>
<em>Version 1.3.1:</em>弄了一点小修改; <br>
<em>Version 1.3.2:</em><br>
1. 现在动画开发工具可以导入多个动画了;<br>
2. 添加了动画开发工具对移动端的支持; <br>
3. 逐步开始使用新的CSS样式;<br>
<em>Version 1.3.3:</em>为动画开发工具增加了缩放动画的功能;`;

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