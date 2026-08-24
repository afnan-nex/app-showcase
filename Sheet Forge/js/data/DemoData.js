/**
 * SheetForge - Realistic Demo Data Sets
 * High-fidelity financial models, enterprise sales trackers, and product roadmaps
 */
import { Workbook } from '../model/Workbook.js';

export class DemoData {
    static createDefaultWorkbook() {
        const wb = new Workbook('demo_workbook_1', 'SheetForge Executive Financial Suite');

        // =========================================================================
        // SHEET 1: 📊 SaaS Executive Financial Model
        // =========================================================================
        const s1 = wb.addSheet('📊 SaaS Executive Model', { tabColor: '#107c41' });
        s1.setColWidth(0, 240); // Metric Column
        s1.setColWidth(1, 115); // Q1 2026
        s1.setColWidth(2, 115); // Q2 2026
        s1.setColWidth(3, 115); // Q3 2026
        s1.setColWidth(4, 115); // Q4 2026
        s1.setColWidth(5, 135); // FY2026 Total
        s1.setColWidth(6, 115); // YoY Growth
        s1.setColWidth(7, 130); // Target Health

        // Sheet Header Title
        s1.mergeRange(0, 0, 0, 7);
        s1.setRowHeight(0, 38);
        const titleCell = s1.setCellValue(0, 0, 'SheetForge Executive SaaS Financial Model & Board Dashboard');
        titleCell.setStyle({
            bold: true,
            fontSize: 15,
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            alignH: 'center'
        });

        // Column Headers
        s1.setRowHeight(1, 28);
        const s1Headers = ['Financial Metric', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'FY2026 Total', 'Target Growth', 'Board Status'];
        s1Headers.forEach((h, c) => {
            const cell = s1.setCellValue(1, c, h);
            cell.setStyle({
                bold: true,
                fontSize: 12,
                backgroundColor: '#1e293b',
                color: '#ffffff',
                alignH: c === 0 ? 'left' : 'right'
            });
        });

        // Section 1: Revenue Metrics
        s1.setRowHeight(2, 24);
        const sec1 = s1.setCellValue(2, 0, 'REVENUE & UNIT ECONOMICS');
        sec1.setStyle({ bold: true, fontSize: 11, backgroundColor: '#f1f5f9', color: '#475569' });

        const revMetrics = [
            { name: 'Active Enterprise Subscriptions', q1: 1420, q2: 1680, q3: 2040, q4: 2450, fmt: 'number', dec: 0, isSum: true },
            { name: 'Average Contract Value (ACV)', q1: 12500, q2: 13200, q3: 14000, q4: 15200, fmt: 'currency', dec: 0, isAvg: true },
            { name: 'Annual Recurring Revenue (ARR)', q1: 17750000, q2: 22176000, q3: 28560000, q4: 37240000, fmt: 'currency', dec: 0, isSum: false },
            { name: 'Monthly Recurring Revenue (MRR)', q1: '=B6/12', q2: '=C6/12', q3: '=D6/12', q4: '=E6/12', fmt: 'currency', dec: 0, isAvg: true },
            { name: 'Net Revenue Retention (NRR)', q1: 1.18, q2: 1.21, q3: 1.24, q4: 1.28, fmt: 'percent', dec: 1, isAvg: true },
            { name: 'Gross Margin %', q1: 0.825, q2: 0.835, q3: 0.840, q4: 0.852, fmt: 'percent', dec: 1, isAvg: true }
        ];

        revMetrics.forEach((item, idx) => {
            const r = 3 + idx;
            s1.setRowHeight(r, 26);
            s1.setCellValue(r, 0, item.name).setStyle({ color: '#1e293b' });

            ['q1', 'q2', 'q3', 'q4'].forEach((qKey, cIdx) => {
                const c = 1 + cIdx;
                const cell = s1.setCellValue(r, c, item[qKey]);
                cell.numFormat = item.fmt;
                cell.decimals = item.dec;
                cell.setStyle({ alignH: 'right' });
            });

            // FY Total Formula
            const totFormula = item.isAvg ? `=AVERAGE(B${r + 1}:E${r + 1})` : `=SUM(B${r + 1}:E${r + 1})`;
            const totCell = s1.setCellValue(r, 5, totFormula);
            totCell.numFormat = item.fmt;
            totCell.decimals = item.dec;
            totCell.setStyle({ bold: true, alignH: 'right', backgroundColor: '#f8fafc' });

            // Growth Formula
            const grCell = s1.setCellValue(r, 6, `=(E${r + 1}-B${r + 1})/B${r + 1}`);
            grCell.numFormat = 'percent';
            grCell.decimals = 1;
            grCell.setStyle({ alignH: 'right' });

            // Status
            const stCell = s1.setCellValue(r, 7, `=IF(G${r + 1}>0.20,"EXCEEDED","ON TRACK")`);
            stCell.setStyle({ alignH: 'center', bold: true, color: '#16a34a' });
        });

        // Section 2: Operating Expenses
        s1.setRowHeight(9, 24);
        const sec2 = s1.setCellValue(9, 0, 'OPERATING EXPENSES (OPEX)');
        sec2.setStyle({ bold: true, fontSize: 11, backgroundColor: '#f1f5f9', color: '#475569' });

        const opexItems = [
            { name: 'Research & Product Engineering (R&D)', q1: 1850000, q2: 2100000, q3: 2450000, q4: 2800000 },
            { name: 'Sales & Growth Marketing (CAC)', q1: 1450000, q2: 1750000, q3: 2100000, q4: 2500000 },
            { name: 'Customer Success & Infrastructure', q1: 650000, q2: 720000, q3: 810000, q4: 920000 },
            { name: 'General, Legal & Administrative (G&A)', q1: 450000, q2: 480000, q3: 520000, q4: 580000 }
        ];

        opexItems.forEach((item, idx) => {
            const r = 10 + idx;
            s1.setRowHeight(r, 26);
            s1.setCellValue(r, 0, item.name).setStyle({ color: '#1e293b' });

            ['q1', 'q2', 'q3', 'q4'].forEach((qKey, cIdx) => {
                const c = 1 + cIdx;
                const cell = s1.setCellValue(r, c, item[qKey]);
                cell.numFormat = 'currency';
                cell.decimals = 0;
                cell.setStyle({ alignH: 'right' });
            });

            const totCell = s1.setCellValue(r, 5, `=SUM(B${r + 1}:E${r + 1})`);
            totCell.numFormat = 'currency';
            totCell.decimals = 0;
            totCell.setStyle({ bold: true, alignH: 'right', backgroundColor: '#f8fafc' });

            const grCell = s1.setCellValue(r, 6, `=(E${r + 1}-B${r + 1})/B${r + 1}`);
            grCell.numFormat = 'percent';
            grCell.decimals = 1;
            grCell.setStyle({ alignH: 'right' });

            const stCell = s1.setCellValue(r, 7, `=IF(G${r + 1}<0.60,"CONTROLLED","BUDGET WARN")`);
            stCell.setStyle({ alignH: 'center', bold: true, color: '#2563eb' });
        });

        // OPEX Summary Row
        s1.setRowHeight(14, 28);
        s1.setCellValue(14, 0, 'Total Operating Expenses').setStyle({ bold: true, backgroundColor: '#f8fafc' });
        for (let c = 1; c <= 4; c++) {
            const colLet = String.fromCharCode(65 + c);
            const sumCell = s1.setCellValue(14, c, `=SUM(${colLet}11:${colLet}14)`);
            sumCell.numFormat = 'currency';
            sumCell.decimals = 0;
            sumCell.setStyle({ bold: true, alignH: 'right', backgroundColor: '#f8fafc' });
        }
        const opexGrand = s1.setCellValue(14, 5, `=SUM(F11:F14)`);
        opexGrand.numFormat = 'currency';
        opexGrand.decimals = 0;
        opexGrand.setStyle({ bold: true, alignH: 'right', backgroundColor: '#e2e8f0' });

        // Net EBITDA Margin Row
        s1.setRowHeight(15, 30);
        s1.setCellValue(15, 0, 'Operating Income (EBITDA)').setStyle({ bold: true, backgroundColor: '#dcfce7', color: '#166534' });
        for (let c = 1; c <= 4; c++) {
            const colLet = String.fromCharCode(65 + c);
            const ebitdaCell = s1.setCellValue(15, c, `=(${colLet}6*${colLet}9)-${colLet}15`);
            ebitdaCell.numFormat = 'currency';
            ebitdaCell.decimals = 0;
            ebitdaCell.setStyle({ bold: true, alignH: 'right', backgroundColor: '#dcfce7', color: '#166534' });
        }
        const ebitdaGrand = s1.setCellValue(15, 5, `=SUM(B16:E16)`);
        ebitdaGrand.numFormat = 'currency';
        ebitdaGrand.decimals = 0;
        ebitdaGrand.setStyle({ bold: true, alignH: 'right', backgroundColor: '#bbf7d0', color: '#14532d' });

        // Add conditional formatting
        s1.conditionalFormats = [
            {
                range: { startRow: 3, startCol: 6, endRow: 15, endCol: 6 },
                rule: { type: 'greaterThan', value: '0.25', style: { backgroundColor: '#dcfce7', color: '#15803d' } }
            }
        ];

        // Add note to ARR header
        const noteCell = s1.getCell(5, 0);
        if (noteCell) noteCell.comment = 'Board approved 40% ARR growth target for fiscal 2026.';

        // =========================================================================
        // SHEET 2: 🛒 Enterprise Sales Pipeline
        // =========================================================================
        const s2 = wb.addSheet('🛒 Enterprise Sales Tracker', { tabColor: '#3b82f6' });
        s2.setColWidth(0, 160); // Rep Name
        s2.setColWidth(1, 160); // Account
        s2.setColWidth(2, 130); // Region
        s2.setColWidth(3, 120); // Deal Size
        s2.setColWidth(4, 110); // Probability %
        s2.setColWidth(5, 130); // Weighted Forecast
        s2.setColWidth(6, 120); // Stage
        s2.setColWidth(7, 120); // Commission

        s2.mergeRange(0, 0, 0, 7);
        s2.setRowHeight(0, 36);
        s2.setCellValue(0, 0, 'Global Enterprise Sales Pipeline & Commission Forecast').setStyle({
            bold: true,
            fontSize: 15,
            backgroundColor: '#1e3a8a',
            color: '#ffffff',
            alignH: 'center'
        });

        const s2Headers = ['Account Executive', 'Target Enterprise', 'Region', 'Contract Value', 'Probability', 'Weighted Value', 'Deal Stage', 'Rep Commission'];
        s2.setRowHeight(1, 28);
        s2Headers.forEach((h, c) => {
            s2.setCellValue(1, c, h).setStyle({
                bold: true,
                fontSize: 12,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                alignH: c <= 2 ? 'left' : (c === 6 ? 'center' : 'right')
            });
        });

        const deals = [
            { rep: 'Alex Rivera', acct: 'Stripe Global', region: 'North America', val: 240000, prob: 0.90, stage: 'Verbal' },
            { rep: 'Sophia Chen', acct: 'ByteDance Ltd', region: 'Asia-Pacific', val: 320000, prob: 0.75, stage: 'Negotiation' },
            { rep: 'Marcus Weber', acct: 'Siemens AG', region: 'Europe West', val: 180000, prob: 0.85, stage: 'Contract Sent' },
            { rep: 'Elena Rostova', acct: 'Kaspersky Lab', region: 'Europe East', val: 140000, prob: 0.60, stage: 'Technical QA' },
            { rep: 'David Kim', acct: 'Datadog Inc', region: 'North America', val: 410000, prob: 0.95, stage: 'Closed Won' },
            { rep: 'Liam O\'Connor', acct: 'Revolut Group', region: 'United Kingdom', val: 290000, prob: 0.70, stage: 'Proposal' },
            { rep: 'Isabella Silva', acct: 'Nubank SA', region: 'Latin America', val: 175000, prob: 0.80, stage: 'Contract Sent' },
            { rep: 'Julian Vance', acct: 'Canva Pty', region: 'Asia-Pacific', val: 210000, prob: 0.65, stage: 'Proposal' }
        ];

        deals.forEach((d, idx) => {
            const r = 2 + idx;
            s2.setRowHeight(r, 26);
            s2.setCellValue(r, 0, d.rep);
            s2.setCellValue(r, 1, d.acct);
            s2.setCellValue(r, 2, d.region);

            const vCell = s2.setCellValue(r, 3, d.val);
            vCell.numFormat = 'currency';
            vCell.decimals = 0;
            vCell.setStyle({ alignH: 'right' });

            const pCell = s2.setCellValue(r, 4, d.prob);
            pCell.numFormat = 'percent';
            pCell.decimals = 0;
            pCell.setStyle({ alignH: 'right' });

            const wCell = s2.setCellValue(r, 5, `=D${r + 1}*E${r + 1}`);
            wCell.numFormat = 'currency';
            wCell.decimals = 0;
            wCell.setStyle({ bold: true, alignH: 'right' });

            const stCell = s2.setCellValue(r, 6, d.stage);
            stCell.setStyle({ alignH: 'center', bold: true });

            const commCell = s2.setCellValue(r, 7, `=IF(E${r + 1}>=0.8,F${r + 1}*0.12,F${r + 1}*0.06)`);
            commCell.numFormat = 'currency';
            commCell.decimals = 0;
            commCell.setStyle({ bold: true, alignH: 'right', color: '#16a34a' });
        });

        // Summary Row
        const s2SummaryRow = 2 + deals.length;
        s2.setRowHeight(s2SummaryRow, 28);
        s2.setCellValue(s2SummaryRow, 0, 'Total Pipeline Summary').setStyle({ bold: true, backgroundColor: '#f1f5f9' });
        s2.setCellValue(s2SummaryRow, 1, '').setStyle({ backgroundColor: '#f1f5f9' });
        s2.setCellValue(s2SummaryRow, 2, '').setStyle({ backgroundColor: '#f1f5f9' });
        s2.setCellValue(s2SummaryRow, 3, `=SUM(D3:D${s2SummaryRow})`).setStyle({ bold: true, alignH: 'right', backgroundColor: '#e2e8f0' });
        s2.setCellValue(s2SummaryRow, 4, `=AVERAGE(E3:E${s2SummaryRow})`).setStyle({ bold: true, alignH: 'right', backgroundColor: '#f1f5f9' });
        s2.setCellValue(s2SummaryRow, 5, `=SUM(F3:F${s2SummaryRow})`).setStyle({ bold: true, alignH: 'right', backgroundColor: '#dbeafe', color: '#1e40af' });
        s2.setCellValue(s2SummaryRow, 6, '8 Deals').setStyle({ bold: true, alignH: 'center', backgroundColor: '#f1f5f9' });
        s2.setCellValue(s2SummaryRow, 7, `=SUM(H3:H${s2SummaryRow})`).setStyle({ bold: true, alignH: 'right', backgroundColor: '#dcfce7', color: '#15803d' });

        // =========================================================================
        // SHEET 3: 🚀 Q3 Engineering Roadmap
        // =========================================================================
        const s3 = wb.addSheet('🚀 Q3 Product Roadmap', { tabColor: '#8b5cf6' });
        s3.setColWidth(0, 220); // Milestone
        s3.setColWidth(1, 140); // Lead
        s3.setColWidth(2, 100); // Priority
        s3.setColWidth(3, 110); // Start Date
        s3.setColWidth(4, 110); // Target Date
        s3.setColWidth(5, 110); // Status
        s3.setColWidth(6, 110); // Completion %

        s3.mergeRange(0, 0, 0, 6);
        s3.setRowHeight(0, 36);
        s3.setCellValue(0, 0, 'Engineering Core Milestone Tracker & Deliverable Schedule').setStyle({
            bold: true,
            fontSize: 15,
            backgroundColor: '#4c1d95',
            color: '#ffffff',
            alignH: 'center'
        });

        const s3Headers = ['Product Deliverable', 'Technical Lead', 'Priority', 'Sprint Start', 'Release Date', 'Status', 'Completion %'];
        s3.setRowHeight(1, 28);
        s3Headers.forEach((h, c) => {
            s3.setCellValue(1, c, h).setStyle({
                bold: true,
                fontSize: 12,
                backgroundColor: '#6d28d9',
                color: '#ffffff',
                alignH: c <= 1 ? 'left' : (c >= 2 && c <= 5 ? 'center' : 'right')
            });
        });

        const roadmap = [
            { item: 'DAG Formula Recalculation Engine', lead: 'Sarah Jenkins', prio: 'P0', start: '2026-07-01', end: '2026-07-28', status: 'Live', pct: 1.0 },
            { item: 'HTML5 Canvas Charting System', lead: 'David Novak', prio: 'P0', start: '2026-07-15', end: '2026-08-10', status: 'Live', pct: 1.0 },
            { item: 'Virtualized 60fps Grid Scrolling', lead: 'Kenji Sato', prio: 'P0', start: '2026-08-01', end: '2026-08-20', status: 'Live', pct: 1.0 },
            { item: 'Multi-Sheet IndexedDB Autosave', lead: 'Elena Rostova', prio: 'P1', start: '2026-08-10', end: '2026-08-30', status: 'In Review', pct: 0.95 },
            { item: 'CSV & JSON Data Interchange Engine', lead: 'Marcus Vance', prio: 'P1', start: '2026-08-15', end: '2026-09-05', status: 'In QA', pct: 0.85 },
            { item: 'Real-Time Column Filtering Popovers', lead: 'Amara Okafor', prio: 'P2', start: '2026-08-20', end: '2026-09-15', status: 'In Progress', pct: 0.60 }
        ];

        roadmap.forEach((task, idx) => {
            const r = 2 + idx;
            s3.setRowHeight(r, 26);
            s3.setCellValue(r, 0, task.item);
            s3.setCellValue(r, 1, task.lead);

            const prioCell = s3.setCellValue(r, 2, task.prio);
            prioCell.setStyle({
                alignH: 'center',
                bold: true,
                color: task.prio === 'P0' ? '#ef4444' : '#f59e0b'
            });

            const startCell = s3.setCellValue(r, 3, task.start);
            startCell.numFormat = 'date';
            startCell.setStyle({ alignH: 'center' });

            const endCell = s3.setCellValue(r, 4, task.end);
            endCell.numFormat = 'date';
            endCell.setStyle({ alignH: 'center' });

            const stCell = s3.setCellValue(r, 5, task.status);
            stCell.setStyle({
                alignH: 'center',
                bold: true,
                color: task.status === 'Live' ? '#16a34a' : '#2563eb'
            });

            const pctCell = s3.setCellValue(r, 6, task.pct);
            pctCell.numFormat = 'percent';
            pctCell.decimals = 0;
            pctCell.setStyle({ alignH: 'right', bold: true });
        });

        // Set active sheet to SaaS model
        wb.activeSheetId = s1.id;

        return wb;
    }
}
