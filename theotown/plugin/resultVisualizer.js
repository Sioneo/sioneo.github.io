function visualize(data) {
    let result = `<p class="jsonResultTitle">结果如下</p>`;

    for (const key in data) {
        let keyData = data[key];
        let title = `<p class="jsonResultKeyTitle">${key}</p>`;
        result = result + title;

        for (let i = 0; i < keyData.length; i++) {
            let text =`<p class="jsonResult${keyData[i].type}">${keyData[i].message}</p>`;
            result = result + text;
        }
    }

    return result;
    // return JSON.stringify(data, null, 2);
}