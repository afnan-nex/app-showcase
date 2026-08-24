/**
 * SheetForge - Import & Export Manager
 * CSV Import/Export, full JSON Workbook Backup/Restore, and Printable Spreadsheet generator
 */
export class IOManager {
    static parseCSV(text) {
        const rows = [];
        let currentRow = [];
        let currentField = '';
        let insideQuotes = false;
        let i = 0;
        const len = text.length;

        // Auto-detect delimiter if comma, semicolon, or tab
        const firstLine = text.split(/\r?\n/)[0] || '';
        let delimiter = ',';
        const commas = (firstLine.match(/,/g) || []).length;
        const semicolons = (firstLine.match(/;/g) || []).length;
        const tabs = (firstLine.match(/\t/g) || []).length;
        if (semicolons > commas && semicolons > tabs) delimiter = ';';
        else if (tabs > commas && tabs > semicolons) delimiter = '\t';

        while (i < len) {
            const ch = text[i];
            const nextCh = text[i + 1];

            if (insideQuotes) {
                if (ch === '"') {
                    if (nextCh === '"') {
                        // Escaped quote
                        currentField += '"';
                        i += 2;
                        continue;
                    } else {
                        // Closing quote
                        insideQuotes = false;
                        i++;
                        continue;
                    }
                } else {
                    currentField += ch;
                    i++;
                    continue;
                }
            }

            if (ch === '"') {
                insideQuotes = true;
                i++;
                continue;
            }

            if (ch === delimiter) {
                currentRow.push(currentField);
                currentField = '';
                i++;
                continue;
            }

            if (ch === '\r') {
                if (nextCh === '\n') i++;
                currentRow.push(currentField);
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
                i++;
                continue;
            }

            if (ch === '\n') {
                currentRow.push(currentField);
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
                i++;
                continue;
            }

            currentField += ch;
            i++;
        }

        if (currentField || currentRow.length > 0) {
            currentRow.push(currentField);
            rows.push(currentRow);
        }

        return rows;
    }

    static exportSheetToCSV(sheet) {
        if (!sheet) return '';
        const bounds = sheet.getDataBounds();
        const lines = [];

        for (let r = 0; r <= bounds.endRow; r++) {
            const rowVals = [];
            for (let c = 0; c <= bounds.endCol; c++) {
                const cell = sheet.getCell(r, c);
                let val = '';
                if (cell) {
                    val = cell.rawValue !== null && cell.rawValue !== undefined ? String(cell.rawValue) : '';
                }

                // Quote if contains comma, quote, or newline
                if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
                    val = `"${val.replace(/"/g, '""')}"`;
                }
                rowVals.push(val);
            }
            lines.push(rowVals.join(','));
        }

        return lines.join('\r\n');
    }

    static downloadFile(content, fileName, mimeType = 'text/plain;charset=utf-8') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static openFileDialog(accept = '.csv,text/csv') {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) {
                    resolve(null);
                    return;
                }
                const reader = new FileReader();
                reader.onload = (evt) => resolve({ name: file.name, content: evt.target.result });
                reader.onerror = () => resolve(null);
                reader.readAsText(file);
            };
            input.click();
        });
    }

    static printSpreadsheet(sheet) {
        window.print();
    }
}
