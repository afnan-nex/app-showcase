/**
 * SheetForge - Storage Engine
 * Persistent storage using IndexedDB with fallback to localStorage
 */
export class Storage {
    constructor(dbName = 'SheetForgeDB', version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.storeName = 'workbooks';
        this.db = null;
        this._initPromise = this._initDB();
    }

    async _initDB() {
        if (!('indexedDB' in window)) {
            console.warn('IndexedDB not supported, falling back to localStorage');
            return null;
        }

        return new Promise((resolve) => {
            try {
                const request = indexedDB.open(this.dbName, this.version);

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName, { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('settings')) {
                        db.createObjectStore('settings', { keyPath: 'key' });
                    }
                };

                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve(this.db);
                };

                request.onerror = (event) => {
                    console.warn('IndexedDB open error:', event.target.error);
                    resolve(null);
                };
            } catch (err) {
                console.warn('IndexedDB init exception:', err);
                resolve(null);
            }
        });
    }

    async saveWorkbook(workbookData) {
        await this._initPromise;
        const record = {
            id: workbookData.id || 'default_workbook',
            title: workbookData.title || 'Untitled Spreadsheet',
            updatedAt: Date.now(),
            data: workbookData
        };

        if (this.db) {
            return new Promise((resolve, reject) => {
                try {
                    const tx = this.db.transaction([this.storeName], 'readwrite');
                    const store = tx.objectStore(this.storeName);
                    const req = store.put(record);
                    req.onsuccess = () => resolve(true);
                    req.onerror = (e) => {
                        console.error('IndexedDB save error:', e.target.error);
                        this._saveToLocalStorage(record);
                        resolve(false);
                    };
                } catch (e) {
                    this._saveToLocalStorage(record);
                    resolve(false);
                }
            });
        } else {
            this._saveToLocalStorage(record);
            return true;
        }
    }

    async loadWorkbook(workbookId = 'default_workbook') {
        await this._initPromise;
        if (this.db) {
            return new Promise((resolve) => {
                try {
                    const tx = this.db.transaction([this.storeName], 'readonly');
                    const store = tx.objectStore(this.storeName);
                    const req = store.get(workbookId);
                    req.onsuccess = () => {
                        if (req.result && req.result.data) {
                            resolve(req.result.data);
                        } else {
                            resolve(this._loadFromLocalStorage(workbookId));
                        }
                    };
                    req.onerror = () => {
                        resolve(this._loadFromLocalStorage(workbookId));
                    };
                } catch (e) {
                    resolve(this._loadFromLocalStorage(workbookId));
                }
            });
        } else {
            return this._loadFromLocalStorage(workbookId);
        }
    }

    async saveSetting(key, value) {
        await this._initPromise;
        if (this.db) {
            try {
                const tx = this.db.transaction(['settings'], 'readwrite');
                tx.objectStore('settings').put({ key, value });
            } catch (e) {
                localStorage.setItem(`sheetforge_setting_${key}`, JSON.stringify(value));
            }
        } else {
            localStorage.setItem(`sheetforge_setting_${key}`, JSON.stringify(value));
        }
    }

    async loadSetting(key, defaultValue = null) {
        await this._initPromise;
        if (this.db) {
            return new Promise((resolve) => {
                try {
                    const tx = this.db.transaction(['settings'], 'readonly');
                    const req = tx.objectStore('settings').get(key);
                    req.onsuccess = () => {
                        if (req.result !== undefined && req.result.value !== undefined) {
                            resolve(req.result.value);
                        } else {
                            resolve(this._loadSettingLocalStorage(key, defaultValue));
                        }
                    };
                    req.onerror = () => resolve(this._loadSettingLocalStorage(key, defaultValue));
                } catch (e) {
                    resolve(this._loadSettingLocalStorage(key, defaultValue));
                }
            });
        }
        return this._loadSettingLocalStorage(key, defaultValue);
    }

    _saveToLocalStorage(record) {
        try {
            localStorage.setItem(`sheetforge_wb_${record.id}`, JSON.stringify(record));
        } catch (e) {
            console.warn('localStorage save failed (quota exceeded?):', e);
        }
    }

    _loadFromLocalStorage(workbookId) {
        try {
            const raw = localStorage.getItem(`sheetforge_wb_${workbookId}`);
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed.data || parsed;
            }
        } catch (e) {
            console.error('localStorage load failed:', e);
        }
        return null;
    }

    _loadSettingLocalStorage(key, defaultValue) {
        try {
            const val = localStorage.getItem(`sheetforge_setting_${key}`);
            return val !== null ? JSON.parse(val) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }
}
