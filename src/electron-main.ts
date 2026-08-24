// src/electron-main.ts
// Electron 主进程：负责创建桌面窗口。
// 这是应用的"后台"，窗口创建后它仍然运行。

import { app, BrowserWindow,ipcMain, Menu } from 'electron';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { scanMusicFolder } from './scanner.ts';

// ES Module 里没有 Node 传统的 __dirname，这两行手动算出来。
// __dirname 就是当前文件所在的目录（src/）
const __dirname = dirname(fileURLToPath(import.meta.url));

// handler 接收 folderPath
ipcMain.handle('scan-music', async (_event, folderPath) => {
  const tracks = await scanMusicFolder(folderPath);
  return tracks;
});

// 等 Electron 初始化完成后再创建窗口。
// 用 async IIFE（立即执行的异步函数）是因为主进程里不能直接顶层写 await。
(async () => {
  await app.whenReady();

  // 打开一个 800x600 的窗口。
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
     webPreferences: {
      // preload 脚本在窗口加载页面之前执行，用来搭建安全桥梁。
      preload: join(__dirname, 'preload.cjs'),
    },
  });

  mainWindow.setMenu(null);          // 去掉窗口菜单（Win/Linux）
  Menu.setApplicationMenu(null);     // 去掉应用菜单（macOS）

  //app.getAppPath() 返回 package.json 所在的目录。
  // 开发时是项目根目录，打包后是 app.asar 或 resources/app 目录。
  // 只要打包时把 index.html 和 package.json 放一起，就能找到。
  mainWindow.loadFile(join(app.getAppPath(), 'index.html'));

})();
