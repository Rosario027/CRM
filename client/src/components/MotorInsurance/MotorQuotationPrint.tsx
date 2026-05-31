import React from 'react';
import type { MotorQuotationData, MotorPack } from './MotorQuotation';
import './QuotationPrint.css';

interface Props { data: MotorQuotationData; }

const INSURER_COLORS: Record<string, { bg: string; color: string }> = {
    'RELIANCE GENERAL INSURANCE': { bg: '#003087', color: '#fff' },
    'ROYAL SUNDARAM INSURANCE': { bg: '#e31837', color: '#fff' },
    'ICICI LOMBARD': { bg: '#ee3124', color: '#fff' },
    'TATA AIG': { bg: '#002f6c', color: '#fff' },
    'IndusInd General Insurance': { bg: '#5c2d91', color: '#fff' },
    'Bajaj Allianz': { bg: '#003087', color: '#fff' },
    'HDFC ERGO': { bg: '#e31837', color: '#fff' },
    'New India Assurance': { bg: '#006400', color: '#fff' },
    'Oriental Insurance': { bg: '#ff6600', color: '#fff' },
    'United India Insurance': { bg: '#003087', color: '#fff' },
    'National Insurance': { bg: '#006400', color: '#fff' },
    'SBI General': { bg: '#003087', color: '#fff' },
    'Kotak General': { bg: '#e31837', color: '#fff' },
    'IFFCO Tokio': { bg: '#ff6600', color: '#fff' },
    'Digit Insurance': { bg: '#3d348b', color: '#fff' },
    'Acko General': { bg: '#2d3be0', color: '#fff' },
    'Zurich Kotak': { bg: '#1a5276', color: '#fff' },
};

const getColor = (name: string) => INSURER_COLORS[name] || { bg: '#555', color: '#fff' };

const fmtAmt = (v?: string): string => {
    if (!v || v === '' || v === '0') return '-';
    const n = parseFloat(v);
    if (isNaN(n)) return v;
    return n.toLocaleString('en-IN');
};

const cellVal = (pack: MotorPack, val: string, inclFlag: boolean): React.ReactNode => {
    if (pack.declined) return <span style={{ color: '#999' }}>-</span>;
    if (inclFlag) return <span className="incl-cell">included</span>;
    if (!val || val === '0' || val === '') return '-';
    return fmtAmt(val);
};

const ROWS: { key: keyof MotorPack; inclKey?: keyof MotorPack; label: string; section?: string; bold?: boolean; highlight?: boolean }[] = [
    { key: 'idv', label: 'Insurance Cover / IDV', bold: true },
    { key: 'od', inclKey: 'odIncluded', label: 'Own Damage Insurance (OD)' },
    { key: 'rsa', label: 'Road Side Assistance (RSA)' },
    { key: 'ema', label: 'Emergency Medical Assist (EMA)' },
    { key: 'zeroDep', inclKey: 'zeroDeptIncluded', label: 'Zero Depr Cover', section: 'ADD ON Covers' },
    { key: 'consumables', inclKey: 'consumablesIncluded', label: 'Consumables' },
    { key: 'engineProtect', inclKey: 'engineProtectIncluded', label: 'Engine Protect' },
    { key: 'tyreProtect', label: 'Tyre Protect' },
    { key: 'keyReplacement', inclKey: 'keyReplacementIncluded', label: 'Key Replacement' },
    { key: 'lossOfBelongings', inclKey: 'lossOfBelongingsIncluded', label: 'Loss of Personal Belongings' },
    { key: 'returnToInvoice', label: 'Return to Invoice' },
    { key: 'ncbProtect', label: 'NCB Protect' },
    { key: 'windshieldProtect', label: 'Windshield Protect (max 2)' },
    { key: 'imt23', inclKey: 'imt23Included', label: 'IMT 23' },
    { key: 'additionalTowing', label: 'Additional Towing' },
    { key: 'paAndTp', label: 'PA cover + TP / Legal liability' },
    { key: 'gst', label: 'GST' },
    { key: 'totalPremium', label: 'Total Premium', bold: true, highlight: true },
];

const MotorQuotationPrint: React.FC<Props> = ({ data }) => {
    const formatDate = (d?: string) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Build columns: each pack of each insurer
    const columns: { insurer: string; pack: MotorPack }[] = [];
    data.insurers.forEach(ins => {
        ins.packs.forEach(pack => {
            columns.push({ insurer: ins.name, pack });
        });
    });

    // Group columns by insurer for header spanning
    const insurerGroups: { name: string; count: number }[] = [];
    data.insurers.forEach(ins => {
        insurerGroups.push({ name: ins.name, count: ins.packs.length });
    });

    let sectionShown = new Set<string>();

    return (
        <div className="quotation-print motor-quotation-print">
            {/* Header */}
            <div className="qprint-header">
                <div className="qprint-customer-info">
                    <table className="customer-table">
                        <tbody>
                            <tr><td className="cinfo-label">Customer</td><td className="cinfo-value">{data.customerName}</td></tr>
                            <tr><td className="cinfo-label">Reg No</td><td className="cinfo-value">{data.regNo}</td></tr>
                            <tr><td className="cinfo-label">Due Date</td><td className="cinfo-value">{formatDate(data.dueDate)}</td></tr>
                            <tr><td className="cinfo-label">Vehicle</td><td className="cinfo-value">{data.vehicleMake} {data.vehicleModel}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="qprint-brand">
                    <div className="brand-logo-print">
                        <span className="brand-icon-print">🌿</span>
                        <div>
                            <div className="brand-name-print">NEWERA</div>
                            <div className="brand-tagline-print">Insure to Secure</div>
                        </div>
                    </div>
                    <div className="brand-url-print">https://isecurenow.com/</div>
                </div>
            </div>

            {/* Quotation Table */}
            <table className="qprint-table">
                <thead>
                    {/* Insurer name row */}
                    <tr>
                        <th className="row-label-header"></th>
                        {insurerGroups.map((g, i) => {
                            const color = getColor(g.name);
                            return (
                                <th key={i} colSpan={g.count} className="insurer-header" style={{ background: color.bg, color: color.color }}>
                                    {g.name}
                                </th>
                            );
                        })}
                    </tr>
                    {/* Pack name row */}
                    <tr>
                        <th className="row-label-header"></th>
                        {columns.map((col, i) => (
                            <th key={i} className="pack-header-cell">
                                {col.pack.declined ? <span style={{ color: '#e53e3e', fontWeight: 700 }}>Declined</span> : col.pack.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ROWS.map((row, rIdx) => {
                        const showSection = row.section && !sectionShown.has(row.section);
                        if (row.section) sectionShown.add(row.section);
                        return (
                            <React.Fragment key={rIdx}>
                                {showSection && (
                                    <tr className="section-header-row">
                                        <td colSpan={columns.length + 1} className="section-label">{row.section}</td>
                                    </tr>
                                )}
                                <tr className={`${row.highlight ? 'total-row' : ''} ${row.bold ? 'bold-row' : ''}`}>
                                    <td className="row-label">{row.label}</td>
                                    {columns.map((col, cIdx) => (
                                        <td key={cIdx} className={`data-cell ${row.highlight ? 'total-cell' : ''}`}>
                                            {col.pack.declined ? '-' : cellVal(col.pack, col.pack[row.key] as string, row.inclKey ? col.pack[row.inclKey] as boolean : false)}
                                        </td>
                                    ))}
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            <div className="qprint-footer">
                IRDA License no: IMF06740320230589
            </div>
        </div>
    );
};

export default MotorQuotationPrint;
