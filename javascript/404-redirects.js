const redirects = {
    "/theotown/plugin/animation-dev-mobile.html":
        "/theotown/plugin/pages/animation-dev/zh/index.html",
    "/theotown/plugin/animation-dev.html":
        "/theotown/plugin/pages/animation-dev/zh/index.html",
    "/theotown/plugin/animation-dev-en.html":
        "/theotown/plugin/pages/animation-dev/en/index.html",
    "/theotown/plugin/animation-dev-en-mobile.html":
        "/theotown/plugin/pages/animation-dev/en/index.html",
    "/theotown/plugin/building.html":
        "/theotown/plugin/pages/building/index.html",
    "/theotown/plugin/building3/":
        "/theotown/plugin/pages/building3/index.html",
    "/theotown/plugin/manifest.html":
        "/theotown/plugin/pages/manifest/index.html",
    "/theotown/plugin/road-deco/":
        "/theotown/plugin/pages/road-deco/index.html",
    "/theotown/plugin/value_calculator.html":
        "/theotown/plugin/pages/value-calculator/index.html",
};

const currentPath = location.pathname;
const targetPath = redirects[currentPath];
if (targetPath && !redirects[targetPath]) {
    const newUrl = targetPath + location.search + location.hash;
    document.getElementById("main-hint").style.display = "none";
    document.getElementById("redirect-hint").style.display = "block";
    document.getElementById("manual-link").href = newUrl;
    location.replace(newUrl);
}