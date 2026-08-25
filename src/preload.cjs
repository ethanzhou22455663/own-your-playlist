// src/preload.cjs
// Preload 脚本：在渲染进程里提前运行，给网页暴露一个安全接口。

const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld 把对象挂到网页的 window 上。
// 网页 JS 可以通过 window.electronAPI.scanMusic() 调用。
contextBridge.exposeInMainWorld('electronAPI', {
  scanMusic: (folderPath) => ipcRenderer.invoke('scan-music', folderPath),
  // 新增：saveTags 会把文件路径和标签对象发送到主进程。
  // 它返回一个 Promise，主进程保存成功后 resolve，失败则 reject。
  saveTags: (filePath, tags) => ipcRenderer.invoke('save-tags', filePath, tags),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
});
