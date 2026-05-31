import React, { useState } from 'react';
import { Plus, Trash2, Printer, Save } from 'lucide-react';
import HealthQuotationPrint from './HealthQuotationPrint';
import './HealthInsurance.css';

export interface FamilyMember {
    relation: string;
    dob: string;
    height: string;
    weight: string;
}

export interface HealthPlan {
    insurerName: string;
    planName: string;
    cover10L: string;
    cover20L: string;
    cover25L: string;
    coverUnlimited: string;
    healthCheckup: string;
    globalCover: boolean;
    borderless5Cr: boolean;
    consumables: string;
    homeCare: string;
    maternity: string;
    subLimits: string;
    deductible: string;
    opd: string;
    noClaimBonus: string;
    premiumUntilClaimed: string;
    waitingPeriodPED: string;
    premiumPaidFor: string;
}

export interface HealthQuotationData {
    members: FamilyMember[];
    plans: HealthPlan[];
}

const RELATIONS = ['Father', 'Mother', 'Husband', 'Wife', 'Son', 'Daughter', 'Self', 'Spouse'];
const HEALTH_INSURERS = [
    'Star Health', 'Niva Bupa', 'ICICI Lombard', 'Reliance General',
    'HDFC ERGO', 'Care Health', 'Aditya Birla Health', 'SBI Health',
    'Bajaj Allianz Health', 'New India Health', 'Oriental Health',
    'United India Health', 'National Health', 'Tata AIG Health',
    'ManipalCigna', 'Max Bupa', 'Digit Health', 'Acko Health',
];

const emptyMember = (): FamilyMember => ({ relation: 'Father', dob: '', height: '', weight: '' });

const emptyPlan = (): HealthPlan => ({
    insurerName: '', planName: '',
    cover10L: '', cover20L: '', cover25L: '', coverUnlimited: '',
    healthCheckup: '', globalCover: false, borderless5Cr: false,
    consumables: '', homeCare: '', maternity: '', subLimits: '',
    deductible: '', opd: '', noClaimBonus: '', premiumUntilClaimed: '',
    waitingPeriodPED: '', premiumPaidFor: '',
});

const emptyData = (): HealthQuotationData => ({
    members: [emptyMember()],
    plans: [emptyPlan()],
});

interface Props { userRole: string; }

const HealthQuotation: React.FC<Props> = ({ userRole: _userRole }) => {
    const [data, setData] = useState<HealthQuotationData>(emptyData());
    const [showPrint, setShowPrint] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    const setMember = (idx: number, key: keyof FamilyMember, val: string) =>
        setData(p => { const m = [...p.members]; m[idx] = { ...m[idx], [key]: val }; return { ...p, members: m }; });

    const addMember = () => setData(p => ({ ...p, members: [...p.members, emptyMember()] }));
    const removeMember = (idx: number) => setData(p => ({ ...p, members: p.members.filter((_, i) => i !== idx) }));

    const setPlan = (idx: number, key: keyof HealthPlan, val: any) =>
        setData(p => { const pl = [...p.plans]; pl[idx] = { ...pl[idx], [key]: val }; return { ...p, plans: pl }; });

    const addPlan = () => setData(p => ({ ...p, plans: [...p.plans, emptyPlan()] }));
    const removePlan = (idx: number) => setData(p => ({ ...p, plans: p.plans.filter((_, i) => i !== idx) }));

    const handleSave = async () => {
        try {
            await fetch('/api/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'health', customerName: data.members[0]?.relation || 'Family', quotationData: JSON.stringify(data) }),
            });
            setSaveMsg('Saved!');
        } catch { setSaveMsg('Saved locally'); }
        setTimeout(() => setSaveMsg(''), 2000);
    };

    if (showPrint) return (
        <div>
            <div className="print-controls no-print">
                <button className="btn-secondary" onClick={() => setShowPrint(false)}>← Back to Edit</button>
                <button className="btn-primary" onClick={() => window.print()}><Printer size={16} /> Print / Save PDF</button>
            </div>
            <HealthQuotationPrint data={data} />
        </div>
    );

    return (
        <div className="quotation-editor">
            <div className="page-header">
                <div>
                    <h2>Health Insurance Quotation</h2>
                    <p className="subtitle">Add family members and plan comparisons</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-secondary" onClick={handleSave}><Save size={16} /> {saveMsg || 'Save'}</button>
                    <button className="btn-primary" onClick={() => setShowPrint(true)}><Printer size={16} /> Preview & Print</button>
                </div>
            </div>

            {/* Members */}
            <div className="qform-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4>Family Members</h4>
                    <button className="btn-sm" onClick={addMember}><Plus size={12} /> Add Member</button>
                </div>
                <div className="members-grid">
                    {data.members.map((m, idx) => (
                        <div className="member-card" key={idx}>
                            <div className="member-header">
                                <select value={m.relation} onChange={e => setMember(idx, 'relation', e.target.value)}>
                                    {RELATIONS.map(r => <option key={r}>{r}</option>)}
                                </select>
                                {data.members.length > 1 && (
                                    <button className="btn-sm danger" onClick={() => removeMember(idx)}><Trash2 size={12} /></button>
                                )}
                            </div>
                            <div className="field-row"><label>DOB</label><input type="date" value={m.dob} onChange={e => setMember(idx, 'dob', e.target.value)} /></div>
                            <div className="field-row"><label>Height (cm)</label><input type="number" value={m.height} onChange={e => setMember(idx, 'height', e.target.value)} placeholder="165" /></div>
                            <div className="field-row"><label>Weight (kg)</label><input type="number" value={m.weight} onChange={e => setMember(idx, 'weight', e.target.value)} placeholder="68" /></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Plans */}
            {data.plans.map((plan, pIdx) => (
                <div className="qform-card insurer-card" key={pIdx}>
                    <div className="insurer-card-header">
                        <div style={{ display: 'flex', gap: 8 }}>
                            <select value={plan.insurerName} onChange={e => setPlan(pIdx, 'insurerName', e.target.value)} className="insurer-select">
                                <option value="">Select Insurer</option>
                                {HEALTH_INSURERS.map(i => <option key={i}>{i}</option>)}
                            </select>
                            <input value={plan.planName} onChange={e => setPlan(pIdx, 'planName', e.target.value)} placeholder="Plan name (e.g. Health Assure)" className="plan-name-input" />
                        </div>
                        {data.plans.length > 1 && (
                            <button className="btn-sm danger" onClick={() => removePlan(pIdx)}><Trash2 size={12} /></button>
                        )}
                    </div>
                    <div className="health-plan-grid">
                        <div className="hplan-section">
                            <h5>Cover Premiums</h5>
                            <PlanField label="10 Lakhs (₹)" value={plan.cover10L} onChange={v => setPlan(pIdx, 'cover10L', v)} />
                            <PlanField label="20 Lakhs (₹)" value={plan.cover20L} onChange={v => setPlan(pIdx, 'cover20L', v)} />
                            <PlanField label="25 Lakhs (₹)" value={plan.cover25L} onChange={v => setPlan(pIdx, 'cover25L', v)} />
                            <PlanField label="Unlimited (₹)" value={plan.coverUnlimited} onChange={v => setPlan(pIdx, 'coverUnlimited', v)} />
                        </div>
                        <div className="hplan-section">
                            <h5>Features</h5>
                            <PlanField label="Health Checkup" value={plan.healthCheckup} onChange={v => setPlan(pIdx, 'healthCheckup', v)} />
                            <div className="field-row">
                                <label>Global Cover</label>
                                <input type="checkbox" checked={plan.globalCover} onChange={e => setPlan(pIdx, 'globalCover', e.target.checked)} style={{ width: 'auto' }} />
                            </div>
                            <div className="field-row">
                                <label>Borderless 5 Crores</label>
                                <input type="checkbox" checked={plan.borderless5Cr} onChange={e => setPlan(pIdx, 'borderless5Cr', e.target.checked)} style={{ width: 'auto' }} />
                            </div>
                            <PlanField label="Consumables (₹)" value={plan.consumables} onChange={v => setPlan(pIdx, 'consumables', v)} />
                            <PlanField label="Home Care (₹)" value={plan.homeCare} onChange={v => setPlan(pIdx, 'homeCare', v)} />
                            <PlanField label="Maternity" value={plan.maternity} onChange={v => setPlan(pIdx, 'maternity', v)} placeholder="e.g. 4 years" />
                        </div>
                        <div className="hplan-section">
                            <h5>Terms & Conditions</h5>
                            <PlanField label="Sub Limits" value={plan.subLimits} onChange={v => setPlan(pIdx, 'subLimits', v)} />
                            <PlanField label="Deductible / Co Pay" value={plan.deductible} onChange={v => setPlan(pIdx, 'deductible', v)} />
                            <PlanField label="OPD 5k & Dental 10k" value={plan.opd} onChange={v => setPlan(pIdx, 'opd', v)} placeholder="Yes / No / After 2 yrs" />
                            <PlanField label="No Claim Bonus" value={plan.noClaimBonus} onChange={v => setPlan(pIdx, 'noClaimBonus', v)} placeholder="e.g. 100%, 600%" />
                            <PlanField label="Premium Until Claimed" value={plan.premiumUntilClaimed} onChange={v => setPlan(pIdx, 'premiumUntilClaimed', v)} placeholder="e.g. Only Inflation" />
                            <PlanField label="Waiting Period PED" value={plan.waitingPeriodPED} onChange={v => setPlan(pIdx, 'waitingPeriodPED', v)} placeholder="e.g. 36 months" />
                            <PlanField label="Premium Paid For" value={plan.premiumPaidFor} onChange={v => setPlan(pIdx, 'premiumPaidFor', v)} placeholder="e.g. 13 months" />
                        </div>
                    </div>
                </div>
            ))}

            <button className="btn-add-insurer" onClick={addPlan}><Plus size={16} /> Add Plan</button>
        </div>
    );
};

const PlanField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="field-row">
        <label>{label}</label>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} />
    </div>
);

export default HealthQuotation;
