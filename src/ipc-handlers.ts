// src/ipc-handlers.ts
// 注册所有 IPC 处理器。
// 主进程只需要在启动早期调用 registerIpcHandlers() 即可。

import { ipcMain, dialog } from 'electron';
import { scanMusicFolder } from './scanner.ts';
import { writeTags, type TagUpdate } from './writer.ts';

export function registerIpcHandlers(): void { 
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


ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (result.canceled) {
    return null;
  }
  return result.filePaths[0];
});

 }
