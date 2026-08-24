# Learning Progress

> This file lives in the project folder. It is updated by the teaching skill after every meaningful step.

## Last Updated
2026-08-24

## Current Project
Own Your Playlist — a desktop music tag editor. The app will let the user select local MP3 files and batch-edit their album, genre, or composer tags through a graphical interface.

Current status: Electron window now opens and loads index.html. IPC (Inter-Process Communication) concept introduced to connect renderer UI with main process. Ping/pong example explained but not yet fully implemented/verified. Next lesson will review JavaScript basics before continuing IPC.

## Where the Next Lesson Starts
Review JavaScript fundamentals and complete the first IPC example:
1. Re-explain objects, properties, functions, and destructuring with simple non-Electron examples.
2. Re-explain IPC architecture: main process vs renderer process vs preload bridge.
3. Implement the minimal ping/pong IPC and confirm the button displays "pong".
4. Only then replace ping with actual music folder scanning.

Each step must be fully explained and confirmed before moving on.

## Learning Log
<!-- Append one block after each lesson:
### YYYY-MM-DD · Topic
- Learned:
- Mastery level: just heard of it / can read it / can write it with hints / can use it independently / can teach it
- Black-boxed (explained roughly, not required to master):
- Project progress:
- Needs review:
-->

### 2026-08-24 · Lesson 5: Electron window, page loading, and IPC introduction
- Learned: How to create an Electron bridge file (electron-main.cjs) so Electron can load TypeScript; how to open a BrowserWindow from the main process; how to load an index.html file into the window; the difference between URL and file path on Windows; the architecture of IPC (main process, renderer process, preload script); the roles of contextBridge, ipcRenderer, and ipcMain; JavaScript fundamentals including require vs import, objects/properties/functions, and destructuring.
- Mastery: can read it / can describe the architecture / still learning JavaScript syntax fundamentals.
- Black-boxed: tsx loader internals; Electron binary download internals; contextBridge implementation details; extract-zip internals.
- Project progress: src/electron-main.cjs and src/electron-main.ts created; window opens and loads index.html; IPC ping/pong concept explained but not yet verified working.
- Needs review: JavaScript objects/properties/functions; destructuring syntax; require vs import; async/await; IPC main/renderer/preload flow.

### 2026-08-23 · Lesson 4: Electron desktop GUI planning and setup
- Learned: The difference between CLI, web server, and desktop app architectures; why a browser page cannot write local files; what Electron is and why it fits a local music editor; how npm scripts and devDependencies work; how to use an npm mirror when a package download fails.
- Mastery: just heard of it / can describe the architecture choice but cannot yet write Electron code independently.
- Black-boxed: tsx loader internals; CommonJS vs ES module technical details; Electron internal window lifecycle.
- Project progress: Scanner reads `composer`. Electron installed. `package.json` and `.npmrc` configured. Electron entry files and UI not yet written.
- Needs review: every new term introduced today should be re-explained from scratch next lesson using plain language and analogies.

### 2026-08-22 · Lesson 3: Pivot to metadata-based playlists + scanner
- Learned: Project pivot from "player + external playlist files" to "edit embedded song metadata as playlists"; using `music-metadata` as a black box to read audio metadata; Node folder scanning (`readdir` / `join` / `extname`); nullish coalescing `??`; sort comparators; metadata fields (album / genre / trackNumber / composer) as playlist containers.
- Mastery: can read it / actively questioned whether a separate identity layer was needed, and derived that the new project can use a single merged model.
- Black-boxed: `music-metadata` internal parsing logic; `node-id3` internal ID3 frame encoding logic.
- Project progress: Old files cleaned up; `scanner.ts` + `writer.ts` + `main.ts` working, supporting read/write of album / trackNumber / genre.
- Needs review: async/await flow; sort comparator return values; `metadata.common` vs `metadata.format` responsibilities.

### 2026-08-22 · Lesson 3 (continued): Writing metadata back with node-id3
- Learned: `node-id3` Promise API; `process.argv` command-line argument parsing; writing metadata actually changes the MP3 file; exit code `process.exit(1)` usage; extracting `applyTagToAllFiles` helper to remove duplicate code (DRY).
- Mastery: can read it / can explain the write flow and why the helper was extracted, but might still need hints when writing independently.
- Black-boxed: `node-id3` internal encoding details; ID3 frame details.
- Project progress: `main.ts` supports `--set-album`, `--set-track-number`, `--set-genre`; verified all three fields can be written and read back.
- Needs review: `type TagUpdate` usage; benefits of helper functions for reducing duplication; edge cases in command-line argument parsing.

## Review List
<!-- Aggregate "needs review" items from all log blocks -->
- JavaScript objects/properties/functions
- Destructuring syntax
- require vs import
- async/await flow
- IPC main/renderer/preload flow
- contextBridge / ipcRenderer / ipcMain roles
- fileURLToPath and Windows path handling
- Electron main process vs renderer process
- npm scripts and devDependencies
- CommonJS vs ES modules
- sort comparator return values
- `metadata.common` vs `metadata.format` responsibilities
- `type TagUpdate` usage
- benefits of helper functions for reducing duplication
- edge cases in command-line argument parsing
