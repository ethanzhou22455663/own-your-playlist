// src/main.ts
// 程序入口。
// 目前支持四种模式：
//   1. 扫描模式：npm start
//      扫描 music/ 文件夹，打印每首歌的 metadata。
//   2. 设置 album 模式：npm start -- --set-album "歌单名"
//   3. 设置 trackNumber 模式：npm start -- --set-track-number "1"
//   4. 设置 genre 模式：npm start -- --set-genre "歌单名"
//
//   2/3/4 都会把 music/ 里所有 MP3 的对应 tag 改成指定值。

import { access } from "node:fs/promises";
import { scanMusicFolder } from "./scanner.ts";
import { writeTags, type TagUpdate } from "./writer.ts";

const MUSIC_FOLDER = "./music";

// 检查 music/ 文件夹是否存在。
try {
  await access(MUSIC_FOLDER);
} catch {
  console.error(`找不到音乐文件夹：${MUSIC_FOLDER}`);
  console.error("请在项目根目录建一个 music/ 文件夹，放进 MP3 文件后再运行。");
  process.exit(1);
}

// 取用户传入的命令行参数。
// process.argv[0] 是 node 路径，[1] 是脚本路径，从 [2] 开始才是用户参数。
const args = process.argv.slice(2);

// 辅助函数：把某个 tag 应用到 music/ 下所有 MP3。
// 这样 --set-album / --set-track-number / --set-genre 不用重复写三遍。
async function applyTagToAllFiles(tagUpdate: TagUpdate, description: string): Promise<void> {
  const tracks = await scanMusicFolder(MUSIC_FOLDER);

  if (tracks.length === 0) {
    console.log("music/ 文件夹里没有支持的 MP3 文件，无需修改。");
    process.exit(0);
  }

  for (const track of tracks) {
    await writeTags(track.filePath, tagUpdate);
    console.log(`已设置 ${description} -> ${track.filePath}`);
  }

  console.log(`\n完成，共修改 ${tracks.length} 个文件。`);
}

// 模式 2：--set-album "歌单名"
if (args[0] === "--set-album" && args[1]) {
  await applyTagToAllFiles({ album: args[1] }, `album: "${args[1]}"`);
  process.exit(0);
}

// 模式 3：--set-track-number "数字"
if (args[0] === "--set-track-number" && args[1]) {
  await applyTagToAllFiles({ trackNumber: args[1] }, `trackNumber: "${args[1]}"`);
  process.exit(0);
}

// 模式 4：--set-genre "歌单名"
if (args[0] === "--set-genre" && args[1]) {
  await applyTagToAllFiles({ genre: args[1] }, `genre: "${args[1]}"`);
  process.exit(0);
}

// 模式 1：默认扫描打印
const tracks = await scanMusicFolder(MUSIC_FOLDER);

console.log(`扫描完成，共找到 ${tracks.length} 首 MP3：`);
console.log("---");

for (const track of tracks) {
  console.log(`文件: ${track.filePath}`);
  console.log(`  歌名: ${track.title}`);
  console.log(`  歌手: ${track.artist}`);
  console.log(`  专辑: ${track.album || "(无)"}`);
  console.log(`  序号: ${track.trackNumber}`);
  console.log(`  风格: ${track.genre.join(", ") || "(无)"}`);
  console.log(`  时长: ${track.durationSec.toFixed(2)} 秒`);
  console.log("---");
}
