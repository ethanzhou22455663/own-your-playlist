// src/scanner.ts
// 职责：扫描音乐文件夹，读取每首歌的 metadata。
// 新项目没有独立的"歌单文件"，歌单信息直接存在每首歌曲文件里。

import { readdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { parseFile } from "music-metadata";

// 第一步只支持 MP3。
// 后续加 FLAC / M4A 时，只需要在这里加扩展名、并在写入时换对应的库。
const SUPPORTED_EXTENSIONS = new Set([".mp3"]);

// 一个音乐文件在扫描后的表示。
// 注意：filePath 只在本机使用，用来打开文件；
// title / artist / album / trackNumber / genre 才是会从文件里读出来的 metadata。
export interface MusicFile {
  filePath: string;
  title: string;
  artist: string;
  album: string;
  trackNumber: number;
  genre: string[];
  // composer can be multiple people, so it is an array.
  // Default to an empty array when the file has no composer tag.
  composer: string[];
  durationSec: number;
}

// 扫描指定文件夹，返回里面所有支持的音频文件。
// Promise<MusicFile[]> 表示：这个函数是异步的，最后给你一个 MusicFile 数组。
export async function scanMusicFolder(folderPath: string): Promise<MusicFile[]> {
  // readdir 的 { withFileTypes: true } 让我们拿到每个条目是文件还是文件夹。
  const entries = await readdir(folderPath, { withFileTypes: true });
  const tracks: MusicFile[] = [];

  for (const entry of entries) {
    // 跳过子文件夹，只处理当前文件夹里的文件。
    if (!entry.isFile()) continue;

    // extname 取扩展名，比如 "晴天.mp3" -> ".mp3"。
    // toLowerCase() 让我们同时支持 ".MP3"、".Mp3"。
    const ext = extname(entry.name).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

    // join 把文件夹路径和文件名拼成完整路径。
    // Windows 下会是 "D:\\Projects\\...\\music\\晴天.mp3"。
    const filePath = join(folderPath, entry.name);

    // parseFile 是 music-metadata 提供的函数：给它一个路径，它返回文件里的 metadata。
    // 这里我们先把它当黑盒用，知道它能读出 title / artist / album / trackNumber / genre / duration 即可。
    const metadata = await parseFile(filePath);

    tracks.push({
      filePath,
      // ?? 是"空值合并运算符"：如果左边是 null 或 undefined，就用右边的默认值。
      // 如果文件没写 title，就用文件名兜底，至少知道是什么。
      title: metadata.common.title ?? entry.name,
      artist: metadata.common.artist ?? "未知歌手",
      album: metadata.common.album ?? "",
      trackNumber: metadata.common.track.no ?? 0,
      genre: metadata.common.genre ?? [],
      // composer is read from metadata.common.composer.
      // Fallback to an empty array so the field is always a string array.
      composer: metadata.common.composer ?? [],
      // duration 在 metadata.format 里，单位是秒。
      durationSec: metadata.format.duration ?? 0,
    });
  }

  // 排序：先按 album 名字母顺序分组，同一 album 内按 trackNumber 从小到大排。
  // 这样打印出来就像一张专辑的歌单顺序。
  return tracks.sort((a, b) => {
    if (a.album !== b.album) {
      return a.album.localeCompare(b.album);
    }
    return a.trackNumber - b.trackNumber;
  });
}
