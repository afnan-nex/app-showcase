/**
 * SheetForge - Workbook Model
 * Represents the entire workbook containing multiple sheets, metadata, and active sheet pointer
 */
import { Sheet } from './Sheet.js';

export class Workbook {
    constructor(id = 'default_workbook', title = 'SheetForge Untitled Spreadsheet') {
        this.id = id;
        this.title = title;
        this.sheets = [];
        this.activeSheetId = null;
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    }

    getActiveSheet() {
        if (!this.activeSheetId && this.sheets.length > 0) {
            this.activeSheetId = this.sheets[0].id;
        }
        return this.sheets.find(s => s.id === this.activeSheetId) || this.sheets[0] || null;
    }

    getSheetById(id) {
        return this.sheets.find(s => s.id === id) || null;
    }

    getSheetByName(name) {
        if (!name) return null;
        const clean = name.trim().toLowerCase();
        return this.sheets.find(s => s.name.trim().toLowerCase() === clean) || null;
    }

    setActiveSheet(id) {
        const sheet = this.getSheetById(id);
        if (sheet) {
            this.activeSheetId = sheet.id;
            return true;
        }
        return false;
    }

    addSheet(name = null, options = {}) {
        let sheetName = name;
        if (!sheetName) {
            let index = this.sheets.length + 1;
            sheetName = `Sheet${index}`;
            while (this.getSheetByName(sheetName)) {
                index++;
                sheetName = `Sheet${index}`;
            }
        }
        const sheet = new Sheet(null, sheetName, options);
        this.sheets.push(sheet);
        if (!this.activeSheetId) {
            this.activeSheetId = sheet.id;
        }
        this.updatedAt = Date.now();
        return sheet;
    }

    duplicateSheet(sheetId) {
        const sourceSheet = this.getSheetById(sheetId);
        if (!sourceSheet) return null;

        let newName = `Copy of ${sourceSheet.name}`;
        let counter = 2;
        while (this.getSheetByName(newName)) {
            newName = `Copy (${counter}) of ${sourceSheet.name}`;
            counter++;
        }

        const clone = sourceSheet.clone();
        clone.id = `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        clone.name = newName;

        const sourceIndex = this.sheets.findIndex(s => s.id === sheetId);
        this.sheets.splice(sourceIndex + 1, 0, clone);
        this.activeSheetId = clone.id;
        this.updatedAt = Date.now();
        return clone;
    }

    deleteSheet(sheetId) {
        if (this.sheets.length <= 1) {
            throw new Error('A workbook must contain at least one visible worksheet.');
        }
        const index = this.sheets.findIndex(s => s.id === sheetId);
        if (index === -1) return false;

        this.sheets.splice(index, 1);
        if (this.activeSheetId === sheetId) {
            const nextIndex = Math.min(index, this.sheets.length - 1);
            this.activeSheetId = this.sheets[nextIndex].id;
        }
        this.updatedAt = Date.now();
        return true;
    }

    renameSheet(sheetId, newName) {
        const cleanName = newName ? newName.trim() : '';
        if (!cleanName) {
            throw new Error('Sheet name cannot be empty.');
        }
        const existing = this.getSheetByName(cleanName);
        if (existing && existing.id !== sheetId) {
            throw new Error(`A sheet named "${cleanName}" already exists.`);
        }
        const sheet = this.getSheetById(sheetId);
        if (sheet) {
            sheet.name = cleanName;
            this.updatedAt = Date.now();
            return true;
        }
        return false;
    }

    reorderSheet(sheetId, targetIndex) {
        const currentIndex = this.sheets.findIndex(s => s.id === sheetId);
        if (currentIndex === -1 || targetIndex < 0 || targetIndex >= this.sheets.length) return false;
        const [sheet] = this.sheets.splice(currentIndex, 1);
        this.sheets.splice(targetIndex, 0, sheet);
        this.updatedAt = Date.now();
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            activeSheetId: this.activeSheetId,
            sheets: this.sheets.map(s => s.toJSON())
        };
    }

    static fromJSON(json) {
        const wb = new Workbook(json.id, json.title);
        wb.createdAt = json.createdAt || Date.now();
        wb.updatedAt = json.updatedAt || Date.now();
        wb.activeSheetId = json.activeSheetId || null;
        if (Array.isArray(json.sheets)) {
            wb.sheets = json.sheets.map(s => Sheet.fromJSON(s));
        }
        if (wb.sheets.length === 0) {
            wb.addSheet('Sheet1');
        }
        if (!wb.activeSheetId || !wb.getSheetById(wb.activeSheetId)) {
            wb.activeSheetId = wb.sheets[0].id;
        }
        return wb;
    }
}
