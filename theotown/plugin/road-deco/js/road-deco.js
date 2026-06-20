// 展示对话框
const newRdDialog = document.getElementById("add-new-rd-dialog");
function showNewRdDialog() {
    newRdDialog.showModal();
    console.log("[对话框] 打开新道路装饰对话框");
}
// 监听新道路装饰按钮
document.getElementById("new-rd-button").addEventListener("click", () => {
    showNewRdDialog();
})