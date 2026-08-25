// src/electron-main.ts
// Electron 主进程：负责创建桌面窗口。
// 这是应用的"后台"，窗口创建后它仍然运行。

import { app, BrowserWindow,ipcMain, Menu } from 'electron';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { scanMusicFolder } from './scanner.ts';
// 新增：从 writer.ts 引入写入函数和它的参数类型。
import { writeTags, type TagUpdate } from './writer.ts';

// ES Module 里没有 Node 传统的 __dirname，这两行手动算出来。
// __dirname 就是当前文件所在的目录（src/）
const __dirname = dirname(fileURLToPath(import.meta.url));

// handler 接收 folderPath
ipcMain.handle('scan-music', async (_event, folderPath) => {
  const tracks = await scanMusicFolder(folderPath);
  return tracks;
});

// 新增：处理保存标签请求。
// 参数：
//   filePath：要修改的 MP3 文件完整路径。
//   tags：一个 TagUpdate 对象，只包含用户实际填写过的字段。
ipcMain.handle('save-tags', async (_event, filePath: unknown, tags: unknown) => {
  // 因为 IPC 那头的数据来自网页，主进程这边要做最基本的类型检查。
  // 如果类型不对，直接抛出错误，让网页那边 catch。
  if (typeof filePath !== 'string') {
    throw new Error('filePath 必须是字符串');
  }
  if (typeof tags !== 'object' || tags === null) {
    throw new Error('tags 必须是对象');
  }

  //因为 raw 是网页传来的"原始输入"，类型是 Record<string, unknown>
  //update 是我们验证和转换后的结果，类型是 TagUpdate，只包含已知字段，并且值都是 string。
  //分两步的原因是：不要直接修改/信任原始输入。我们要把脏的输入洗干净，再交给 writeTags
  const raw = tags as Record<string, unknown>;
  const update: TagUpdate = {};

  //只有字段类型确实是 string 时才写入。
  //空字符串也是 string，所以会被写入，实现"清空 tag"的语义。
  if (typeof raw.title === 'string') update.title = raw.title;
  if (typeof raw.artist === 'string') update.artist = raw.artist;
  if (typeof raw.album === 'string') update.album = raw.album;
  if (typeof raw.trackNumber === 'string') update.trackNumber = raw.trackNumber;
  if (typeof raw.genre === 'string') update.genre = raw.genre;
  if (typeof raw.composer === 'string') update.composer = raw.composer;

  await writeTags(filePath, update);

  // 返回一个简单结果对象，网页可以据此提示"保存成功"。
  return { success: true };
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
