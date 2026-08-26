 // ========== 1. 拿到页面元素 ==========
  const tbody = document.getElementById('tracklist-body');
  const songCount = document.getElementById('song-count');
  const scanBtn = document.getElementById('scan-btn');
  const musicPathInput = document.getElementById('music-path');
  const editBtn = document.getElementById('edit-btn');
  const selectionInfo = document.getElementById('selection-info');
  const editPanel = document.getElementById('edit-panel');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('edit-panel-close');
  const saveBtn = document.getElementById('save-btn');
  const panelTitle = document.getElementById('panel-title');
  const panelSubtitle = document.getElementById('panel-subtitle');
  const editTitle = document.getElementById('edit-title');
  const editArtist = document.getElementById('edit-artist');
  const editAlbum = document.getElementById('edit-album');
  const editGenre = document.getElementById('edit-genre');
  const editComposer = document.getElementById('edit-composer');
  const browsePathBtn = document.getElementById('browse-path-btn');
  const selectAllBox = document.getElementById('select-all-box');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');


  // ========== 2. 数据仓库 ==========
  // allTracks：扫描得到的完整歌曲列表（搜索时的“总仓库”）
  let allTracks = [];
  // tracks：当前页面上显示的歌曲列表（可能被搜索过滤）
  let tracks = [];
  // ========== 选中状态 ==========
  let selectedTracks = [];  // 当前被选中的歌曲对象
  // 记录用户编辑过的字段
  const editedFields = new Set();

  // ========== 3. 小工具函数 ==========

  // 把秒数变成 "4:29" 这种格式
  // 289 秒 → 4 分 49 秒 → "4:49"
  function formatDuration(totalSeconds) {
    if (!totalSeconds || totalSeconds < 0) return '0:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    // padStart(2, '0')：如果秒数只有一位，前面补 0，比如 5 → "05"
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // 把 ["流行", "摇滚"] 变成 "流行, 摇滚"
  // 如果数组为空，返回空字符串，表格里就不显示
  function formatArray(arr) {
    if (!arr || arr.length === 0) return '';
    return arr.join(', ');
  }

  
function getCommonString(tracks, field) {
  if (tracks.length === 0) return '';
  const first = tracks[0][field];
  const allSame = tracks.every(t => t[field] === first);
  return allSame ? first : '';
}

function getCommonArray(tracks, field) {
  if (tracks.length === 0) return '';
  const first = tracks[0][field].join(', ');
  const allSame = tracks.every(t => t[field].join(', ') === first);
  return allSame ? first : '';
}


   // ========== 搜索功能 ==========
// 根据搜索框内容过滤当前显示列表
// query: 用户输入的搜索词
function applySearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (query === '') {
    // 没有输入时，显示全部歌曲
    tracks = allTracks;
  } else {
    // 只保留标题包含搜索词的歌
    tracks = allTracks.filter(track =>
      track.title.toLowerCase().includes(query)
    );
  }

  // 过滤后重新渲染表格
  renderTracks();
}

   // ========== 4. 渲染函数 ==========
  function renderTracks() {
    // 先清空旧内容
    tbody.innerHTML = '';

    tracks.forEach((track, index) => {
      // 创建一行
      const tr = document.createElement('tr');

      tr.dataset.id = track.id;
      tr.dataset.index = index;

      // 序号用列表里的位置 + 1
      const number = index + 1;
      const isSelected = selectedTracks.some(t => t.id === track.id);

      tr.innerHTML = `
        <td><div class="checkbox ${isSelected ? 'checked' : ''}">${isSelected ? '✓' : ''}</div></td>
        <td class="track-number">${number}</td>
        <td class="track-title">${track.title}</td>
        <td class="track-artist">${track.artist}</td>
        <td>${track.album}</td>
        <td>${formatArray(track.genre)}</td>
        <td>${formatDuration(track.durationSec)}</td>
      `;


    // 点击整行也切换选中
    tr.addEventListener('click', () => {
    toggleSelection(track);
    });

    // 勾选框点击时切换选中状态
    const checkbox = tr.querySelector('.checkbox');
    if (checkbox) {
    checkbox.addEventListener('click', (e) => {
    e.stopPropagation();  // 阻止事件冒泡到行
    toggleSelection(track);
    });
    }

      tbody.appendChild(tr);
    });

    updateToolbar();
  }


  // 切换一首歌的选中状态
function toggleSelection(track) {
  const index = selectedTracks.findIndex(t => t.id === track.id);

  if (index >= 0) {
    // 已经在数组里，移除（取消选中）
    selectedTracks.splice(index, 1);
  } else {
    // 不在数组里，加入（选中）
    selectedTracks.push(track);
  }

  renderTracks();
}


// 全选 / 取消全选
function toggleSelectAll() {
  if (selectedTracks.length === tracks.length && tracks.length > 0) {
    // 如果已经全选，就清空
    selectedTracks = [];
  } else {
    // 否则选中当前显示的所有歌曲
    selectedTracks = [...tracks];
  }
  renderTracks();
}



function updateToolbar() {
  if (selectedTracks.length > 0) {
    selectionInfo.textContent = `已选择 ${selectedTracks.length} 首`;
  } else {
    selectionInfo.textContent = '未选择';
  }

  songCount.textContent = `${tracks.length} 首歌曲`;
  editBtn.disabled = selectedTracks.length === 0;

   // 更新全选框状态
  const allSelected = tracks.length > 0 && selectedTracks.length === tracks.length;
  selectAllBox.classList.toggle('checked', allSelected);
  selectAllBox.textContent = allSelected ? '✓' : '';
}

// 打开右侧编辑面板
function openEditPanel() {
  if (selectedTracks.length === 0) return;

  // 每次打开面板时清空编辑记录
  editedFields.clear();

  if (selectedTracks.length === 1) {
    const track = selectedTracks[0];
     // 面板标题显示歌名，副标题显示歌手和专辑
    panelTitle.textContent = track.title;
    panelSubtitle.textContent = `${track.artist} · ${track.album}`;
    editTitle.value = track.title;
    editArtist.value = track.artist;
    editAlbum.value = track.album;
    editGenre.value = track.genre.join(', ');
    editComposer.value = track.composer.join(', ');
  } else {
    panelTitle.textContent = `编辑 ${selectedTracks.length} 首歌曲`;
    panelSubtitle.textContent = '批量编辑：已修改的字段会应用到所有选中歌曲';
    setEditField(editTitle, getCommonString(selectedTracks, 'title'));
    setEditField(editArtist, getCommonString(selectedTracks, 'artist'));
    setEditField(editAlbum, getCommonString(selectedTracks, 'album'));
    setEditField(editGenre, getCommonArray(selectedTracks, 'genre'));
    setEditField(editComposer, getCommonArray(selectedTracks, 'composer'));
  }

  // 显示面板和遮罩
  editPanel.classList.add('open');
  overlay.classList.add('show');
}

// 辅助：设置输入框值和 placeholder
function setEditField(input, commonValue) {
  if (commonValue === '') {
    // 共同值为空（包括"值不同"的情况）：placeholder 提示多个值
    input.value = '';
    input.placeholder = '多个值';
  } else {
    input.value = commonValue;
    input.placeholder = '';
  }
}

// 关闭右侧编辑面板
function closeEditPanel() {
  editPanel.classList.remove('open');
  overlay.classList.remove('show');
}



    // ========== 5. 扫描按钮 ==========
    scanBtn.addEventListener('click', async () => {
    const folderPath = musicPathInput.value.trim();

    try {
      // 调用 preload 暴露的接口，把 folderPath 传进主进程
      const scanned = await window.electronAPI.scanMusic(folderPath);

      // 原始结果放进总仓库，也作为当前显示列表
      allTracks = scanned;
      tracks = allTracks;
      selectedTracks = [];   //重新扫描后清空选择

      renderTracks();
    } catch (err) {
      console.error('扫描失败', err);
      alert('扫描失败：' + err.message);
    }
  });

  // 保存按钮：把输入框内容写回 MP3 文件
saveBtn.addEventListener('click', async () => {
  if (selectedTracks.length === 0) return;

  const track = selectedTracks[0];

  // 只收集用户编辑过的字段
  const tags = {};
  if (editedFields.has('title')) tags.title = editTitle.value;
  if (editedFields.has('artist')) tags.artist = editArtist.value;
  if (editedFields.has('album')) tags.album = editAlbum.value;
  if (editedFields.has('genre')) tags.genre = editGenre.value;
  if (editedFields.has('composer')) tags.composer = editComposer.value;

    if (Object.keys(tags).length === 0) {
    closeEditPanel();
    return; // 什么都没改，直接关闭
  }

  try {
    // 逐个保存到所有选中歌曲
    for (const track of selectedTracks) {
      await window.electronAPI.saveTags(track.filePath, tags);
    }

    closeEditPanel();
    editedFields.clear();

    // 重新扫描，显示最新数据
    const folderPath = musicPathInput.value.trim();
    const scanned = await window.electronAPI.scanMusic(folderPath);
    allTracks = scanned;
    tracks = allTracks;
    selectedTracks = [];
    renderTracks();
  } catch (err) {
    console.error('保存失败', err);
    alert('保存失败：' + err.message);
  }
});

browsePathBtn.addEventListener('click', async () => {
  const folderPath = await window.electronAPI.selectFolder();
  if (folderPath) {
    musicPathInput.value = folderPath;
    scanBtn.click(); // 自动触发扫描
  }
});


editBtn.addEventListener('click', openEditPanel);
closeBtn.addEventListener('click', closeEditPanel);
overlay.addEventListener('click', closeEditPanel);
selectAllBox.addEventListener('click', toggleSelectAll);

// 记录用户在编辑面板里动过哪些字段
// 只有这些字段才会被保存
editTitle.addEventListener('input', () => editedFields.add('title'));
editArtist.addEventListener('input', () => editedFields.add('artist'));
editAlbum.addEventListener('input', () => editedFields.add('album'));
editGenre.addEventListener('input', () => editedFields.add('genre'));
editComposer.addEventListener('input', () => editedFields.add('composer'));
searchBtn.addEventListener('click', applySearch);


