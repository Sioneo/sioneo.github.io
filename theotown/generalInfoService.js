// 显示文件修改时间
const updateTimePara = document.getElementById("updateTime");
let updateTime = new Date(document.lastModified);
updateTimePara.innerText = updateTime.toLocaleString();