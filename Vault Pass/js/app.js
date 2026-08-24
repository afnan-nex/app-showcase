/**
 * VaultPass - Core Application Controller (Production-Grade)
 * 
 * Manages full zero-knowledge lifecycle:
 * - Master password authentication & PBKDF2 key derivation
 * - In-memory decrypted cache & automatic wiping on lock/idle
 * - Activity monitoring for auto-lock & tab visibility security
 * - Clipboard security with auto-wipe timer
 * - Mobile responsive drawer & view transitions (320px to 4K)
 * - Security health audit engine with issue resolution
 * - Encrypted & Plain import/export with schema validation
 * - Accessible keyboard shortcuts & dialog management
 */

const VaultApp = (() => {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    cryptoKey: null,
    salt: null,
    unlocked: false,
    entries: [], // Decrypted in-memory entries
    folders: [], // Decrypted folders
    currentFilter: { kind: 'all' }, // { kind: 'all'|'favorites'|'type'|'folder'|'tag', value: string }
    searchQuery: '',
    sortBy: 'title-asc',
    selectedId: null,
    settings: {
      autoLockMinutes: 5,
      clipboardClearSeconds: 30,
      theme: 'dark',
      lockOnVisibilityHidden: true,
      showPasswordStrength: true
    },
    autoLockRemainingSeconds: 300,
    autoLockTimer: null,
    clipboardTimer: null,
    totpTimer: null
  };

  // --- DOM ELEMENTS CACHE ---
  const el = {};

  function cacheDOMElements() {
    // Views
    el.viewAuth = document.getElementById('view-auth');
    el.viewApp = document.getElementById('view-app');
    el.authSubtitle = document.getElementById('auth-subtitle');
    el.formUnlock = document.getElementById('form-unlock');
    el.formSetup = document.getElementById('form-setup');
    el.unlockPassword = document.getElementById('unlock-password');
    el.setupPassword = document.getElementById('setup-password');
    el.setupConfirmPassword = document.getElementById('setup-confirm-password');
    el.setupHint = document.getElementById('setup-hint');
    el.setupLoadDemo = document.getElementById('setup-load-demo');
    el.btnShowHint = document.getElementById('btn-show-hint');
    el.btnResetVaultLink = document.getElementById('btn-reset-vault-link');
    el.setupPwStrengthBar = document.getElementById('setup-pw-strength-bar');
    el.setupPwStrengthLabel = document.getElementById('setup-pw-strength-label');
    el.setupPwEntropy = document.getElementById('setup-pw-entropy');

    // App Navigation & Header
    el.btnNewEntry = document.getElementById('btn-new-entry');
    el.btnEmptyNewEntry = document.getElementById('btn-empty-new-entry');
    el.btnOpenGenerator = document.getElementById('btn-open-generator');
    el.btnOpenAudit = document.getElementById('btn-open-audit');
    el.btnOpenSettings = document.getElementById('btn-open-settings');
    el.btnOpenShortcuts = document.getElementById('btn-open-shortcuts');
    el.btnOpenImportExport = document.getElementById('btn-open-import-export');
    el.btnLockNow = document.getElementById('btn-lock-now');
    el.btnThemeToggle = document.getElementById('btn-theme-toggle');
    el.autolockCountdown = document.getElementById('autolock-countdown');
    el.btnCloseDisclaimer = document.getElementById('btn-close-disclaimer');
    el.disclaimerBanner = document.getElementById('disclaimer-banner');

    // Mobile Navigation Controls
    el.btnMobileSidebarToggle = document.getElementById('btn-mobile-sidebar-toggle');
    el.btnCloseSidebarMobile = document.getElementById('btn-close-sidebar-mobile');
    el.btnBackToList = document.getElementById('btn-back-to-list');
    el.appSidebar = document.getElementById('app-sidebar');
    el.appDetailPane = document.getElementById('app-detail-pane');

    // Sidebar
    el.countAll = document.getElementById('count-all');
    el.countFavorites = document.getElementById('count-favorites');
    el.countLogin = document.getElementById('count-login');
    el.countNote = document.getElementById('count-note');
    el.countCard = document.getElementById('count-card');
    el.countIdentity = document.getElementById('count-identity');
    el.foldersNavList = document.getElementById('folders-nav-list');
    el.tagsNavList = document.getElementById('tags-nav-list');
    el.btnAddFolder = document.getElementById('btn-add-folder');

    // List Pane
    el.searchInput = document.getElementById('search-input');
    el.btnClearSearch = document.getElementById('btn-clear-search');
    el.listCountText = document.getElementById('list-count-text');
    el.sortSelect = document.getElementById('sort-select');
    el.entryListContainer = document.getElementById('entry-list-container');

    // Detail Pane
    el.detailEmptyState = document.getElementById('detail-empty-state');
    el.detailContent = document.getElementById('detail-content');

    // Modals
    el.modalEntry = document.getElementById('modal-entry');
    el.modalEntryTitle = document.getElementById('modal-entry-title');
    el.formEntry = document.getElementById('form-entry');
    el.entryId = document.getElementById('entry-id');
    el.entryType = document.getElementById('entry-type');
    el.entryTypeTabs = document.getElementById('entry-type-tabs');
    el.entryTitleInput = document.getElementById('entry-title-input');
    el.entryFolderSelect = document.getElementById('entry-folder-select');
    el.btnSaveEntry = document.getElementById('btn-save-entry');
    el.btnFormGenPw = document.getElementById('btn-form-gen-pw');
    el.entryPassword = document.getElementById('entry-password');
    el.entryPwStrengthBar = document.getElementById('entry-pw-strength-bar');
    el.entryPwStrengthLabel = document.getElementById('entry-pw-strength-label');
    el.entryPwEntropy = document.getElementById('entry-pw-entropy');

    // Generator Modal
    el.modalGenerator = document.getElementById('modal-generator');
    el.genOutputText = document.getElementById('gen-output-text');
    el.btnGenRefresh = document.getElementById('btn-gen-refresh');
    el.btnGenCopy = document.getElementById('btn-gen-copy');
    el.genStrengthBar = document.getElementById('gen-strength-bar');
    el.genStrengthLabel = document.getElementById('gen-strength-label');
    el.genStrengthEntropy = document.getElementById('gen-strength-entropy');
    el.genLengthSlider = document.getElementById('gen-length-slider');
    el.genLengthVal = document.getElementById('gen-length-val');
    el.genWordsSlider = document.getElementById('gen-words-slider');
    el.genWordsVal = document.getElementById('gen-words-val');
    el.genPinSlider = document.getElementById('gen-pin-slider');
    el.genPinVal = document.getElementById('gen-pin-val');

    // Audit Modal
    el.modalAudit = document.getElementById('modal-audit');
    el.auditScorePercent = document.getElementById('audit-score-percent');
    el.auditScoreStatus = document.getElementById('audit-score-status');
    el.statWeakCount = document.getElementById('stat-weak-count');
    el.statReusedCount = document.getElementById('stat-reused-count');
    el.statNo2faCount = document.getElementById('stat-no2fa-count');
    el.statHealthyCount = document.getElementById('stat-healthy-count');
    el.auditIssuesContainer = document.getElementById('audit-issues-container');

    // Import/Export Modal
    el.modalImportExport = document.getElementById('modal-import-export');
    el.btnExportEncrypted = document.getElementById('btn-export-encrypted');
    el.btnExportPlainJson = document.getElementById('btn-export-plain-json');
    el.btnExportCsv = document.getElementById('btn-export-csv');
    el.btnPerformImport = document.getElementById('btn-perform-import');
    el.importFormat = document.getElementById('import-format');
    el.importPwGroup = document.getElementById('import-pw-group');
    el.importBackupPassword = document.getElementById('import-backup-password');
    el.importFile = document.getElementById('import-file');
    el.importText = document.getElementById('import-text');
    el.importValidationMsg = document.getElementById('import-validation-msg');

    // Folder Modal
    el.modalFolder = document.getElementById('modal-folder');
    el.folderNameInput = document.getElementById('folder-name-input');
    el.btnSaveFolder = document.getElementById('btn-save-folder');

    // Settings Modal
    el.modalSettings = document.getElementById('modal-settings');
    el.settingAutolock = document.getElementById('setting-autolock');
    el.settingClipboard = document.getElementById('setting-clipboard');
    el.settingTheme = document.getElementById('setting-theme');
    el.settingLockVisibility = document.getElementById('setting-lock-visibility');
    el.btnSaveSettings = document.getElementById('btn-save-settings');
    el.btnOpenChangePw = document.getElementById('btn-open-change-pw');
    el.btnOpenResetVault = document.getElementById('btn-open-reset-vault');

    // Change Password Modal
    el.modalChangePassword = document.getElementById('modal-change-password');
    el.formChangePassword = document.getElementById('form-change-password');
    el.changeOldPassword = document.getElementById('change-old-password');
    el.changeNewPassword = document.getElementById('change-new-password');
    el.changeConfirmPassword = document.getElementById('change-confirm-password');
    el.changeNewHint = document.getElementById('change-new-hint');
    el.btnSubmitChangePassword = document.getElementById('btn-submit-change-password');

    // Shortcuts Modal
    el.modalShortcuts = document.getElementById('modal-shortcuts');

    // Delete Modal
    el.modalDelete = document.getElementById('modal-delete');
    el.btnConfirmDelete = document.getElementById('btn-confirm-delete');
    el.deleteConfirmText = document.getElementById('delete-confirm-text');

    // Toast
    el.toastContainer = document.getElementById('toast-container');
  }

  // --- INITIALIZATION ---
  async function init() {
    cacheDOMElements();
    bindGlobalEvents();
    await loadSettings();

    const hasVault = await VaultStorage.hasVault();
    if (hasVault) {
      showUnlockView();
    } else {
      showSetupView();
    }
  }

  // --- SETTINGS MANAGEMENT ---
  async function loadSettings() {
    try {
      const saved = await VaultStorage.getSettings();
      if (saved) {
        state.settings = { ...state.settings, ...saved };
      }
    } catch (e) {
      console.warn('Could not load settings:', e);
    }
    applyTheme(state.settings.theme);
  }

  function applyTheme(theme) {
    state.settings.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  // --- AUTHENTICATION & VAULT SETUP ---
  function showUnlockView() {
    el.viewAuth.style.display = 'flex';
    el.viewApp.style.display = 'none';
    el.formUnlock.style.display = 'flex';
    el.formSetup.style.display = 'none';
    el.authSubtitle.textContent = 'Enter your master password to unlock';
    el.unlockPassword.value = '';
    el.unlockPassword.focus();

    VaultStorage.getVaultMeta().then(meta => {
      if (meta && meta.hint) {
        el.btnShowHint.style.display = 'inline-block';
        el.btnShowHint.onclick = () => {
          showToast(`Password Hint: "${meta.hint}"`, 'info');
        };
      } else {
        el.btnShowHint.style.display = 'none';
      }
    }).catch(() => {});
  }

  function showSetupView() {
    el.viewAuth.style.display = 'flex';
    el.viewApp.style.display = 'none';
    el.formUnlock.style.display = 'none';
    el.formSetup.style.display = 'flex';
    el.authSubtitle.textContent = 'Create a secure master password to initialize vault';
    el.setupPassword.value = '';
    el.setupConfirmPassword.value = '';
    el.setupHint.value = '';
    el.setupPassword.focus();
  }

  async function handleVaultSetup(e) {
    e.preventDefault();
    const pw = el.setupPassword.value;
    const confirmPw = el.setupConfirmPassword.value;
    const hint = el.setupHint.value.trim();
    const loadDemo = el.setupLoadDemo.checked;

    if (!pw || pw.length < 8) {
      showToast('Master password must be at least 8 characters long.', 'error');
      return;
    }
    if (pw !== confirmPw) {
      showToast('Master passwords do not match.', 'error');
      return;
    }

    try {
      showToast('Deriving PBKDF2 key & initializing vault...', 'info');

      const salt = VaultCrypto.generateSalt();
      const cryptoKey = await VaultCrypto.deriveKeyFromPassword(pw, salt);

      // Create known verifier token encrypted with this key
      const verifierPayload = await VaultCrypto.encrypt('VAULTPASS_VERIFIER_OK', cryptoKey);

      await VaultStorage.saveVaultMeta({
        salt,
        verifier: verifierPayload,
        hint: hint || null,
        iterations: VaultCrypto.PBKDF2_ITERATIONS,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1
      });

      state.cryptoKey = cryptoKey;
      state.salt = salt;
      state.unlocked = true;

      if (loadDemo && typeof VaultDemoData !== 'undefined') {
        // Save demo folders
        for (const f of VaultDemoData.folders) {
          await VaultStorage.saveFolder(f);
        }
        // Encrypt & save demo entries
        for (const entry of VaultDemoData.entries) {
          const encrypted = await VaultCrypto.encrypt(JSON.stringify(entry), cryptoKey);
          await VaultStorage.saveEntry({
            id: entry.id,
            folderId: entry.folderId || '',
            isFavorite: !!entry.isFavorite,
            type: entry.type,
            ciphertext: encrypted.ciphertext,
            iv: encrypted.iv,
            createdAt: entry.createdAt || Date.now(),
            updatedAt: entry.updatedAt || Date.now()
          });
        }
        state.folders = [...VaultDemoData.folders];
        state.entries = [...VaultDemoData.entries];
      } else {
        state.folders = [];
        state.entries = [];
      }

      showToast('Vault created successfully!', 'success');
      enterUnlockedApp();
    } catch (err) {
      console.error('Setup error:', err);
      showToast('Failed to initialize vault: ' + err.message, 'error');
    }
  }

  async function handleVaultUnlock(e) {
    e.preventDefault();
    const pw = el.unlockPassword.value;
    if (!pw) return;

    try {
      const meta = await VaultStorage.getVaultMeta();
      if (!meta || !meta.salt || !meta.verifier) {
        showToast('Vault metadata not found. Please reset.', 'error');
        return;
      }

      const cryptoKey = await VaultCrypto.deriveKeyFromPassword(pw, meta.salt, meta.iterations || 100000);

      // Verify key by attempting to decrypt the verifier token
      let decryptedVerifier;
      try {
        decryptedVerifier = await VaultCrypto.decrypt(meta.verifier.ciphertext, meta.verifier.iv, cryptoKey);
      } catch (e) {
        decryptedVerifier = null;
      }

      if (decryptedVerifier !== 'VAULTPASS_VERIFIER_OK') {
        showToast('Incorrect master password.', 'error');
        el.unlockPassword.value = '';
        el.unlockPassword.focus();
        return;
      }

      state.cryptoKey = cryptoKey;
      state.salt = meta.salt;
      state.unlocked = true;

      // Load all folders and encrypted entries
      state.folders = await VaultStorage.getAllFolders();
      const encryptedEntries = await VaultStorage.getAllEntries();

      // Decrypt entries into memory
      state.entries = [];
      for (const encItem of encryptedEntries) {
        try {
          const raw = await VaultCrypto.decrypt(encItem.ciphertext, encItem.iv, cryptoKey);
          const parsed = JSON.parse(raw);
          parsed.id = encItem.id;
          parsed.folderId = encItem.folderId;
          parsed.isFavorite = encItem.isFavorite;
          state.entries.push(parsed);
        } catch (err) {
          console.warn('Could not decrypt entry:', encItem.id, err);
        }
      }

      showToast('Vault unlocked successfully.', 'success');
      enterUnlockedApp();
    } catch (err) {
      console.error('Unlock error:', err);
      showToast('Failed to unlock vault: ' + err.message, 'error');
    }
  }

  function enterUnlockedApp() {
    el.viewAuth.style.display = 'none';
    el.viewApp.style.display = 'flex';

    updateFolderDropdown();
    renderSidebar();
    renderEntryList();

    if (state.entries.length > 0) {
      selectEntry(state.entries[0].id, false); // Don't auto-open detail on mobile
    } else {
      selectEntry(null, false);
    }

    startAutoLockTimer();
    startTOTPTicker();
  }

  function lockVault() {
    state.cryptoKey = null;
    state.unlocked = false;
    state.entries = [];
    state.folders = [];
    state.selectedId = null;

    stopAutoLockTimer();
    stopTOTPTicker();
    closeAllModals();

    if (el.appDetailPane) {
      el.appDetailPane.classList.remove('mobile-active');
    }
    if (el.appSidebar) {
      el.appSidebar.classList.remove('mobile-open');
    }

    showUnlockView();
    showToast('Vault locked and memory cleared.', 'info');
  }

  // --- AUTO-LOCK TIMER & ACTIVITY MONITORING ---
  function startAutoLockTimer() {
    stopAutoLockTimer();
    const minutes = parseInt(state.settings.autoLockMinutes, 10);
    if (minutes === 0) {
      el.autolockCountdown.textContent = 'Disabled';
      return;
    }

    state.autoLockRemainingSeconds = minutes * 60;
    updateAutoLockBadge();

    state.autoLockTimer = setInterval(() => {
      state.autoLockRemainingSeconds--;
      updateAutoLockBadge();

      if (state.autoLockRemainingSeconds <= 0) {
        lockVault();
      }
    }, 1000);
  }

  function resetAutoLockTimer() {
    if (!state.unlocked) return;
    const minutes = parseInt(state.settings.autoLockMinutes, 10);
    if (minutes > 0) {
      state.autoLockRemainingSeconds = minutes * 60;
      updateAutoLockBadge();
    }
  }

  function stopAutoLockTimer() {
    if (state.autoLockTimer) {
      clearInterval(state.autoLockTimer);
      state.autoLockTimer = null;
    }
  }

  function updateAutoLockBadge() {
    if (!el.autolockCountdown) return;
    const minutes = parseInt(state.settings.autoLockMinutes, 10);
    if (minutes === 0) {
      el.autolockCountdown.textContent = 'Off';
      return;
    }
    const m = Math.floor(state.autoLockRemainingSeconds / 60);
    const s = state.autoLockRemainingSeconds % 60;
    el.autolockCountdown.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // --- TOTP REAL-TIME TICKER ---
  function startTOTPTicker() {
    stopTOTPTicker();
    state.totpTimer = setInterval(async () => {
      if (!state.unlocked || !state.selectedId) return;
      const entry = state.entries.find(e => e.id === state.selectedId);
      if (entry && entry.totpSecret) {
        updateTOTPDisplay(entry.totpSecret);
      }
    }, 1000);
  }

  function stopTOTPTicker() {
    if (state.totpTimer) {
      clearInterval(state.totpTimer);
      state.totpTimer = null;
    }
  }

  async function updateTOTPDisplay(secret) {
    const totpBox = document.getElementById('detail-totp-container');
    if (!totpBox) return;

    const tokenData = await VaultTOTP.generateToken(secret);
    if (!tokenData) {
      totpBox.style.display = 'none';
      return;
    }

    totpBox.style.display = 'flex';
    const codeEl = document.getElementById('detail-totp-val');
    const secondsEl = document.getElementById('detail-totp-sec');
    const progressEl = document.getElementById('detail-totp-progress');

    if (codeEl) codeEl.textContent = tokenData.formattedCode;
    if (secondsEl) secondsEl.textContent = `${tokenData.remainingSeconds}s`;
    if (progressEl) {
      const circumference = 81.68;
      const offset = circumference - (tokenData.progressPercent / 100) * circumference;
      progressEl.style.strokeDashoffset = offset;
    }
  }

  // --- CLIPBOARD MANAGER ---
  async function copyToClipboard(text, label = 'Secret') {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      const clearSecs = parseInt(state.settings.clipboardClearSeconds, 10);
      if (clearSecs > 0) {
        showToast(`Copied ${label}! Clipboard will auto-clear in ${clearSecs}s.`, 'success');
        if (state.clipboardTimer) clearTimeout(state.clipboardTimer);
        state.clipboardTimer = setTimeout(() => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('').catch(() => {});
          }
          showToast('Clipboard cleared for privacy.', 'info');
        }, clearSecs * 1000);
      } else {
        showToast(`Copied ${label} to clipboard.`, 'success');
      }
    } catch (e) {
      showToast('Failed to copy to clipboard: ' + e.message, 'error');
    }
  }

  // --- FILTERING & SEARCH PIPELINE ---
  function getFilteredEntries() {
    let list = [...state.entries];

    const f = state.currentFilter;
    if (f.kind === 'favorites') {
      list = list.filter(e => e.isFavorite);
    } else if (f.kind === 'type') {
      list = list.filter(e => e.type === f.value);
    } else if (f.kind === 'folder') {
      list = list.filter(e => e.folderId === f.value);
    } else if (f.kind === 'tag') {
      list = list.filter(e => e.tags && e.tags.includes(f.value));
    }

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(e => {
        const titleMatch = e.title && e.title.toLowerCase().includes(q);
        const userMatch = e.username && e.username.toLowerCase().includes(q);
        const webMatch = e.website && e.website.toLowerCase().includes(q);
        const notesMatch = e.notes && e.notes.toLowerCase().includes(q);
        const tagMatch = e.tags && e.tags.some(t => t.toLowerCase().includes(q));
        const cardholderMatch = e.cardholderName && e.cardholderName.toLowerCase().includes(q);
        const emailMatch = e.email && e.email.toLowerCase().includes(q);
        const nameMatch = (e.firstName || e.lastName) && `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase().includes(q);
        return titleMatch || userMatch || webMatch || notesMatch || tagMatch || cardholderMatch || emailMatch || nameMatch;
      });
    }

    list.sort((a, b) => {
      switch (state.sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'updated-desc':
          return (b.updatedAt || 0) - (a.updatedAt || 0);
        case 'created-desc':
          return (b.createdAt || 0) - (a.createdAt || 0);
        default:
          return 0;
      }
    });

    return list;
  }

  // --- RENDERING: SIDEBAR ---
  function renderSidebar() {
    const allCount = state.entries.length;
    const favCount = state.entries.filter(e => e.isFavorite).length;
    const loginCount = state.entries.filter(e => e.type === 'login').length;
    const noteCount = state.entries.filter(e => e.type === 'note').length;
    const cardCount = state.entries.filter(e => e.type === 'card').length;
    const idCount = state.entries.filter(e => e.type === 'identity').length;

    el.countAll.textContent = allCount;
    el.countFavorites.textContent = favCount;
    el.countLogin.textContent = loginCount;
    el.countNote.textContent = noteCount;
    el.countCard.textContent = cardCount;
    el.countIdentity.textContent = idCount;

    // Render Folders
    el.foldersNavList.innerHTML = '';
    state.folders.forEach(folder => {
      const folderCount = state.entries.filter(e => e.folderId === folder.id).length;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = `sidebar-nav-item ${state.currentFilter.kind === 'folder' && state.currentFilter.value === folder.id ? 'active' : ''}`;
      item.dataset.folderId = folder.id;
      item.innerHTML = `
        <span class="sidebar-nav-label">
          <svg class="icon icon-sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          ${escapeHtml(folder.name)}
        </span>
        <span class="nav-count">${folderCount}</span>
      `;
      item.onclick = () => {
        setFilter({ kind: 'folder', value: folder.id });
        closeMobileSidebar();
      };
      el.foldersNavList.appendChild(item);
    });

    // Render Tags
    el.tagsNavList.innerHTML = '';
    const tagMap = {};
    state.entries.forEach(e => {
      if (Array.isArray(e.tags)) {
        e.tags.forEach(t => {
          const clean = t.trim().toLowerCase();
          if (clean) tagMap[clean] = (tagMap[clean] || 0) + 1;
        });
      }
    });

    Object.keys(tagMap).sort().forEach(tag => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = `sidebar-nav-item ${state.currentFilter.kind === 'tag' && state.currentFilter.value === tag ? 'active' : ''}`;
      item.innerHTML = `
        <span class="sidebar-nav-label">
          <svg class="icon icon-sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          ${escapeHtml(tag)}
        </span>
        <span class="nav-count">${tagMap[tag]}</span>
      `;
      item.onclick = () => {
        setFilter({ kind: 'tag', value: tag });
        closeMobileSidebar();
      };
      el.tagsNavList.appendChild(item);
    });
  }

  function setFilter(filter) {
    state.currentFilter = filter;
    document.querySelectorAll('.app-sidebar .sidebar-nav-item').forEach(btn => {
      btn.classList.remove('active');
    });

    if (filter.kind === 'all') {
      document.querySelector('[data-filter="all"]')?.classList.add('active');
    } else if (filter.kind === 'favorites') {
      document.querySelector('[data-filter="favorites"]')?.classList.add('active');
    } else if (filter.kind === 'type') {
      document.querySelector(`[data-type="${filter.value}"]`)?.classList.add('active');
    } else if (filter.kind === 'folder') {
      document.querySelector(`[data-folder-id="${filter.value}"]`)?.classList.add('active');
    }

    renderSidebar();
    renderEntryList();
  }

  function closeMobileSidebar() {
    if (el.appSidebar) {
      el.appSidebar.classList.remove('mobile-open');
    }
  }

  // --- RENDERING: ENTRY LIST ---
  function renderEntryList() {
    const list = getFilteredEntries();
    el.listCountText.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
    el.entryListContainer.innerHTML = '';

    if (list.length === 0) {
      el.entryListContainer.innerHTML = `
        <div class="empty-state" style="padding: 24px 12px;">
          <div class="empty-state-title" style="font-size: 13.5px;">No matching items</div>
          <div class="empty-state-text" style="font-size: 12px;">Try adjusting your search query or category filters.</div>
        </div>
      `;
      return;
    }

    list.forEach(entry => {
      const card = document.createElement('div');
      card.className = `entry-card ${state.selectedId === entry.id ? 'active' : ''}`;
      card.dataset.id = entry.id;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${entry.title || 'Entry'}, ${entry.type}`);

      let iconSvg = '';
      let subtitle = '';

      switch (entry.type) {
        case 'login':
          iconSvg = `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`;
          subtitle = entry.username || entry.website || 'Login';
          break;
        case 'note':
          iconSvg = `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
          subtitle = entry.content ? entry.content.slice(0, 32).replace(/\n/g, ' ') + '...' : 'Secure Note';
          break;
        case 'card':
          iconSvg = `<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;
          subtitle = entry.cardNumber ? `•••• ${entry.cardNumber.replace(/\s+/g, '').slice(-4)}` : 'Payment Card';
          break;
        case 'identity':
          iconSvg = `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
          subtitle = entry.email || `${entry.firstName || ''} ${entry.lastName || ''}`.trim() || 'Identity Profile';
          break;
      }

      card.innerHTML = `
        <div class="entry-card-icon">${iconSvg}</div>
        <div class="entry-card-content">
          <div class="entry-card-title">${escapeHtml(entry.title || 'Untitled')}</div>
          <div class="entry-card-subtitle">${escapeHtml(subtitle)}</div>
        </div>
        <div class="entry-card-actions">
          <button type="button" class="favorite-star ${entry.isFavorite ? 'favorited' : ''}" title="Favorite" aria-label="Toggle Favorite" data-action="toggle-fav" data-id="${entry.id}">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
        </div>
      `;

      card.onclick = (e) => {
        const favBtn = e.target.closest('[data-action="toggle-fav"]');
        if (favBtn) {
          e.stopPropagation();
          toggleFavorite(entry.id);
          return;
        }
        selectEntry(entry.id, true);
      };

      card.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectEntry(entry.id, true);
        }
      };

      el.entryListContainer.appendChild(card);
    });
  }

  // --- RENDERING: SELECTED ENTRY INSPECTOR ---
  function selectEntry(id, openMobileDetail = true) {
    state.selectedId = id;

    document.querySelectorAll('.entry-card').forEach(c => {
      c.classList.toggle('active', c.dataset.id === id);
    });

    if (openMobileDetail && window.innerWidth <= 768 && id) {
      el.appDetailPane.classList.add('mobile-active');
    }

    if (!id) {
      el.detailEmptyState.style.display = 'flex';
      el.detailContent.style.display = 'none';
      return;
    }

    const entry = state.entries.find(e => e.id === id);
    if (!entry) {
      el.detailEmptyState.style.display = 'flex';
      el.detailContent.style.display = 'none';
      return;
    }

    el.detailEmptyState.style.display = 'none';
    el.detailContent.style.display = 'block';

    const folder = state.folders.find(f => f.id === entry.folderId);
    const folderName = folder ? folder.name : null;

    let iconSvg = '';
    switch (entry.type) {
      case 'login':
        iconSvg = `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`;
        break;
      case 'note':
        iconSvg = `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
        break;
      case 'card':
        iconSvg = `<svg class="icon icon-lg" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;
        break;
      case 'identity':
        iconSvg = `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
        break;
    }

    let tagsHtml = '';
    if (folderName) {
      tagsHtml += `<span class="badge badge-folder"><svg class="icon icon-sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>${escapeHtml(folderName)}</span>`;
    }
    if (Array.isArray(entry.tags)) {
      entry.tags.forEach(t => {
        tagsHtml += `<span class="badge badge-tag">#${escapeHtml(t)}</span>`;
      });
    }

    let bodyHtml = '';

    if (entry.type === 'login') {
      const strength = VaultCrypto.evaluatePasswordStrength(entry.password || '');
      bodyHtml = `
        <div class="detail-section">
          <div class="detail-section-title">Credentials</div>

          ${entry.website ? `
            <div class="detail-field-row">
              <span class="field-label">Website URL</span>
              <div class="field-value-box">
                <a href="${escapeHtml(entry.website)}" target="_blank" rel="noopener noreferrer" class="field-value-text" style="color:var(--accent-primary);">
                  ${escapeHtml(entry.website)}
                </a>
                <div class="field-actions">
                  <a href="${escapeHtml(entry.website)}" target="_blank" rel="noopener noreferrer" class="btn btn-icon btn-sm" title="Launch Website" aria-label="Launch Website">
                    <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="detail-field-row">
            <span class="field-label">Username / Email</span>
            <div class="field-value-box">
              <span class="field-value-text font-mono">${escapeHtml(entry.username || '—')}</span>
              <div class="field-actions">
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.username)}', 'Username')" title="Copy Username" aria-label="Copy Username">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="detail-field-row">
            <span class="field-label">Password</span>
            <div class="field-value-box">
              <span class="field-value-text font-mono masked" id="detail-pw-text">••••••••••••••••</span>
              <div class="field-actions">
                <button class="btn btn-icon btn-sm" id="btn-toggle-detail-pw" title="Reveal or Hide Password" aria-label="Reveal or Hide Password">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.password)}', 'Password')" title="Copy Password" aria-label="Copy Password">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
            <div class="strength-meter-container">
              <div class="strength-bar-track">
                <div class="strength-bar-fill" style="width: ${strength.percent}%; background-color: ${strength.color};"></div>
              </div>
              <div class="strength-meta-row">
                <span class="strength-label" style="color: ${strength.color};">${strength.label}</span>
                <span class="strength-entropy">${strength.entropy} bits entropy</span>
              </div>
            </div>
          </div>

          ${entry.totpSecret ? `
            <div class="detail-field-row">
              <span class="field-label">Two-Factor Authenticator (TOTP)</span>
              <div class="totp-box" id="detail-totp-container">
                <div>
                  <div class="totp-code-val" id="detail-totp-val">--- ---</div>
                  <div style="font-size: 11px; color: var(--text-muted);">6-digit verification code</div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div class="totp-timer">
                    <svg viewBox="0 0 32 32" width="32" height="32">
                      <circle class="totp-timer-bg" cx="16" cy="16" r="13" />
                      <circle class="totp-timer-progress" id="detail-totp-progress" cx="16" cy="16" r="13" stroke-dasharray="81.68" stroke-dashoffset="0" />
                    </svg>
                    <span class="totp-seconds-label" id="detail-totp-sec">30s</span>
                  </div>
                  <button class="btn btn-primary btn-sm" id="btn-copy-totp" title="Copy 6-Digit Code">
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (entry.type === 'note') {
      bodyHtml = `
        <div class="detail-section">
          <div class="detail-section-title">Secure Note Content</div>
          <div class="detail-field-row">
            <div class="field-value-box" style="align-items: flex-start; min-height: 140px; white-space: pre-wrap; line-height: 1.5;">
              <span class="field-value-text font-mono">${escapeHtml(entry.content || '')}</span>
              <div class="field-actions">
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.content)}', 'Note Content')" title="Copy Note" aria-label="Copy Note">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (entry.type === 'card') {
      bodyHtml = `
        <div class="detail-section">
          <div class="detail-section-title">Payment Card Details</div>

          <div class="detail-field-row">
            <span class="field-label">Cardholder Name</span>
            <div class="field-value-box">
              <span class="field-value-text">${escapeHtml(entry.cardholderName || '—')}</span>
            </div>
          </div>

          <div class="detail-field-row">
            <span class="field-label">Card Number</span>
            <div class="field-value-box">
              <span class="field-value-text font-mono masked" id="detail-card-num">•••• •••• •••• ${escapeHtml(entry.cardNumber ? entry.cardNumber.replace(/\s+/g, '').slice(-4) : '••••')}</span>
              <div class="field-actions">
                <button class="btn btn-icon btn-sm" id="btn-toggle-detail-card" title="Reveal or Hide Card Number" aria-label="Reveal or Hide Card Number">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.cardNumber)}', 'Card Number')" title="Copy Card Number" aria-label="Copy Card Number">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="form-grid-3">
            <div class="detail-field-row">
              <span class="field-label">Expires</span>
              <div class="field-value-box">
                <span class="field-value-text font-mono">${escapeHtml(entry.expMonth || 'MM')}/${escapeHtml(entry.expYear || 'YY')}</span>
              </div>
            </div>

            <div class="detail-field-row">
              <span class="field-label">CVV</span>
              <div class="field-value-box">
                <span class="field-value-text font-mono masked" id="detail-cvv">•••</span>
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.cvv)}', 'CVV')" title="Copy CVV" aria-label="Copy CVV">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>

            <div class="detail-field-row">
              <span class="field-label">PIN</span>
              <div class="field-value-box">
                <span class="field-value-text font-mono masked" id="detail-pin">••••</span>
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.pin)}', 'PIN')" title="Copy PIN" aria-label="Copy PIN">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>

          ${entry.billingAddress ? `
            <div class="detail-field-row">
              <span class="field-label">Billing Address</span>
              <div class="field-value-box">
                <span class="field-value-text">${escapeHtml(entry.billingAddress)}</span>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (entry.type === 'identity') {
      bodyHtml = `
        <div class="detail-section">
          <div class="detail-section-title">Personal Identity Profile</div>

          <div class="form-grid-2">
            <div class="detail-field-row">
              <span class="field-label">Full Name</span>
              <div class="field-value-box">
                <span class="field-value-text">${escapeHtml(`${entry.titleHonorific || ''} ${entry.firstName || ''} ${entry.middleName || ''} ${entry.lastName || ''}`.trim())}</span>
              </div>
            </div>
            <div class="detail-field-row">
              <span class="field-label">Email</span>
              <div class="field-value-box">
                <span class="field-value-text font-mono">${escapeHtml(entry.email || '—')}</span>
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.email)}', 'Email')" title="Copy Email" aria-label="Copy Email">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="detail-field-row">
              <span class="field-label">Phone</span>
              <div class="field-value-box">
                <span class="field-value-text font-mono">${escapeHtml(entry.phone || '—')}</span>
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.phone)}', 'Phone')" title="Copy Phone" aria-label="Copy Phone">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
            <div class="detail-field-row">
              <span class="field-label">SSN / National ID</span>
              <div class="field-value-box">
                <span class="field-value-text font-mono masked" id="detail-ssn">•••-••-••••</span>
                <button class="btn btn-icon btn-sm" onclick="VaultApp.copySecret('${escapeJs(entry.ssn)}', 'SSN')" title="Copy SSN" aria-label="Copy SSN">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>

          ${entry.addressStreet ? `
            <div class="detail-field-row">
              <span class="field-label">Residential Address</span>
              <div class="field-value-box">
                <span class="field-value-text">${escapeHtml(`${entry.addressStreet}, ${entry.addressCity || ''} ${entry.addressState || ''} ${entry.addressZip || ''} ${entry.addressCountry || ''}`.trim())}</span>
              </div>
            </div>
          ` : ''}

          ${entry.company ? `
            <div class="detail-field-row">
              <span class="field-label">Employment</span>
              <div class="field-value-box">
                <span class="field-value-text">${escapeHtml(`${entry.jobTitle || 'Employee'} at ${entry.company}`)}</span>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (entry.notes) {
      bodyHtml += `
        <div class="detail-section">
          <div class="detail-section-title">Notes</div>
          <div class="detail-field-row">
            <div class="field-value-box" style="white-space: pre-wrap; line-height: 1.4;">
              <span class="field-value-text">${escapeHtml(entry.notes)}</span>
            </div>
          </div>
        </div>
      `;
    }

    const createdStr = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : 'Unknown';
    const updatedStr = entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : createdStr;

    bodyHtml += `
      <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between; padding: 4px 8px; flex-wrap: wrap; gap: 6px;">
        <span>Created: ${createdStr}</span>
        <span>Modified: ${updatedStr}</span>
      </div>
    `;

    el.detailContent.innerHTML = `
      <div class="detail-header">
        <div class="detail-title-wrapper">
          <div class="detail-avatar-icon">${iconSvg}</div>
          <div class="detail-heading-group">
            <div class="detail-main-title">${escapeHtml(entry.title || 'Untitled')}</div>
            <div class="detail-tags-row">${tagsHtml}</div>
          </div>
        </div>

        <div class="detail-actions-toolbar">
          <button type="button" class="btn btn-icon ${entry.isFavorite ? 'favorited' : ''}" id="btn-detail-fav" title="Toggle Favorite" aria-label="Toggle Favorite">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-detail-edit">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Edit</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-detail-duplicate" title="Duplicate Item">
            <span>Duplicate</span>
          </button>
          <button type="button" class="btn btn-danger btn-sm" id="btn-detail-delete" title="Delete Item">
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div class="detail-body">
        ${bodyHtml}
      </div>
    `;

    document.getElementById('btn-detail-fav').onclick = () => toggleFavorite(entry.id);
    document.getElementById('btn-detail-edit').onclick = () => openEditEntryModal(entry.id);
    document.getElementById('btn-detail-duplicate').onclick = () => duplicateEntry(entry.id);
    document.getElementById('btn-detail-delete').onclick = () => openDeleteConfirmModal(entry.id);

    const btnTogglePw = document.getElementById('btn-toggle-detail-pw');
    if (btnTogglePw) {
      let isRevealed = false;
      btnTogglePw.onclick = () => {
        isRevealed = !isRevealed;
        const pwEl = document.getElementById('detail-pw-text');
        if (isRevealed) {
          pwEl.textContent = entry.password || '';
          pwEl.classList.remove('masked');
        } else {
          pwEl.textContent = '••••••••••••••••';
          pwEl.classList.add('masked');
        }
      };
    }

    const btnToggleCard = document.getElementById('btn-toggle-detail-card');
    if (btnToggleCard) {
      let isCardRevealed = false;
      btnToggleCard.onclick = () => {
        isCardRevealed = !isCardRevealed;
        const cardEl = document.getElementById('detail-card-num');
        const cvvEl = document.getElementById('detail-cvv');
        const pinEl = document.getElementById('detail-pin');
        if (isCardRevealed) {
          if (cardEl) {
            cardEl.textContent = formatCardNumber(entry.cardNumber || '');
            cardEl.classList.remove('masked');
          }
          if (cvvEl) {
            cvvEl.textContent = entry.cvv || '—';
            cvvEl.classList.remove('masked');
          }
          if (pinEl) {
            pinEl.textContent = entry.pin || '—';
            pinEl.classList.remove('masked');
          }
        } else {
          if (cardEl) {
            cardEl.textContent = `•••• •••• •••• ${entry.cardNumber ? entry.cardNumber.replace(/\s+/g, '').slice(-4) : '••••'}`;
            cardEl.classList.add('masked');
          }
          if (cvvEl) {
            cvvEl.textContent = '•••';
            cvvEl.classList.add('masked');
          }
          if (pinEl) {
            pinEl.textContent = '••••';
            pinEl.classList.add('masked');
          }
        }
      };
    }

    const btnCopyTotp = document.getElementById('btn-copy-totp');
    if (btnCopyTotp && entry.totpSecret) {
      btnCopyTotp.onclick = async () => {
        const tokenData = await VaultTOTP.generateToken(entry.totpSecret);
        if (tokenData) {
          copyToClipboard(tokenData.code, 'TOTP Code');
        }
      };
      updateTOTPDisplay(entry.totpSecret);
    }
  }

  // --- CRUD MODAL OPERATIONS ---
  function openNewEntryModal(defaultType = 'login') {
    el.modalEntryTitle.textContent = 'New Vault Entry';
    el.entryId.value = '';
    el.entryType.value = defaultType;
    setEntryModalType(defaultType);

    el.entryTitleInput.value = '';
    el.entryFolderSelect.value = state.currentFilter.kind === 'folder' ? state.currentFilter.value : '';
    document.getElementById('entry-website').value = '';
    document.getElementById('entry-username').value = '';
    document.getElementById('entry-password').value = '';
    document.getElementById('entry-totp').value = '';
    document.getElementById('entry-content').value = '';
    document.getElementById('entry-cardholder').value = '';
    document.getElementById('entry-cardnumber').value = '';
    document.getElementById('entry-exp-month').value = '';
    document.getElementById('entry-exp-year').value = '';
    document.getElementById('entry-cvv').value = '';
    document.getElementById('entry-card-pin').value = '';
    document.getElementById('entry-billing-address').value = '';
    document.getElementById('entry-first-name').value = '';
    document.getElementById('entry-middle-name').value = '';
    document.getElementById('entry-last-name').value = '';
    document.getElementById('entry-id-email').value = '';
    document.getElementById('entry-id-phone').value = '';
    document.getElementById('entry-id-ssn').value = '';
    document.getElementById('entry-id-passport').value = '';
    document.getElementById('entry-id-address').value = '';
    document.getElementById('entry-id-city').value = '';
    document.getElementById('entry-id-state').value = '';
    document.getElementById('entry-id-zip').value = '';
    document.getElementById('entry-id-company').value = '';
    document.getElementById('entry-id-jobtitle').value = '';
    document.getElementById('entry-tags').value = '';
    document.getElementById('entry-notes').value = '';
    document.getElementById('entry-favorite').checked = false;

    updateEntryPasswordStrength('');
    openModal(el.modalEntry);
  }

  function openEditEntryModal(id) {
    const entry = state.entries.find(e => e.id === id);
    if (!entry) return;

    el.modalEntryTitle.textContent = 'Edit Vault Entry';
    el.entryId.value = entry.id;
    el.entryType.value = entry.type;
    setEntryModalType(entry.type);

    el.entryTitleInput.value = entry.title || '';
    el.entryFolderSelect.value = entry.folderId || '';

    document.getElementById('entry-website').value = entry.website || '';
    document.getElementById('entry-username').value = entry.username || '';
    document.getElementById('entry-password').value = entry.password || '';
    document.getElementById('entry-totp').value = entry.totpSecret || '';
    document.getElementById('entry-content').value = entry.content || '';
    document.getElementById('entry-cardholder').value = entry.cardholderName || '';
    document.getElementById('entry-cardnumber').value = entry.cardNumber || '';
    document.getElementById('entry-exp-month').value = entry.expMonth || '';
    document.getElementById('entry-exp-year').value = entry.expYear || '';
    document.getElementById('entry-cvv').value = entry.cvv || '';
    document.getElementById('entry-card-pin').value = entry.pin || '';
    document.getElementById('entry-billing-address').value = entry.billingAddress || '';
    document.getElementById('entry-first-name').value = entry.firstName || '';
    document.getElementById('entry-middle-name').value = entry.middleName || '';
    document.getElementById('entry-last-name').value = entry.lastName || '';
    document.getElementById('entry-id-email').value = entry.email || '';
    document.getElementById('entry-id-phone').value = entry.phone || '';
    document.getElementById('entry-id-ssn').value = entry.ssn || '';
    document.getElementById('entry-id-passport').value = entry.passportNumber || '';
    document.getElementById('entry-id-address').value = entry.addressStreet || '';
    document.getElementById('entry-id-city').value = entry.addressCity || '';
    document.getElementById('entry-id-state').value = entry.addressState || '';
    document.getElementById('entry-id-zip').value = entry.addressZip || '';
    document.getElementById('entry-id-company').value = entry.company || '';
    document.getElementById('entry-id-jobtitle').value = entry.jobTitle || '';
    document.getElementById('entry-tags').value = Array.isArray(entry.tags) ? entry.tags.join(', ') : '';
    document.getElementById('entry-notes').value = entry.notes || '';
    document.getElementById('entry-favorite').checked = !!entry.isFavorite;

    updateEntryPasswordStrength(entry.password || '');
    openModal(el.modalEntry);
  }

  function setEntryModalType(type) {
    el.entryType.value = type;
    document.querySelectorAll('#entry-type-tabs .tab-btn').forEach(btn => {
      const match = btn.dataset.type === type;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    document.getElementById('fields-login').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('fields-note').style.display = type === 'note' ? 'block' : 'none';
    document.getElementById('fields-card').style.display = type === 'card' ? 'block' : 'none';
    document.getElementById('fields-identity').style.display = type === 'identity' ? 'block' : 'none';
  }

  async function handleSaveEntry() {
    const title = el.entryTitleInput.value.trim();
    if (!title) {
      showToast('Please provide a title for this item.', 'error');
      el.entryTitleInput.focus();
      return;
    }

    const type = el.entryType.value;
    const isNew = !el.entryId.value;
    const id = el.entryId.value || `e_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    const folderId = el.entryFolderSelect.value || '';
    const isFavorite = document.getElementById('entry-favorite').checked;

    const rawTags = document.getElementById('entry-tags').value;
    const tags = rawTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    const now = Date.now();
    const entryData = {
      id,
      type,
      title,
      folderId,
      tags,
      isFavorite,
      notes: document.getElementById('entry-notes').value,
      createdAt: isNew ? now : (state.entries.find(e => e.id === id)?.createdAt || now),
      updatedAt: now
    };

    if (type === 'login') {
      entryData.website = document.getElementById('entry-website').value.trim();
      entryData.username = document.getElementById('entry-username').value.trim();
      entryData.password = document.getElementById('entry-password').value;
      entryData.totpSecret = document.getElementById('entry-totp').value.trim().replace(/\s+/g, '').toUpperCase();
    } else if (type === 'note') {
      entryData.content = document.getElementById('entry-content').value;
    } else if (type === 'card') {
      entryData.cardholderName = document.getElementById('entry-cardholder').value.trim();
      entryData.cardNumber = document.getElementById('entry-cardnumber').value.trim();
      entryData.expMonth = document.getElementById('entry-exp-month').value.trim();
      entryData.expYear = document.getElementById('entry-exp-year').value.trim();
      entryData.cvv = document.getElementById('entry-cvv').value.trim();
      entryData.pin = document.getElementById('entry-card-pin').value.trim();
      entryData.billingAddress = document.getElementById('entry-billing-address').value.trim();
    } else if (type === 'identity') {
      entryData.firstName = document.getElementById('entry-first-name').value.trim();
      entryData.middleName = document.getElementById('entry-middle-name').value.trim();
      entryData.lastName = document.getElementById('entry-last-name').value.trim();
      entryData.email = document.getElementById('entry-id-email').value.trim();
      entryData.phone = document.getElementById('entry-id-phone').value.trim();
      entryData.ssn = document.getElementById('entry-id-ssn').value.trim();
      entryData.passportNumber = document.getElementById('entry-id-passport').value.trim();
      entryData.addressStreet = document.getElementById('entry-id-address').value.trim();
      entryData.addressCity = document.getElementById('entry-id-city').value.trim();
      entryData.addressState = document.getElementById('entry-id-state').value.trim();
      entryData.addressZip = document.getElementById('entry-id-zip').value.trim();
      entryData.company = document.getElementById('entry-id-company').value.trim();
      entryData.jobTitle = document.getElementById('entry-id-jobtitle').value.trim();
    }

    try {
      const encrypted = await VaultCrypto.encrypt(JSON.stringify(entryData), state.cryptoKey);
      await VaultStorage.saveEntry({
        id: entryData.id,
        folderId: entryData.folderId,
        isFavorite: entryData.isFavorite,
        type: entryData.type,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        createdAt: entryData.createdAt,
        updatedAt: entryData.updatedAt
      });

      const existingIdx = state.entries.findIndex(e => e.id === id);
      if (existingIdx !== -1) {
        state.entries[existingIdx] = entryData;
      } else {
        state.entries.unshift(entryData);
      }

      closeModal(el.modalEntry);
      renderSidebar();
      renderEntryList();
      selectEntry(id, true);
      showToast('Entry saved securely.', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save entry: ' + err.message, 'error');
    }
  }

  async function duplicateEntry(id) {
    const orig = state.entries.find(e => e.id === id);
    if (!orig) return;

    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = `e_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    copy.title = `${orig.title} (Copy)`;
    copy.createdAt = Date.now();
    copy.updatedAt = Date.now();

    try {
      const encrypted = await VaultCrypto.encrypt(JSON.stringify(copy), state.cryptoKey);
      await VaultStorage.saveEntry({
        id: copy.id,
        folderId: copy.folderId,
        isFavorite: copy.isFavorite,
        type: copy.type,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        createdAt: copy.createdAt,
        updatedAt: copy.updatedAt
      });

      state.entries.unshift(copy);
      renderSidebar();
      renderEntryList();
      selectEntry(copy.id, true);
      showToast(`Duplicated "${orig.title}".`, 'success');
    } catch (e) {
      showToast('Failed to duplicate item: ' + e.message, 'error');
    }
  }

  async function toggleFavorite(id) {
    const entry = state.entries.find(e => e.id === id);
    if (!entry) return;

    entry.isFavorite = !entry.isFavorite;
    entry.updatedAt = Date.now();

    try {
      const encrypted = await VaultCrypto.encrypt(JSON.stringify(entry), state.cryptoKey);
      await VaultStorage.saveEntry({
        id: entry.id,
        folderId: entry.folderId,
        isFavorite: entry.isFavorite,
        type: entry.type,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      });

      renderSidebar();
      renderEntryList();
      if (state.selectedId === id) selectEntry(id, false);
    } catch (e) {
      console.error('Fav error:', e);
    }
  }

  let itemPendingDeleteId = null;
  function openDeleteConfirmModal(id) {
    itemPendingDeleteId = id;
    const entry = state.entries.find(e => e.id === id);
    if (!entry) return;
    el.deleteConfirmText.textContent = `Are you sure you want to delete "${entry.title}"? This cannot be undone.`;
    openModal(el.modalDelete);
  }

  async function handleConfirmDelete() {
    if (!itemPendingDeleteId) return;
    const id = itemPendingDeleteId;
    try {
      await VaultStorage.deleteEntry(id);
      state.entries = state.entries.filter(e => e.id !== id);
      closeModal(el.modalDelete);

      renderSidebar();
      renderEntryList();

      if (state.selectedId === id) {
        const remaining = getFilteredEntries();
        selectEntry(remaining.length > 0 ? remaining[0].id : null, false);
        if (el.appDetailPane) el.appDetailPane.classList.remove('mobile-active');
      }
      showToast('Item deleted.', 'info');
    } catch (e) {
      showToast('Failed to delete item: ' + e.message, 'error');
    }
  }

  // --- FOLDERS MANAGEMENT ---
  function updateFolderDropdown() {
    el.entryFolderSelect.innerHTML = '<option value="">(No Folder)</option>';
    state.folders.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = f.name;
      el.entryFolderSelect.appendChild(opt);
    });
  }

  function openNewFolderModal() {
    el.folderNameInput.value = '';
    openModal(el.modalFolder);
    el.folderNameInput.focus();
  }

  async function handleSaveFolder() {
    const name = el.folderNameInput.value.trim();
    if (!name) {
      showToast('Folder name cannot be blank.', 'error');
      return;
    }

    const folder = {
      id: `f_${Date.now().toString(36)}`,
      name,
      createdAt: Date.now()
    };

    try {
      await VaultStorage.saveFolder(folder);
      state.folders.push(folder);
      updateFolderDropdown();
      renderSidebar();
      closeModal(el.modalFolder);
      showToast(`Created folder "${name}".`, 'success');
    } catch (e) {
      showToast('Failed to create folder: ' + e.message, 'error');
    }
  }

  // --- PASSWORD GENERATOR UI ---
  let activeGenMode = 'password';

  function openGeneratorModal() {
    refreshGeneratedPassword();
    openModal(el.modalGenerator);
  }

  function refreshGeneratedPassword() {
    let result = '';
    if (activeGenMode === 'password') {
      const length = parseInt(el.genLengthSlider.value, 10);
      const uppercase = document.getElementById('gen-opt-upper').checked;
      const lowercase = document.getElementById('gen-opt-lower').checked;
      const numbers = document.getElementById('gen-opt-numbers').checked;
      const symbols = document.getElementById('gen-opt-symbols').checked;
      const excludeAmbiguous = document.getElementById('gen-opt-ambiguous').checked;

      result = VaultGenerator.generatePassword({
        length,
        uppercase,
        lowercase,
        numbers,
        symbols,
        excludeAmbiguous
      });
    } else if (activeGenMode === 'passphrase') {
      const wordCount = parseInt(el.genWordsSlider.value, 10);
      const separator = document.getElementById('gen-separator').value;
      const capitalize = document.getElementById('gen-passphrase-capitalize').checked;
      const includeNumber = document.getElementById('gen-passphrase-number').checked;

      result = VaultGenerator.generatePassphrase({
        wordCount,
        separator,
        capitalize,
        includeNumber
      });
    } else if (activeGenMode === 'pin') {
      const length = parseInt(el.genPinSlider.value, 10);
      result = VaultGenerator.generatePIN(length);
    }

    el.genOutputText.textContent = result;
    const strength = VaultCrypto.evaluatePasswordStrength(result);
    el.genStrengthBar.style.width = `${strength.percent}%`;
    el.genStrengthBar.style.backgroundColor = strength.color;
    el.genStrengthLabel.textContent = strength.label;
    el.genStrengthLabel.style.color = strength.color;
    el.genStrengthEntropy.textContent = `${strength.entropy} bits`;
  }

  function setGenMode(mode) {
    activeGenMode = mode;
    document.querySelectorAll('#gen-mode-tabs .tab-btn').forEach(btn => {
      const match = btn.dataset.genmode === mode;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    document.getElementById('gen-controls-password').style.display = mode === 'password' ? 'block' : 'none';
    document.getElementById('gen-controls-passphrase').style.display = mode === 'passphrase' ? 'block' : 'none';
    document.getElementById('gen-controls-pin').style.display = mode === 'pin' ? 'block' : 'none';

    refreshGeneratedPassword();
  }

  // --- SECURITY HEALTH AUDIT SCANNER ---
  function openSecurityAuditModal() {
    runSecurityAudit();
    openModal(el.modalAudit);
  }

  function runSecurityAudit() {
    const logins = state.entries.filter(e => e.type === 'login');
    let weakCount = 0;
    let reusedCount = 0;
    let no2faCount = 0;
    let healthyCount = 0;

    const pwUsageMap = {};
    logins.forEach(item => {
      if (item.password) {
        pwUsageMap[item.password] = (pwUsageMap[item.password] || []).concat(item);
      }
    });

    const issues = [];

    logins.forEach(item => {
      let itemHasIssue = false;
      const pw = item.password || '';
      const strength = VaultCrypto.evaluatePasswordStrength(pw);

      if (strength.score <= 1 || pw.length < 10) {
        weakCount++;
        itemHasIssue = true;
        issues.push({
          entryId: item.id,
          title: item.title,
          type: 'danger',
          label: 'Weak Password',
          detail: `Strength: ${strength.label} (${pw.length} chars). Vulnerable to automated cracking.`
        });
      }

      if (pw && pwUsageMap[pw].length > 1) {
        reusedCount++;
        itemHasIssue = true;
        issues.push({
          entryId: item.id,
          title: item.title,
          type: 'warning',
          label: 'Reused Password',
          detail: `Shared with ${pwUsageMap[pw].length} accounts (${pwUsageMap[pw].map(x => x.title).join(', ')}).`
        });
      }

      if (!item.totpSecret) {
        no2faCount++;
      }

      if (!itemHasIssue && strength.score >= 3) {
        healthyCount++;
      }
    });

    let score = 100;
    if (logins.length > 0) {
      const penalty = (weakCount * 25) + (reusedCount * 15);
      score = Math.max(10, Math.round(100 - (penalty / logins.length)));
    }

    el.auditScorePercent.textContent = `${score}%`;
    el.statWeakCount.textContent = weakCount;
    el.statReusedCount.textContent = reusedCount;
    el.statNo2faCount.textContent = no2faCount;
    el.statHealthyCount.textContent = healthyCount;

    if (score >= 90) {
      el.auditScoreStatus.textContent = 'Excellent Security Rating';
      el.auditScoreStatus.style.color = 'var(--strength-strong)';
    } else if (score >= 70) {
      el.auditScoreStatus.textContent = 'Good — Minor improvements suggested';
      el.auditScoreStatus.style.color = 'var(--strength-good)';
    } else if (score >= 50) {
      el.auditScoreStatus.textContent = 'Fair — Review repeated passwords';
      el.auditScoreStatus.style.color = 'var(--strength-fair)';
    } else {
      el.auditScoreStatus.textContent = 'Critical Action Needed';
      el.auditScoreStatus.style.color = 'var(--strength-weak)';
    }

    el.auditIssuesContainer.innerHTML = '';
    if (issues.length === 0) {
      el.auditIssuesContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--success); font-size: 13px;">
          All credentials meet high security benchmarks. No vulnerable passwords detected.
        </div>
      `;
      return;
    }

    issues.forEach(issue => {
      const div = document.createElement('div');
      div.className = 'audit-issue-card';
      div.setAttribute('role', 'listitem');
      div.innerHTML = `
        <div class="audit-issue-info">
          <div class="audit-issue-name">${escapeHtml(issue.title)}</div>
          <div class="audit-issue-tag ${issue.type}">${escapeHtml(issue.label)}: ${escapeHtml(issue.detail)}</div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" onclick="VaultApp.fixAuditIssue('${issue.entryId}')">
          Fix Item
        </button>
      `;
      el.auditIssuesContainer.appendChild(div);
    });
  }

  function fixAuditIssue(entryId) {
    closeModal(el.modalAudit);
    openEditEntryModal(entryId);
  }

  // --- IMPORT & EXPORT ENGINE ---
  function openImportExportModal() {
    openModal(el.modalImportExport);
  }

  async function handleExportEncrypted() {
    try {
      const payload = {
        app: 'VaultPass',
        version: 1,
        exportedAt: new Date().toISOString(),
        salt: state.salt,
        iterations: VaultCrypto.PBKDF2_ITERATIONS,
        folders: state.folders,
        entries: []
      };

      for (const entry of state.entries) {
        const enc = await VaultCrypto.encrypt(JSON.stringify(entry), state.cryptoKey);
        payload.entries.push({
          id: entry.id,
          folderId: entry.folderId,
          isFavorite: entry.isFavorite,
          type: entry.type,
          ciphertext: enc.ciphertext,
          iv: enc.iv,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt
        });
      }

      downloadFile('vaultpass-backup-encrypted.json', JSON.stringify(payload, null, 2), 'application/json');
      showToast('Encrypted backup downloaded safely.', 'success');
    } catch (e) {
      showToast('Export failed: ' + e.message, 'error');
    }
  }

  function handleExportPlainJson() {
    const confirmed = confirm('WARNING: Plaintext export contains unencrypted passwords. Are you sure you want to download an unencrypted file?');
    if (!confirmed) return;

    const payload = {
      app: 'VaultPass-Plain-Export',
      exportedAt: new Date().toISOString(),
      warning: 'Contains unencrypted credentials. Keep secure or delete after use.',
      folders: state.folders,
      entries: state.entries
    };

    downloadFile('vaultpass-export-plain.json', JSON.stringify(payload, null, 2), 'application/json');
    showToast('Plain JSON exported. Remember to store safely.', 'warning');
  }

  function handleExportCsv() {
    const confirmed = confirm('WARNING: CSV export contains unencrypted passwords. Are you sure you want to download unencrypted CSV?');
    if (!confirmed) return;

    const headers = ['title', 'type', 'website', 'username', 'password', 'notes', 'tags', 'folder'];
    const rows = [headers.join(',')];

    state.entries.forEach(e => {
      const folder = state.folders.find(f => f.id === e.folderId);
      const row = [
        csvEscape(e.title || ''),
        csvEscape(e.type || 'login'),
        csvEscape(e.website || ''),
        csvEscape(e.username || e.cardholderName || ''),
        csvEscape(e.password || e.cardNumber || ''),
        csvEscape(e.notes || e.content || ''),
        csvEscape(Array.isArray(e.tags) ? e.tags.join(';') : ''),
        csvEscape(folder ? folder.name : '')
      ];
      rows.push(row.join(','));
    });

    downloadFile('vaultpass-export.csv', rows.join('\n'), 'text/csv');
    showToast('CSV export downloaded.', 'warning');
  }

  function csvEscape(text) {
    if (text === null || text === undefined) return '""';
    const clean = String(text).replace(/"/g, '""');
    return `"${clean}"`;
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handlePerformImport() {
    const format = el.importFormat.value;
    const file = el.importFile.files[0];
    let content = el.importText.value.trim();

    if (!content && file) {
      try {
        content = await file.text();
      } catch (e) {
        showImportMsg('Failed to read selected file.', 'danger');
        return;
      }
    }

    if (!content) {
      showImportMsg('Please paste text or choose a file to import.', 'danger');
      return;
    }

    try {
      if (format === 'vaultpass-plain') {
        const parsed = JSON.parse(content);
        if (!parsed.entries || !Array.isArray(parsed.entries)) {
          throw new Error('Invalid VaultPass JSON schema: "entries" array is missing.');
        }

        let importedCount = 0;
        for (const item of parsed.entries) {
          if (!item.title) continue;
          const entryId = item.id || `e_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
          const cleanEntry = {
            ...item,
            id: entryId,
            type: item.type || 'login',
            createdAt: item.createdAt || Date.now(),
            updatedAt: Date.now()
          };

          const encrypted = await VaultCrypto.encrypt(JSON.stringify(cleanEntry), state.cryptoKey);
          await VaultStorage.saveEntry({
            id: cleanEntry.id,
            folderId: cleanEntry.folderId || '',
            isFavorite: !!cleanEntry.isFavorite,
            type: cleanEntry.type,
            ciphertext: encrypted.ciphertext,
            iv: encrypted.iv,
            createdAt: cleanEntry.createdAt,
            updatedAt: cleanEntry.updatedAt
          });

          state.entries.push(cleanEntry);
          importedCount++;
        }

        closeModal(el.modalImportExport);
        renderSidebar();
        renderEntryList();
        showToast(`Successfully imported ${importedCount} items!`, 'success');
      } else if (format === 'vaultpass-encrypted') {
        const parsed = JSON.parse(content);
        const backupPw = el.importBackupPassword.value;
        if (!backupPw) {
          showImportMsg('Please enter the master password used to encrypt this backup.', 'danger');
          return;
        }
        if (!parsed.salt || !parsed.entries) {
          throw new Error('Corrupted or invalid encrypted backup file.');
        }

        const backupKey = await VaultCrypto.deriveKeyFromPassword(backupPw, parsed.salt, parsed.iterations || 100000);

        let decryptedCount = 0;
        for (const encItem of parsed.entries) {
          const raw = await VaultCrypto.decrypt(encItem.ciphertext, encItem.iv, backupKey);
          const entry = JSON.parse(raw);

          const reEncrypted = await VaultCrypto.encrypt(JSON.stringify(entry), state.cryptoKey);
          await VaultStorage.saveEntry({
            id: entry.id,
            folderId: entry.folderId || '',
            isFavorite: !!entry.isFavorite,
            type: entry.type,
            ciphertext: reEncrypted.ciphertext,
            iv: reEncrypted.iv,
            createdAt: entry.createdAt || Date.now(),
            updatedAt: Date.now()
          });

          state.entries.push(entry);
          decryptedCount++;
        }

        closeModal(el.modalImportExport);
        renderSidebar();
        renderEntryList();
        showToast(`Decrypted and imported ${decryptedCount} items!`, 'success');
      } else if (format === 'generic-csv') {
        const lines = content.split('\n').filter(l => l.trim().length > 0);
        if (lines.length <= 1) throw new Error('CSV is empty or missing rows.');

        let count = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVRow(lines[i]);
          if (cols.length >= 2) {
            const entry = {
              id: `e_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`,
              type: cols[1] || 'login',
              title: cols[0] || 'Imported Entry',
              website: cols[2] || '',
              username: cols[3] || '',
              password: cols[4] || '',
              notes: cols[5] || '',
              tags: cols[6] ? cols[6].split(';') : [],
              createdAt: Date.now(),
              updatedAt: Date.now()
            };

            const enc = await VaultCrypto.encrypt(JSON.stringify(entry), state.cryptoKey);
            await VaultStorage.saveEntry({
              id: entry.id,
              folderId: '',
              isFavorite: false,
              type: entry.type,
              ciphertext: enc.ciphertext,
              iv: enc.iv,
              createdAt: entry.createdAt,
              updatedAt: entry.updatedAt
            });

            state.entries.push(entry);
            count++;
          }
        }

        closeModal(el.modalImportExport);
        renderSidebar();
        renderEntryList();
        showToast(`Imported ${count} CSV items.`, 'success');
      }
    } catch (err) {
      showImportMsg('Import Error: ' + err.message, 'danger');
    }
  }

  function parseCSVRow(row) {
    const result = [];
    let insideQuotes = false;
    let current = '';
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"' && row[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  function showImportMsg(text, type) {
    el.importValidationMsg.style.display = 'block';
    el.importValidationMsg.textContent = text;
    el.importValidationMsg.style.backgroundColor = type === 'danger' ? 'var(--danger-subtle)' : 'var(--success-subtle)';
    el.importValidationMsg.style.color = type === 'danger' ? 'var(--danger)' : 'var(--success)';
  }

  // --- MASTER PASSWORD CHANGE ---
  async function handleChangeMasterPassword(e) {
    e.preventDefault();
    const oldPw = el.changeOldPassword.value;
    const newPw = el.changeNewPassword.value;
    const confirmNewPw = el.changeConfirmPassword.value;
    const newHint = el.changeNewHint.value.trim();

    if (newPw.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPw !== confirmNewPw) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    try {
      const oldKey = await VaultCrypto.deriveKeyFromPassword(oldPw, state.salt);
      const meta = await VaultStorage.getVaultMeta();
      const test = await VaultCrypto.decrypt(meta.verifier.ciphertext, meta.verifier.iv, oldKey);
      if (test !== 'VAULTPASS_VERIFIER_OK') {
        showToast('Current master password is incorrect.', 'error');
        return;
      }

      showToast('Re-encrypting vault with new key...', 'info');

      const newSalt = VaultCrypto.generateSalt();
      const newKey = await VaultCrypto.deriveKeyFromPassword(newPw, newSalt);

      for (const entry of state.entries) {
        const enc = await VaultCrypto.encrypt(JSON.stringify(entry), newKey);
        await VaultStorage.saveEntry({
          id: entry.id,
          folderId: entry.folderId || '',
          isFavorite: !!entry.isFavorite,
          type: entry.type,
          ciphertext: enc.ciphertext,
          iv: enc.iv,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt
        });
      }

      const newVerifier = await VaultCrypto.encrypt('VAULTPASS_VERIFIER_OK', newKey);
      await VaultStorage.saveVaultMeta({
        salt: newSalt,
        verifier: newVerifier,
        hint: newHint || null,
        iterations: VaultCrypto.PBKDF2_ITERATIONS,
        updatedAt: Date.now()
      });

      state.cryptoKey = newKey;
      state.salt = newSalt;

      closeModal(el.modalChangePassword);
      closeModal(el.modalSettings);
      showToast('Master password changed successfully!', 'success');
    } catch (err) {
      console.error('Password change error:', err);
      showToast('Failed to change password: ' + err.message, 'error');
    }
  }

  // --- RESET / PURGE VAULT ---
  async function handleWipeVault() {
    const confirmation = prompt('DANGER: This will delete ALL encrypted passwords, folders, and keys permanently.\nType "WIPE" to confirm:');
    if (confirmation !== 'WIPE') {
      showToast('Vault reset cancelled.', 'info');
      return;
    }

    try {
      await VaultStorage.wipeDatabase();
      state.cryptoKey = null;
      state.unlocked = false;
      state.entries = [];
      state.folders = [];
      state.selectedId = null;

      stopAutoLockTimer();
      stopTOTPTicker();

      closeModal(el.modalSettings);
      showSetupView();
      showToast('Vault wiped completely. You can initialize a new one.', 'info');
    } catch (e) {
      showToast('Error resetting vault: ' + e.message, 'error');
    }
  }

  // --- MODAL CONTROLLERS ---
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    const firstInput = modalEl.querySelector('input:not([type=hidden]), textarea, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 50);
    }
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  // --- TOAST NOTIFICATION UTILITY ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="icon icon-sm" style="color:var(--success);" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="icon icon-sm" style="color:var(--danger);" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg class="icon icon-sm" style="color:var(--accent-primary);" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3800);
  }

  // --- REAL-TIME STRENGTH METER HOOKS ---
  function updateSetupPasswordStrength(val) {
    const s = VaultCrypto.evaluatePasswordStrength(val);
    el.setupPwStrengthBar.style.width = `${s.percent}%`;
    el.setupPwStrengthBar.style.backgroundColor = s.color;
    el.setupPwStrengthLabel.textContent = s.label;
    el.setupPwStrengthLabel.style.color = s.color;
    el.setupPwEntropy.textContent = `${s.entropy} bits`;
  }

  function updateEntryPasswordStrength(val) {
    const s = VaultCrypto.evaluatePasswordStrength(val);
    el.entryPwStrengthBar.style.width = `${s.percent}%`;
    el.entryPwStrengthBar.style.backgroundColor = s.color;
    el.entryPwStrengthLabel.textContent = s.label;
    el.entryPwStrengthLabel.style.color = s.color;
    el.entryPwEntropy.textContent = `${s.entropy} bits`;
  }

  // --- GLOBAL EVENT BINDINGS ---
  function bindGlobalEvents() {
    el.formUnlock.onsubmit = handleVaultUnlock;
    el.formSetup.onsubmit = handleVaultSetup;
    el.btnResetVaultLink.onclick = handleWipeVault;

    el.btnCloseDisclaimer.onclick = () => {
      el.disclaimerBanner.style.display = 'none';
    };

    el.setupPassword.oninput = (e) => updateSetupPasswordStrength(e.target.value);
    el.entryPassword.oninput = (e) => updateEntryPasswordStrength(e.target.value);

    document.querySelectorAll('.btn-toggle-pw').forEach(btn => {
      btn.onclick = () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
        }
      };
    });

    el.btnNewEntry.onclick = () => openNewEntryModal('login');
    el.btnEmptyNewEntry.onclick = () => openNewEntryModal('login');
    el.btnOpenGenerator.onclick = openGeneratorModal;
    el.btnOpenAudit.onclick = openSecurityAuditModal;
    el.btnOpenShortcuts.onclick = () => openModal(el.modalShortcuts);

    // Mobile Navigation Handlers
    el.btnMobileSidebarToggle.onclick = () => {
      el.appSidebar.classList.toggle('mobile-open');
    };
    el.btnCloseSidebarMobile.onclick = () => {
      el.appSidebar.classList.remove('mobile-open');
    };
    el.btnBackToList.onclick = () => {
      el.appDetailPane.classList.remove('mobile-active');
    };

    el.btnOpenSettings.onclick = () => {
      el.settingAutolock.value = state.settings.autoLockMinutes;
      el.settingClipboard.value = state.settings.clipboardClearSeconds;
      el.settingTheme.value = state.settings.theme;
      el.settingLockVisibility.checked = state.settings.lockOnVisibilityHidden;
      openModal(el.modalSettings);
    };
    el.btnLockNow.onclick = lockVault;
    el.btnThemeToggle.onclick = () => {
      const nextTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      VaultStorage.saveSettings(state.settings);
    };

    document.querySelectorAll('.sidebar-nav-item[data-filter]').forEach(item => {
      item.onclick = () => {
        setFilter({ kind: item.dataset.filter });
        closeMobileSidebar();
      };
    });
    document.querySelectorAll('.sidebar-nav-item[data-type]').forEach(item => {
      item.onclick = () => {
        setFilter({ kind: 'type', value: item.dataset.type });
        closeMobileSidebar();
      };
    });

    el.btnAddFolder.onclick = openNewFolderModal;
    el.btnSaveFolder.onclick = handleSaveFolder;
    el.btnOpenImportExport.onclick = openImportExportModal;

    el.searchInput.oninput = (e) => {
      state.searchQuery = e.target.value;
      el.btnClearSearch.classList.toggle('visible', !!state.searchQuery);
      renderEntryList();
    };
    el.btnClearSearch.onclick = () => {
      state.searchQuery = '';
      el.searchInput.value = '';
      el.btnClearSearch.classList.remove('visible');
      renderEntryList();
    };
    el.sortSelect.onchange = (e) => {
      state.sortBy = e.target.value;
      renderEntryList();
    };

    el.entryTypeTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => setEntryModalType(btn.dataset.type);
    });
    el.btnSaveEntry.onclick = handleSaveEntry;
    el.btnFormGenPw.onclick = () => {
      const pw = VaultGenerator.generatePassword({ length: 18, uppercase: true, lowercase: true, numbers: true, symbols: true });
      el.entryPassword.value = pw;
      el.entryPassword.type = 'text';
      updateEntryPasswordStrength(pw);
      showToast('Generated strong password.', 'info');
    };

    document.querySelectorAll('#gen-mode-tabs .tab-btn').forEach(btn => {
      btn.onclick = () => setGenMode(btn.dataset.genmode);
    });
    el.btnGenRefresh.onclick = refreshGeneratedPassword;
    el.btnGenCopy.onclick = () => copyToClipboard(el.genOutputText.textContent, 'Generated Password');
    el.genLengthSlider.oninput = (e) => {
      el.genLengthVal.textContent = e.target.value;
      refreshGeneratedPassword();
    };
    el.genWordsSlider.oninput = (e) => {
      el.genWordsVal.textContent = e.target.value;
      refreshGeneratedPassword();
    };
    el.genPinSlider.oninput = (e) => {
      el.genPinVal.textContent = e.target.value;
      refreshGeneratedPassword();
    };
    ['gen-opt-upper', 'gen-opt-lower', 'gen-opt-numbers', 'gen-opt-symbols', 'gen-opt-ambiguous', 'gen-separator', 'gen-passphrase-capitalize', 'gen-passphrase-number'].forEach(id => {
      const elem = document.getElementById(id);
      if (elem) elem.onchange = refreshGeneratedPassword;
    });

    document.querySelectorAll('#import-export-tabs .tab-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('#import-export-tabs .tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const isExport = btn.dataset.ietab === 'export';
        document.getElementById('pane-export').style.display = isExport ? 'block' : 'none';
        document.getElementById('pane-import').style.display = isExport ? 'none' : 'block';
        el.btnPerformImport.style.display = isExport ? 'none' : 'inline-flex';
      };
    });
    el.btnExportEncrypted.onclick = handleExportEncrypted;
    el.btnExportPlainJson.onclick = handleExportPlainJson;
    el.btnExportCsv.onclick = handleExportCsv;
    el.btnPerformImport.onclick = handlePerformImport;
    el.importFormat.onchange = (e) => {
      el.importPwGroup.style.display = e.target.value === 'vaultpass-encrypted' ? 'block' : 'none';
    };

    el.btnSaveSettings.onclick = async () => {
      state.settings.autoLockMinutes = parseInt(el.settingAutolock.value, 10);
      state.settings.clipboardClearSeconds = parseInt(el.settingClipboard.value, 10);
      state.settings.theme = el.settingTheme.value;
      state.settings.lockOnVisibilityHidden = el.settingLockVisibility.checked;

      applyTheme(state.settings.theme);
      await VaultStorage.saveSettings(state.settings);
      startAutoLockTimer();
      closeModal(el.modalSettings);
      showToast('Settings updated.', 'success');
    };
    el.btnOpenChangePw.onclick = () => openModal(el.modalChangePassword);
    el.btnSubmitChangePassword.onclick = handleChangeMasterPassword;
    el.btnOpenResetVault.onclick = handleWipeVault;
    el.btnConfirmDelete.onclick = handleConfirmDelete;

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.onclick = () => {
        const modalId = btn.dataset.modal;
        closeModal(document.getElementById(modalId));
      };
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.onclick = (e) => {
        if (e.target === backdrop) closeModal(backdrop);
      };
    });

    ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
      window.addEventListener(evt, resetAutoLockTimer, { passive: true });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.unlocked && state.settings.lockOnVisibilityHidden) {
        lockVault();
      }
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        el.searchInput.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (state.unlocked) openNewEntryModal('login');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        if (state.unlocked) lockVault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (state.unlocked) openGeneratorModal();
      } else if (e.key === '?' || ((e.ctrlKey || e.metaKey) && e.key === '/')) {
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          openModal(el.modalShortcuts);
        }
      } else if (e.key === 'Escape') {
        closeAllModals();
        if (el.appSidebar) el.appSidebar.classList.remove('mobile-open');
      }
    });
  }

  // --- HELPERS ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeJs(str) {
    if (!str) return '';
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
  }

  function formatCardNumber(num) {
    const clean = num.replace(/\D/g, '');
    const match = clean.match(/.{1,4}/g);
    return match ? match.join(' ') : clean;
  }

  return {
    init,
    copySecret: (val, label) => copyToClipboard(val, label),
    fixAuditIssue
  };
})();

document.addEventListener('DOMContentLoaded', VaultApp.init);
