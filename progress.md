# Learning Progress

> This file lives in the project folder. It is updated by the teaching skill after every meaningful step.

## Last Updated
2026-08-23

## Current Project
Own Your Playlist — a desktop music tag editor. The app will let the user select local MP3 files and batch-edit their album, genre, or composer tags through a graphical interface.

Current status: project direction pivoted from CLI/web server to Electron desktop app. Electron is installed. `src/scanner.ts` now reads the `composer` field. The Electron entry files and UI have not been created yet.

## Where the Next Lesson Starts
Build the smallest possible Electron app, one tiny step at a time:
1. Create `src/electron-main.cjs`, the two-line bridge that lets Electron load TypeScript.
2. Create the smallest `src/main.ts` that opens an empty window.
3. Run `npm run electron` and confirm a window appears.
4. Only then create `index.html` and load it into the window.

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
- async/await flow
- sort comparator return values
- `metadata.common` vs `metadata.format` responsibilities
- `type TagUpdate` usage
- benefits of helper functions for reducing duplication
- edge cases in command-line argument parsing
- Electron main process vs renderer process
- npm scripts and devDependencies
- CommonJS vs ES modules (only if needed for the bridge file)
