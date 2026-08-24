// src/electron-main.cjs
// Electron 启动桥：Electron 只认 .cjs/.js，但我们的主进程写在 TypeScript 里。
// 注册 tsx 加载器，让它能把 .ts 实时翻译成 JavaScript。
require('tsx/cjs');
// 把控制权交给真正的 Electron 主进程文件。
module.exports = require('./electron-main.ts');
