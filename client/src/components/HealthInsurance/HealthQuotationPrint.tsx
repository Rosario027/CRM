import React from 'react';
import { HealthQuotationData, FamilyMember, HealthPlan } from './HealthQuotation';
import '../MotorInsurance/QuotationPrint.css';
import './HealthInsurance.css';

interface Props { data: HealthQuotationData; }

const INSURER_COLORS: Record<string, string> = {
    'Star Health': '#e31837',
    'Niva Bupa': '#6a0dad',
    'ICICI Lombard': '#ee3124',
    'Reliance General': '#003087',
    'HDFC ERGO': '#005da0',
    'Care Health': '#00a86b',
    'Aditya Birla Health': '#e31837',
    'Tata AIG Health': '#002f6c',
    'Bajaj Allianz Health': '#003087',
};

const getColor = (name: string) => INSURER_COLORS[name] || '#555';

const fmtDate = (d?: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const calcAge = (dob?: string): string => {
    if (!dob) return '';
    const birth = new Date(dob);
    const now = new Date();
    return String(now.getFullYear() - birth.getFullYear());
};

const FEATURE_ROWS: { key: keyof HealthPlan; label: string; highlight?: boolean; greenHighlight?: boolean }[] = [
    { key: 'healthCheckup', label: 'Health checkup for family' },
    { key: 'globalCover', label: 'Global Cover' },
    { key: 'borderless5Cr', label: 'Borderless 5 Crores (Overseas)', greenHighlight: true },
    { key: 'consumables', label: 'Consumables expenses (PPE, Gloves)' },
    { key: 'homeCare', label: 'Homecare treatment' },
    { key: 'maternity', label: 'Maternity cover' },
    { key: 'subLimits', label: 'Sub limits' },
    { key: 'deductible', label: 'Deductible / Co Pay' },
    { key: 'opd', label: 'OPD 5k and Dental 10k (after 2 yrs)' },
    { key: 'noClaimBonus', label: 'No claim Bonus' },
    { key: 'premiumUntilClaimed', label: 'Premium until claimed', greenHighlight: true },
    { key: 'waitingPeriodPED', label: 'Waiting period - PED' },
    { key: 'premiumPaidFor', label: 'Premium paid for' },
];

const renderVal = (plan: HealthPlan, key: keyof HealthPlan): React.ReactNode => {
    const val = plan[key];
    if (typeof val === 'boolean') return val ? 'Yes' : '';
    if (!val || val === '') return '';
    return String(val);
};

const HealthQuotationPrint: React.FC<Props> = ({ data }) => {
    const { members, plans } = data;

    return (
        <div className="quotation-print health-quotation-print">
            {/* Header: members + brand */}
            <div className="health-header">
                <div className="health-members-row">
                    {members.map((m, i) => (
                        <div key={i} className="member-info-col">
                            <div className="member-relation">{m.relation}</div>
                            {m.dob && <div className="member-dob">{fmtDate(m.dob)}</div>}
                            {m.height && <div className="member-stat">{m.height}</div>}
                            {m.weight && <div className="member-stat">{m.weight}</div>}
                        </div>
                    ))}
                </div>
                <div className="qprint-brand" style={{ textAlign: 'right' }}>
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

            <table className="qprint-table health-table">
                <thead>
                    {/* Insurer names */}
                    <tr>
                        <th className="row-label-header">Medical Quote</th>
                        {plans.map((plan, i) => (
                            <th key={i} className="insurer-header" style={{ background: getColor(plan.insurerName), color: '#fff' }}>
                                <div className="h-insurer-header">
                                    <span className="h-insurer-name">{plan.insurerName}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                    {/* Plan names */}
                    <tr>
                        <th className="row-label-header">Cover</th>
                        {plans.map((plan, i) => (
                            <th key={i} className="pack-header-cell">{plan.planName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Cover tiers */}
                    {[
                        { key: 'cover10L' as keyof HealthPlan, label: '10 lakhs' },
                        { key: 'cover20L' as keyof HealthPlan, label: '20 lakhs' },
                        { key: 'cover25L' as keyof HealthPlan, label: '25 lakhs' },
                        { key: 'coverUnlimited' as keyof HealthPlan, label: 'Unlimited' },
                    ].map(row => (
                        <tr key={row.key} className={row.key === 'coverUnlimited' ? 'unlimited-row' : ''}>
                            <td className="row-label">{row.label}</td>
                            {plans.map((plan, i) => (
                                <td key={i} className="data-cell">{renderVal(plan, row.key) || ''}</td>
                            ))}
                        </tr>
                    ))}

                    {/* Separator */}
                    <tr className="section-gap"><td colSpan={plans.length + 1}></td></tr>

                    {/* Feature rows */}
                    {FEATURE_ROWS.map(row => (
                        <tr key={row.key} className={row.greenHighlight ? 'green-highlight-row' : ''}>
                            <td className={`row-label ${row.greenHighlight ? 'green-label' : ''}`}>{row.label}</td>
                            {plans.map((plan, i) => {
                                const val = renderVal(plan, row.key);
                                return (
                                    <td key={i} className={`data-cell ${row.greenHighlight && val ? 'green-cell' : ''}`}>
                                        {val || ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="qprint-footer">
                IRDA License no: IMF06740320230589
            </div>
        </div>
    );
};

export default HealthQuotationPrint;
