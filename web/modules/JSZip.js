/* patched-jszip.js
 * 用法：
 *   方式 A（推荐）：先引原始 JSZip，再引本文件
 *     <script src="jszip.min.js"></script>
 *     <script src="patched-jszip.js"></script>
 *
 *   方式 B：只引本文件，由本文件自动加载原始 JSZip
 *     <script src="patched-jszip.js"></script>
 *     （依赖 document.write 同步注入，见下方 ORIGIN_JSZIP_URL）
 *
 * Debug 开关（三种方式，优先级从高到低）：
 *   1. 控制台：JSZipPatch.enableDebug() / JSZipPatch.disableDebug()
 *      或直接 window.__JSZIP_PATCH_DEBUG__ = true
 *   2. URL 参数：?jszip_debug=1
 *   3. 源码常量：DEBUG = true
 */
(function (global, doc) {
  "use strict";

  // ===== 配置 =====
  // 方式 B 使用：原始 JSZip 的 URL。留空则必须用方式 A。
  var ORIGIN_JSZIP_URL = "/web/service/js-zip.js";

  // 默认 debug 开关（最低优先级）
  var DEBUG = false;

  // 日志前缀，方便在控制台过滤
  var LOG_PREFIX = "[JSZip Patch]";

  // 最多剥离几层「外衣目录」，防止极端情况下无限剥离
  var MAX_STRIP_DEPTH = 10;

  // ===== Debug 开关 =====
  function isDebugEnabled() {
    if (typeof global.__JSZIP_PATCH_DEBUG__ === "boolean") {
      return global.__JSZIP_PATCH_DEBUG__;
    }
    var q = getQueryFlag("jszip_debug");
    if (q !== null) return q;
    return DEBUG;
  }

  function getQueryFlag(name) {
    try {
      var search = global.location && global.location.search;
      if (!search) return null;
      var re = new RegExp("[?&]" + name + "=([^&]*)");
      var m = re.exec(search);
      if (!m) return null;
      var v = decodeURIComponent(m[1]).toLowerCase();
      if (v === "1" || v === "true" || v === "yes" || v === "on") return true;
      if (v === "0" || v === "false" || v === "no" || v === "off") return false;
      return null;
    } catch (e) {
      return null;
    }
  }

  // ===== 日志工具 =====
  function log() {
    if (!isDebugEnabled()) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_PREFIX);
    console.log.apply(console, args);
  }

  function warn() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_PREFIX);
    console.warn.apply(console, args);
  }

  function error() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_PREFIX);
    console.error.apply(console, args);
  }

  function group(label) {
    if (!isDebugEnabled()) return;
    console.group(LOG_PREFIX + " " + label);
  }

  function groupEnd() {
    if (!isDebugEnabled()) return;
    console.groupEnd();
  }

  // ===== 垃圾条目判断 =====
  // 按段拆分判断，兼容「__MACOSX 嵌套在任意层级」的情况
  function isJunk(path) {
    var segments = path.split("/").filter(function (s) { return s !== ""; });

    // 任意一段等于 __MACOSX，即视为垃圾（包含目录条目本身）
    for (var i = 0; i < segments.length; i++) {
      if (segments[i] === "__MACOSX") return true;
    }

    var base = segments[segments.length - 1] || "";
    if (base === ".DS_Store") return true;
    if (base.indexOf("._") === 0) return true;       // AppleDouble
    if (base === "Thumbs.db") return true;
    if (base === "desktop.ini") return true;
    return false;
  }

  function removeMacOSJunk(zip) {
    var removed = [];
    Object.keys(zip.files).forEach(function (path) {
      if (isJunk(path)) {
        removed.push(path);
        zip.remove(path);
      }
    });

    if (removed.length > 0) {
      log("removeMacOSJunk: 移除了 " + removed.length + " 个垃圾条目");
      if (isDebugEnabled()) {
        removed.forEach(function (p) { console.log("  ✗ " + p); });
      }
    } else {
      log("removeMacOSJunk: 未发现垃圾条目");
    }
    return removed;
  }

  // ===== 目录正常化：循环剥离「外衣目录」 =====
  function normalizeDirectory(zip) {
    var stripped = 0;
    while (stripped < MAX_STRIP_DEPTH) {
      if (!stripOneLevel(zip)) break;
      stripped++;
    }
    if (stripped > 0) {
      log("normalizeDirectory: 共剥离 " + stripped + " 层外衣目录");
    } else {
      log("normalizeDirectory: 无需剥离");
    }
  }

  // 尝试剥离一层；成功返回 true，不满足条件返回 false
  function stripOneLevel(zip) {
    var files = zip.files;

    var filePaths = Object.keys(files).filter(function (p) {
      return !files[p].dir;
    });
    if (filePaths.length === 0) {
      log("  · 没有文件条目，停止");
      return false;
    }

    var roots = {};
    filePaths.forEach(function (p) {
      var i = p.indexOf("/");
      if (i > 0) roots[p.slice(0, i)] = true;
    });
    var rootList = Object.keys(roots);

    if (rootList.length !== 1) {
      log("  · 顶层目录不唯一，停止剥离: " + JSON.stringify(rootList));
      return false;
    }

    var root = rootList[0];
    var allUnder = filePaths.every(function (p) {
      return p.indexOf(root + "/") === 0;
    });
    if (!allUnder) {
      log("  · 存在不属于 '" + root + "/' 的文件，停止剥离");
      return false;
    }
    if (filePaths.indexOf(root) !== -1) {
      log("  · '" + root + "' 同时是文件，停止剥离");
      return false;
    }

    // 执行剥离
    Object.keys(files).forEach(function (path) {
      var entry = files[path];
      if (path === root || path === root + "/") {
        delete files[path];
        return;
      }
      if (path.indexOf(root + "/") === 0) {
        var newPath = path.slice(root.length + 1);
        if (!newPath) {
          delete files[path];
          return;
        }
        entry.name = newPath;       // 同步更新内部 name
        files[newPath] = entry;
        delete files[path];
        log("  → " + path + "  ⇒  " + newPath);
      }
    });

    log("normalizeDirectory: 剥离一层 '" + root + "/'");
    return true;
  }

  function autoCleanZip(zip) {
    log("清理前条目数: " + Object.keys(zip.files).length);
    removeMacOSJunk(zip);      // 必须先清理垃圾，再剥离目录
    normalizeDirectory(zip);
    log("清理后条目数: " + Object.keys(zip.files).length);
  }

  // ===== 打补丁 =====
  function patch(JSZip) {
    if (JSZip.__macos_patched__) {
      log("patch: 已经打过补丁，跳过");
      return JSZip;
    }

    var originalLoadAsync = JSZip.prototype.loadAsync;

    JSZip.prototype.loadAsync = function (data, options) {
      log("loadAsync: 开始加载，data =", data, "options =", options);
      return originalLoadAsync.call(this, data, options).then(function (zip) {
        log("loadAsync: 原始加载完成，准备清理");
        group("autoClean");
        try {
          autoCleanZip(zip);
        } finally {
          groupEnd();
        }
        log("loadAsync: 清理完成，返回 zip 实例");
        return zip;
      });
    };

    try {
      Object.defineProperty(JSZip, "__macos_patched__", {
        value: true,
        enumerable: false,
        configurable: false,
        writable: false
      });
    } catch (e) {
      JSZip.__macos_patched__ = true;
    }

    log("patch: 补丁已应用");
    return JSZip;
  }

  // ===== 引导 =====
  function bootstrap() {
    log("bootstrap: 开始，debug =", isDebugEnabled());

    // 情况 1：页面里已经有 JSZip（方式 A）
    if (global.JSZip) {
      log("bootstrap: 检测到 window.JSZip（方式 A）");
      patch(global.JSZip);
      return;
    }

    // 情况 2：没填 URL，只能提示
    if (!ORIGIN_JSZIP_URL) {
      warn("未检测到 window.JSZip，且未配置 ORIGIN_JSZIP_URL，请先手动引入原始 JSZip。");
      return;
    }

    // 情况 3：解析阶段，可以 document.write 同步注入原始 JSZip
    if (doc.readyState === "loading") {
      log("bootstrap: 解析阶段，同步注入 " + ORIGIN_JSZIP_URL);
      doc.write('<script src="' + ORIGIN_JSZIP_URL + '"><\/script>');
      if (global.JSZip) {
        log("bootstrap: 同步注入成功");
        patch(global.JSZip);
        return;
      }
      warn("bootstrap: 同步注入后仍未见 window.JSZip，回退异步加载");
    }

    // 情况 4：回退异步加载
    log("bootstrap: 异步加载 " + ORIGIN_JSZIP_URL);
    var s = doc.createElement("script");
    s.src = ORIGIN_JSZIP_URL;
    s.onload = function () {
      if (global.JSZip) {
        log("bootstrap: 异步加载成功");
        patch(global.JSZip);
      } else {
        error("bootstrap: 异步加载完成，但未找到 window.JSZip");
      }
    };
    s.onerror = function () {
      error("bootstrap: 加载原始 JSZip 失败：" + ORIGIN_JSZIP_URL);
    };
    (doc.head || doc.documentElement).appendChild(s);
  }

  // ===== 对外控制台 API =====
  global.JSZipPatch = {
    enableDebug: function () {
      global.__JSZIP_PATCH_DEBUG__ = true;
      console.log(LOG_PREFIX + " debug 已开启");
    },
    disableDebug: function () {
      global.__JSZIP_PATCH_DEBUG__ = false;
      console.log(LOG_PREFIX + " debug 已关闭");
    },
    isDebugEnabled: isDebugEnabled
  };

  bootstrap();
})(window, document);