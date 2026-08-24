// src/preload.cjs
// Preload 脚本：在渲染进程里提前运行，给网页暴露一个安全接口。

const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld 把对象挂到网页的 window 上。
// 网页 JS 可以通过 window.electronAPI.ping() 调用。
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
});
