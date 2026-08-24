# Learning Progress

> This file lives in the project folder. It is updated by the teaching skill after every meaningful step.

## Last Updated
2026-08-25

## Current Project
Own Your Playlist — a desktop music tag editor. The app lets the user scan a local music folder, select multiple MP3 files, and batch-edit their metadata (title, artist, album, genre, composer) through a graphical interface.

Current status: Electron window opens and loads index.html. Minimal ping/pong IPC verified working. Replaced ping with real `scan-music` IPC that calls `scanner.ts` from the main process. Fixed ESM/CommonJS module mismatch by loading `music-metadata` via dynamic `await import()`. Designed a full UI prototype (`prototype.html`) for the batch tag editor: Apple Music-style dark layout, sidebar navigation, multi-select with checkbox/Cmd/Shift/range selection, batch edit slide-over panel, drag-to-reorder, and iterated color scheme to a monochrome/white accent.

## Where the Next Lesson Starts
Restore interactions and wire batch editing on top of the real tracklist:
1. Restore multi-select interactions on real data: checkbox toggle, Ctrl/Cmd single toggle, Shift range selection, and select-all.
2. Wire the batch-edit slide-over panel so it opens with the currently selected tracks and shows common field values.
3. Implement a `write-tags` IPC channel that calls the existing `writer.ts` from the main process.
4. Collect changed fields from the panel, send selected file paths + updates to the main process, and save them back to MP3 files.
5. Polish: remove the default window menu and consider switching `loadFile` path to `app.getAppPath()` for packaging safety.

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

### 2026-08-25 · Lesson 7: Integrating prototype UI and rendering real tracks
- Learned: How to integrate a standalone `prototype.html` design into the real Electron `index.html`; how to pass arguments through IPC (renderer → preload → main process); why `_event` is prefixed with `_` when unused; how to use `folderPath || './music'` for default values; why `filePath` is a good unique ID for scanned tracks; why the `#` column should show list position (`index + 1`) instead of embedded `trackNumber`; how to format `durationSec` into `m:ss` with `padStart`; how to format `genre` arrays with `join` for display; that Electron supports Windows/macOS/Linux but not iOS/iPadOS; how `npm run electron` maps to `electron .`; the difference between `__dirname` (file directory) and `app.getAppPath()` (app root directory).
- Mastery: can implement with hints / can explain IPC argument flow / can adapt rendering logic / still learning DOM manipulation and CSS layout details.
- Black-boxed: `music-metadata` internal parsing; `node-id3` ID3 frame encoding; CSS Grid/Flexbox layout engine internals; Electron `contextBridge` implementation details; Electron packaging internals.
- Project progress: `index.html` now uses the prototype's sidebar + tracklist layout; `scan-music` IPC accepts `folderPath` and returns real scanned tracks; renderer renders real tracks with formatted duration and genre; app verified scanning and displaying `./music` MP3 files.
- Needs review: IPC argument passing; DOM element creation and `dataset` usage; `join` / `padStart` / `Math.floor` formatting helpers; `__dirname` vs `app.getAppPath()` for production loading; menu removal APIs.

### 2026-08-24 · Lesson 6: IPC implementation, dynamic imports, and UI prototype
- Learned: How to implement a minimal ping/pong IPC and verify the button displays "pong"; how to replace ping with a real `scan-music` IPC channel that calls `scanner.ts` from the main process; why `await import("music-metadata")` fixes ESM/CommonJS module mismatch in Electron; how to design a batch tag editor UI with multi-select (checkbox, Ctrl/Cmd, Shift range, select-all), drag-to-reorder, and a slide-over batch edit panel; how to use CSS variables for a design system; how to iterate color scheme based on visual feedback.
- Mastery: can read it / can implement IPC with hints / can copy and adapt CSS layouts / still learning CSS from scratch.
- Black-boxed: `music-metadata` internal parsing; `node-id3` ID3 frame encoding; CSS Grid/Flexbox layout engine internals; HTML5 drag-and-drop API internals; Electron `contextBridge` implementation details.
- Project progress: `scan-music` IPC works end-to-end; `prototype.html` created as a standalone Apple Music-style batch tag editor mock with white/monochrome accent; color scheme finalized by the student to white/gray accent.
- Needs review: dynamic imports vs static imports; CSS variables and selectors; event listeners and event delegation; batch editing logic (only change non-empty fields); integrating prototype HTML into real Electron `index.html`.

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
- dynamic imports vs static imports
- CSS variables and selectors
- event listeners and event delegation
- batch editing logic (only change non-empty fields)
- integrating prototype HTML into real Electron `index.html`
- IPC argument passing
- DOM element creation and `dataset` usage
- `join` / `padStart` / `Math.floor` formatting helpers
- `__dirname` vs `app.getAppPath()` for production loading
- menu removal APIs
