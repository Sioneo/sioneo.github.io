import { FileManager } from "/web/modules/file-manager.js";
const fileManager = new FileManager({
    onChange: (diff) => {
        refreshListDOM(diff);
    }
});

const fileList = document.getElementById("file-list");
function buildListItemHTML(listItemId, fileId, file) {
    const li = document.createElement("li");
    li.id = listItemId;

    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container");

    const icon = document.createElement("span");
    icon.classList.add("gg-icon");
    switch (file.type) {
        case "image/png":
            icon.classList.add("gg-image");
            break;
        case "application/json":
            icon.classList.add("gg-file-document");
            break;
        default:
            icon.classList.add("gg-file");
            break;
    }

    const fileName = document.createElement("span");
    fileName.textContent = file.name;
    fileName.classList.add("flex-main");

    const controls = document.createElement("div");

    /*
    const viewButton = document.createElement("button");
    viewButton.title = "查看文件内容";
    viewButton.innerHTML = `<span style="--gg-size: 17px;" class="gg-icon gg-eye"></span>`;
    viewButton.addEventListener("click", () => {

    })
    */

    const infoButton = document.createElement("button");
    infoButton.title = "查看文件信息"
    infoButton.innerHTML = `<span style="--gg-size: 17px;" class="gg-icon gg-info"></span>`;
    infoButton.addEventListener("click", () => {
        subContainer.classList.toggle("active");
    })

    const deleteButton = document.createElement("button");
    deleteButton.title = "删除此文件";
    deleteButton.innerHTML = `<span style="--gg-size: 17px;" class="gg-icon gg-file-remove"></span>`
    deleteButton.addEventListener("click", () => {
        fileManager.deleteFileById(fileId);
    })

    // controls.appendChild(viewButton);
    controls.appendChild(infoButton);
    controls.appendChild(deleteButton);

    mainContainer.appendChild(icon);
    mainContainer.appendChild(fileName);
    mainContainer.appendChild(controls);

    // 下方信息栏
    const subContainer = document.createElement("div");
    subContainer.classList.add("sub-container");
    subContainer.classList.add("minor");
    subContainer.innerHTML = `大小: ${Math.round((file.size/1024) * 100) / 100} KiB<br>
类型: ${file.type}<br>
最后修改: ${(new Date(file.lastModified)).toLocaleString()}
`;

    li.appendChild(mainContainer);
    li.appendChild(subContainer);
    return li;
}

// 刷新列表DOM
function refreshListDOM(diff) {
    switch (diff.type) {
        case "add":
            const newListItem = buildListItemHTML(
                `li-${diff.id}`,
                diff.id,
                diff.file
            );
            fileList.appendChild(newListItem);
            break;
        case "delete":
            document.getElementById(`li-${diff.id}`).remove();
            break;
        default:
            break;
    }
}

const newFileInput = document.getElementById("new-file-input");
document.getElementById("new-file-button").addEventListener("click", async () => {
    const files = Array.from(newFileInput.files);
    for (const file of files) {
        switch (file.type) {
            case "application/json":
                // 待完成
                break;
            case "image/png":
                fileManager.addFile(file);
                break;
            case "application/zip":
                // 待完成
                break;
            default:
                if (file.name == "plugin.manifest") {
                    // 待完成
                }
                break;
        }
    }
    document.getElementById("new-file-form").reset(); 
})
