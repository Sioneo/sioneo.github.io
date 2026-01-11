const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
var origin = { x: 200, y: 600 };
var animationData = [];
let templeteSize = { width: 1, height: 1 };
let originToEdge;
var loadedImageData = {
    building: [],
    animation: []
}

// A function that returns the distance between the origin to the edge
function getOriginToEdge() {
    return {
        up: origin.y,
        down: Math.abs(canvas.height - origin.y),
        left: origin.x,
        right: Math.abs(canvas.width - origin.x)
    };
}

function refreshCanvas() {
    canvas.width = document.getElementById("main").clientWidth;
    canvas.height = 800;
    originToEdge = getOriginToEdge();

    console.log(`Canvas Refreshed: Width: ${canvas.width}, Height: ${canvas.height}`);
    updateInfo();
    draw();
}

refreshCanvas() // Initialize the canvas

// A function used to get image and parameters
function getData(target) {
    switch (target) {
        case "size":
            const widthInput = document.getElementById("buildingWidthInput");
            const heightInput = document.getElementById("buildingHeightInput");
            if (widthInput.value && heightInput.value) {
                const result = {
                    width: parseInt(widthInput.value),
                    height: parseInt(heightInput.value)
                }
                console.log(`Templete Size Updated: width: ${result.width}, height: ${result.height}`)
                return result;

            } else {
                alert(Strings.ERROR_NO_BUILDING_SIZE);
            }
            break;
        default:
            break;
    }
}

// A function used to get image
function loadImage(imageInput, type, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const image = new Image();
        image.onload = function () {
            if (type == "building") {
                loadedImageData.building.push(image);
                let imageInfo = {
                    name: imageInput.name,
                    isCompleted: image.complete,
                    width: image.naturalWidth,
                    height: image.naturalHeight
                }
                callback(imageInfo)
            } else if (type == "animation") {
                loadedImageData.animation.push(image);
                let imageInfo = {
                    name: imageInput.name,
                    isCompleted: image.complete,
                    width: image.naturalWidth,
                    height: image.naturalHeight
                }
                callback(imageInfo)
            } else {
                console.error("function loadImage() did not recevie type parameter!")
            }
        }
        image.onerror = function () {
            alert(Strings.ERROR_IMAGE_LOAD_FAILED);
        }
        image.src = e.target.result;
    }
    reader.readAsDataURL(imageInput)
}


function draw() {
    console.log("------Draw Begin------");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(origin.x, origin.y); // Set the origin
    console.log(`Origin: X: ${origin.x}, Y: ${origin.y}`)
    ctx.save();

    // Draw the axis
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;
    // y
    ctx.moveTo(0, -originToEdge.up);
    ctx.lineTo(0, originToEdge.down);
    // x
    ctx.moveTo(-originToEdge.left, 0);
    ctx.lineTo(originToEdge.right, 0);
    ctx.stroke();


    // Draw building
    if (loadedImageData.building[0]) {
        ctx.drawImage(loadedImageData.building[0],
            0, (-loadedImageData.building[0].height + (templeteSize.width * 8)), // 位置
            loadedImageData.building[0].width, loadedImageData.building[0].height // 大小
        );
        console.log("Drawed building image")
    }

    // Draw Animation
    for (let i = 0; i < animationData.length; i++) {
        ctx.drawImage(loadedImageData.animation[i],
            animationData[i].x, animationData[i].y,
            loadedImageData.animation[i].width, loadedImageData.animation[i].height
        )
    }

    ctx.restore();
    console.log("------Draw End------")
}

document.getElementById("doneButton").addEventListener("click", function () {
    console.log("======Done Button was Clicked======")
    templeteSize = getData("size");
    animationData = [];
    loadedImageData = {
        building: [],
        animation: []
    }


    rawBuildingImage = document.getElementById("buildingFileInput").files[0];
    rawAnimationInput = document.getElementById("animationFileInput");

    if (rawAnimationInput.files[0] && rawBuildingImage) {
        loadImage(rawBuildingImage, "building", function (result) {
            console.log(`Succesefully loaded:`, result);
        });
        for (let i = 0; i < rawAnimationInput.files.length; i++) {
            loadImage(rawAnimationInput.files[i], "animation", function (result) {
                console.log(`Succesefully loaded:`, result);
                // Update animation position information
                animationData.push({ name: result.name, x: 0, y: 0 });
                console.log(`Animation ${i} Added`);
                // Draw when al images have been loaded
                if (i == rawAnimationInput.files.length - 1) {
                    console.log(`Animation Info: `, animationData);

                    // Load animation list information
                    let animationListInfo = "";
                    for (let j = 0; j < animationData.length; j++) {
                        let result = `<button class="button-small" onclick="animationIndex = ${j}; hint(\`${Strings.ANIMATION_STR}: ${j}\`);">${Strings.BUTTON_SWITCH_ANIMATION}</button>&emsp;Animation(${j}): ${animationData[j].name}, x: ${animationData[j].x}, y: ${animationData[j].y}, handle x: ${-animationData[j].x}, handle y: ${-animationData[j].y}<br>`
                        animationListInfo += result;
                    }
                    document.getElementById("animationList").innerHTML = animationListInfo;

                    draw();
                }
            });
        }
    } else {
        alert(Strings.ERROR_NO_FILE_IMPORTED)
    }
})