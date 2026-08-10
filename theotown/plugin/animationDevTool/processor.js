const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
var origin = { x: 200, y: 600 };
var animationData = [];
let buildingData = { width: 1, height: 1 };
let originToEdge;
var loadedImageData = {
    building: [],
    animation: []
}
let animationZoomFactor = 3;
const zoomFactorDisplayer = document.getElementById("zoomFactor");

function adjustAnimationZoomFactor(factor) {
    if (animationZoomFactor + factor > 0) {
        animationZoomFactor += factor;
        animationZoomFactor = parseFloat(animationZoomFactor.toFixed(1));
        refreshCanvas();
        zoomFactorDisplayer.innerText = animationZoomFactor;
        if (factor > 0) {
            hint(`${Strings.ZOOM_IN} ${factor}`)
        } else {
            hint(`${Strings.ZOOM_OUT} ${Math.abs(factor)}`)
        }
    }
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
                let result = {
                    width: parseInt(widthInput.value),
                    height: parseInt(heightInput.value),
                    handleX: parseInt(document.getElementById("building-handle-x").value), // 0 if no input
                    handleY: parseInt(document.getElementById("building-handle-y").value), // NaN if no input
                }
                if (isNaN(result.handleX)) { result.handleX = 0; }
                console.log(`Template Size Updated: width: ${result.width}, height: ${result.height}, handle x: ${result.handleX}, handle y: ${result.handleY}`)
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
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(origin.x, origin.y); // Set the origin
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

     // 禁用所有平滑处理
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;  // Firefox
    ctx.webkitImageSmoothingEnabled = false; // Safari
    ctx.msImageSmoothingEnabled = false;   // IE

    ctx.scale(animationZoomFactor, animationZoomFactor);


    // Draw template border
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1.5 / animationZoomFactor;
    ctx.moveTo(0, 0);
    ctx.lineTo( 
        16*(buildingData.width),
        8*(buildingData.width) 
    );
    ctx.lineTo(
        16*(buildingData.width + buildingData.height),
        8*(buildingData.width - buildingData.height)
    );
    ctx.lineTo(
        16*(buildingData.height),
        8*(-buildingData.height)
    );
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Draw building
    if (loadedImageData.building[0]) {
        let handleY = buildingData.handleY; // frame处的handle y
        if (isNaN(handleY)) { 
           ctx.drawImage(loadedImageData.building[0],
                -buildingData.handleX, (-loadedImageData.building[0].height + (buildingData.width * 8)), // 位置
                 loadedImageData.building[0].width, loadedImageData.building[0].height // 大小
           );
        } else {
            ctx.drawImage(loadedImageData.building[0],
                 -buildingData.handleX, -handleY, // 位置
                  loadedImageData.building[0].width, loadedImageData.building[0].height // 大小
            );
        }
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
}

document.getElementById("doneButton").addEventListener("click", function () {
    console.log("======Done Button was Clicked======")
    buildingData = getData("size");
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

// Zoom button
zoomFactorDisplayer.innerText = parseFloat(animationZoomFactor);
document.getElementById("zoomInButton0.5").addEventListener("click", function () {
    adjustAnimationZoomFactor(0.5);
})

document.getElementById("zoomInButton0.1").addEventListener("click", function () {
    adjustAnimationZoomFactor(0.1);
})

document.getElementById("zoomOutButton0.1").addEventListener("click", function () {
    adjustAnimationZoomFactor(-0.1);
})

document.getElementById("zoomOutButton0.5").addEventListener("click", function () {
    adjustAnimationZoomFactor(-0.5);
})
