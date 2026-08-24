// src/electron-main.ts
// Electron 主进程：负责创建桌面窗口。
// 这是应用的"后台"，窗口创建后它仍然运行。

import { app, BrowserWindow,ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ES Module 里没有 Node 传统的 __dirname，这两行手动算出来。
// __dirname 就是当前文件所在的目录（src/）
const __dirname = dirname(fileURLToPath(import.meta.url));

// 等 Electron 初始化完成后再创建窗口。
// 用 async IIFE（立即执行的异步函数）是因为主进程里不能直接顶层写 await。
(async () => {
  await app.whenReady();

  // 注册 IPC 处理器。
// 当渲染进程发来 'ping' 请求时，返回 'pong'。
ipcMain.handle('ping', () => {
  return 'pong';
});

  // 打开一个 800x600 的窗口。
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
     webPreferences: {
      // preload 脚本在窗口加载页面之前执行，用来搭建安全桥梁。
      preload: join(__dirname, 'preload.cjs'),
    },
  });

 // join(__dirname, '..', 'index.html') 表示：从 src/ 回到上级目录，再找 index.html
  // Windows 下结果是 D:\leidian\own-your-playlist\index.html
  mainWindow.loadFile(join(__dirname, '..', 'index.html'));

})();
