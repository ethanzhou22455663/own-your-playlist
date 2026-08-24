// src/writer.ts
// 职责：把 metadata 写回 MP3 文件。
// 这里只封装 node-id3，让 main.ts 调用起来更简单。

import NodeID3 from "node-id3";

// 我们想改哪些 tag，就传哪些字段；不传的字段保持原样。
export interface TagUpdate {
  title?: string;
  artist?: string;
  album?: string;
  // node-id3 要求 trackNumber 是字符串，比如 "1" 或 "1/10"。
  trackNumber?: string;
  genre?: string;
}

export async function writeTags(filePath: string, tags: TagUpdate): Promise<void> {
  // NodeID3.Promise.update 只更新传入的字段，不会清空文件里已有的其他 tag。
  // 这是"最小惊讶"原则：用户只想改 album，结果把封面全删了，就不好了。
  await NodeID3.Promise.update(tags, filePath);
}
