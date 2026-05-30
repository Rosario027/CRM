import React, { useState } from 'react';
import { Printer, Plus, Trash2, Save } from 'lucide-react';
import MotorQuotationPrint from './MotorQuotationPrint';
import { initialBrands } from '../../utils/motorBrands';
import { initialModels } from '../../utils/motorModels';

export interface MotorPack {
    name: string;
    idv: string;
    od: string;
    rsa: string;
    ema: string;
    zeroDep: string;
    consumables: string;
    engineProtect: string;
    tyreProtect: string;
    keyReplacement: string;
    lossOfBelongings: string;
    returnToInvoice: string;
    ncbProtect: string;
    windshieldProtect: string;
    imt23: string;
    additionalTowing: string;
    paAndTp: string;
    gst: string;
    totalPremium: string;
    declined: boolean;
    // "included" flags
    consumablesIncluded: boolean;
    engineProtectIncluded: boolean;
    keyReplacementIncluded: boolean;
    lossOfBelongingsIncluded: boolean;
    odIncluded: boolean;
    zeroDeptIncluded: boolean;
    imt23Included: boolean;
}

export interface MotorInsurer {
    name: string;
    packs: MotorPack[];
}

export interface MotorQuotationData {
    customerName: string;
    regNo: string;
    dueDate: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleType: string; // PC, CV, etc.
    insurers: MotorInsurer[];
}

const INSURERS_LIST = [
    'RELIANCE GENERAL INSURANCE', 'ROYAL SUNDARAM INSURANCE', 'ICICI LOMBARD',
    'TATA AIG', 'IndusInd General Insurance', 'Bajaj Allianz', 'HDFC ERGO',
    'New India Assurance', 'Oriental Insurance', 'United India Insurance',
    'National Insurance', 'SBI General', 'Kotak General', 'IFFCO Tokio',
    'Digit Insurance', 'Acko General', 'Zurich Kotak'
];

const emptyPack = (): MotorPack => ({
    name: 'Pack 1', idv: '', od: '', rsa: '', ema: '', zeroDep: '', consumables: '',
    engineProtect: '', tyreProtect: '', keyReplacement: '', lossOfBelongings: '',
    returnToInvoice: '', ncbProtect: '', windshieldProtect: '', imt23: '',
    additionalTowing: '', paAndTp: '', gst: '', totalPremium: '', declined: false,
    consumablesIncluded: false, engineProtectIncluded: false, keyReplacementIncluded: false,
    lossOfBelongingsIncluded: false, odIncluded: false, zeroDeptIncluded: false, imt23Included: false,
});

const emptyInsurer = (name = ''): MotorInsurer => ({ name, packs: [emptyPack()] });

const emptyQuotation = (): MotorQuotationData => ({
    customerName: '', regNo: '', dueDate: '', vehicleMake: '', vehicleModel: '',
    vehicleType: 'PC', insurers: [emptyInsurer()],
});

interface Props { userRole: string; }

const MotorQuotation: React.FC<Props> = ({ userRole }) => {
    const [data, setData] = useState<MotorQuotationData>(emptyQuotation());
    const [showPrint, setShowPrint] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [customModel, setCustomModel] = useState('');
    const [useCustomModel, setUseCustomModel] = useState(false);

    const setHeader = (key: keyof MotorQuotationData, val: string) =>
        setData(p => ({ ...p, [key]: val }));

    const setInsurer = (idx: number, key: keyof MotorInsurer, val: any) =>
        setData(p => {
            const ins = [...p.insurers];
            ins[idx] = { ...ins[idx], [key]: val };
            return { ...p, insurers: ins };
        });

    const setPack = (iIdx: number, pIdx: number, key: keyof MotorPack, val: any) =>
        setData(p => {
            const ins = [...p.insurers];
            const packs = [...ins[iIdx].packs];
            packs[pIdx] = { ...packs[pIdx], [key]: val };
            ins[iIdx] = { ...ins[iIdx], packs };
            return { ...p, insurers: ins };
        });

    const addInsurer = () => setData(p => ({ ...p, insurers: [...p.insurers, emptyInsurer()] }));
    const removeInsurer = (idx: number) => setData(p => ({ ...p, insurers: p.insurers.filter((_, i) => i !== idx) }));
    const addPack = (iIdx: number) => setData(p => {
        const ins = [...p.insurers];
        const n = ins[iIdx].packs.length + 1;
        ins[iIdx] = { ...ins[iIdx], packs: [...ins[iIdx].packs, { ...emptyPack(), name: `Pack ${n}` }] };
        return { ...p, insurers: ins };
    });
    const removePack = (iIdx: number, pIdx: number) => setData(p => {
        const ins = [...p.insurers];
        ins[iIdx] = { ...ins[iIdx], packs: ins[iIdx].packs.filter((_, i) => i !== pIdx) };
        return { ...p, insurers: ins };
    });

    const handleSave = async () => {
        const finalData = { ...data, vehicleModel: useCustomModel ? customModel : data.vehicleModel };
        try {
            const res = await fetch('/api/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'motor',
                    customerName: finalData.customerName,
                    vehicleOrDetails: `${finalData.vehicleMake} ${finalData.vehicleModel}`,
                    dueDate: finalData.dueDate,
                    quotationData: JSON.stringify(finalData),
                }),
            });
            if (res.ok) { setSaveMsg('Saved!'); setTimeout(() => setSaveMsg(''), 2000); }
        } catch { setSaveMsg('Saved locally'); setTimeout(() => setSaveMsg(''), 2000); }
    };

    const handlePrint = () => {
        if (!useCustomModel) {
            setShowPrint(true);
        } else {
            setData(p => ({ ...p, vehicleModel: customModel }));
            setShowPrint(true);
        }
    };

    const availableModels = data.vehicleMake ? (initialModels[data.vehicleMake] || []) : [];

    if (showPrint) {
        const printData = { ...data, vehicleModel: useCustomModel ? customModel : data.vehicleModel };
        return (
            <div>
                <div className="print-controls no-print">
                    <button className="btn-secondary" onClick={() => setShowPrint(false)}>← Back to Edit</button>
                    <button className="btn-primary" onClick={() => window.print()}><Printer size={16} /> Print / Save PDF</button>
                </div>
                <MotorQuotationPrint data={printData} />
            </div>
        );
    }

    return (
        <div className="quotation-editor">
            <div className="page-header">
                <div>
                    <h2>Motor Insurance Quotation</h2>
                    <p className="subtitle">Fill in details and generate a printable quotation</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-secondary" onClick={handleSave}><Save size={16} /> {saveMsg || 'Save'}</button>
                    <button className="btn-primary" onClick={handlePrint}><Printer size={16} /> Preview & Print</button>
                </div>
            </div>

            <div className="qform-card">
                <h4>Customer & Vehicle Details</h4>
                <div className="qform-grid">
                    <div className="field-row">
                        <label>Customer Name</label>
                        <input value={data.customerName} onChange={e => setHeader('customerName', e.target.value)} placeholder="Customer name" />
                    </div>
                    <div className="field-row">
                        <label>Reg No</label>
                        <input value={data.regNo} onChange={e => setHeader('regNo', e.target.value.toUpperCase())} placeholder="TN37EX8218" />
                    </div>
                    <div className="field-row">
                        <label>Due Date</label>
                        <input type="date" value={data.dueDate} onChange={e => setHeader('dueDate', e.target.value)} />
                    </div>
                    <div className="field-row">
                        <label>Vehicle Type</label>
                        <select value={data.vehicleType} onChange={e => setHeader('vehicleType', e.target.value)}>
                            <option value="PC">PC (Private Car)</option>
                            <option value="CV">CV (Commercial Vehicle)</option>
                            <option value="TW">TW (Two Wheeler)</option>
                        </select>
                    </div>
                    <div className="field-row">
                        <label>Make</label>
                        <select value={data.vehicleMake} onChange={e => { setHeader('vehicleMake', e.target.value); setHeader('vehicleModel', ''); }}>
                            <option value="">Select Brand</option>
                            {initialBrands.map(b => <option key={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="field-row">
                        <label>Model</label>
                        {!useCustomModel ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                                <select value={data.vehicleModel} onChange={e => setHeader('vehicleModel', e.target.value)} style={{ flex: 1 }}>
                                    <option value="">Select Model</option>
                                    {availableModels.map(m => <option key={m}>{m}</option>)}
                                </select>
                                <button type="button" className="btn-sm" onClick={() => setUseCustomModel(true)}>✏️ Manual</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: 6 }}>
                                <input value={customModel} onChange={e => setCustomModel(e.target.value)} placeholder="Enter model" style={{ flex: 1 }} />
                                <button type="button" className="btn-sm" onClick={() => setUseCustomModel(false)}>↩</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {data.insurers.map((insurer, iIdx) => (
                <div className="qform-card insurer-card" key={iIdx}>
                    <div className="insurer-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <select value={insurer.name} onChange={e => setInsurer(iIdx, 'name', e.target.value)} className="insurer-select">
                                <option value="">Select Insurer</option>
                                {INSURERS_LIST.map(i => <option key={i}>{i}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn-sm" onClick={() => addPack(iIdx)}><Plus size={12} /> Add Pack</button>
                            {data.insurers.length > 1 && (
                                <button className="btn-sm danger" onClick={() => removeInsurer(iIdx)}><Trash2 size={12} /></button>
                            )}
                        </div>
                    </div>

                    <div className="packs-row">
                        {insurer.packs.map((pack, pIdx) => (
                            <div className="pack-card" key={pIdx}>
                                <div className="pack-header">
                                    <input value={pack.name} onChange={e => setPack(iIdx, pIdx, 'name', e.target.value)} className="pack-name-input" />
                                    <label className="declined-toggle">
                                        <input type="checkbox" checked={pack.declined} onChange={e => setPack(iIdx, pIdx, 'declined', e.target.checked)} />
                                        Declined
                                    </label>
                                    {insurer.packs.length > 1 && (
                                        <button className="btn-sm danger" onClick={() => removePack(iIdx, pIdx)}><Trash2 size={10} /></button>
                                    )}
                                </div>
                                {!pack.declined && (
                                    <div className="pack-fields">
                                        <PackField label="IDV (₹)" value={pack.idv} onChange={v => setPack(iIdx, pIdx, 'idv', v)} />
                                        <PackFieldWithIncl label="OD" value={pack.od} incl={pack.odIncluded} onIncl={v => setPack(iIdx, pIdx, 'odIncluded', v)} onChange={v => setPack(iIdx, pIdx, 'od', v)} />
                                        <PackField label="RSA" value={pack.rsa} onChange={v => setPack(iIdx, pIdx, 'rsa', v)} />
                                        <PackField label="EMA" value={pack.ema} onChange={v => setPack(iIdx, pIdx, 'ema', v)} />
                                        <PackFieldWithIncl label="Zero Dep" value={pack.zeroDep} incl={pack.zeroDeptIncluded} onIncl={v => setPack(iIdx, pIdx, 'zeroDeptIncluded', v)} onChange={v => setPack(iIdx, pIdx, 'zeroDep', v)} />
                                        <PackFieldWithIncl label="Consumables" value={pack.consumables} incl={pack.consumablesIncluded} onIncl={v => setPack(iIdx, pIdx, 'consumablesIncluded', v)} onChange={v => setPack(iIdx, pIdx, 'consumables', v)} />
                                        <PackFieldWithIncl label="Engine Protect" value={pack.engineProtect} incl={pack.engineProtectIncluded} onIncl={v => setPack(iIdx, pIdx, 'engineProtectIncluded', v)} onChange={v => setPack(iIdx, pIdx, 'engineProtect', v)} />
                                        <PackField label="Tyre Protect" value={pack.tyreProtect} onChange={v => setPack(iIdx, pIdx, 'tyreProtect', v)} />
                                        <PackFieldWithIncl label="Key Replacement" value={pack.keyReplacement} incl={pack.keyReplacementIncluded} onIncl={v => setPack(iIdx, pIdx, 'keyReplacementIncluded', v)} onChange={v => setPack(iIdx, pIdx, 'keyReplacement', v)} />
                                        <PackFieldWithIncl label="Loss of Belongings" value={pack.lossOfBelongings} incl={pack.lossOfBelongingsIncluded} onIncl={v => setPack(iIdx, pIdx, 'lossOfBelongingsIncluded', v)} onChange={v => setPack(iIdx, pIdx, 'lossOfBelongings', v)} />
                                        <PackField label="Return to Invoice" value={pack.returnToInvoice} onChange={v => setPack(iIdx, pIdx, 'returnToInvoice', v)} />
                                        <PackField label="NCB Protect" value={pack.ncbProtect} onChange={v => setPack(iIdx, pIdx, 'ncbProtect', v)} />
                                        <PackField label="Windshield Protect" value={pack.windshieldProtect} onChange={v => setPack(iIdx, pIdx, 'windshieldProtect', v)} />
                                        <PackFieldWithIncl label="IMT 23" value={pack.imt23} incl={pack.imt23Included} onIncl={v => setPack(iIdx, pIdx, 'imt23Included', v)} onChange={v => setPack(iIdx, pIdx, 'imt23', v)} />
                                        <PackField label="Additional Towing" value={pack.additionalTowing} onChange={v => setPack(iIdx, pIdx, 'additionalTowing', v)} />
                                        <PackField label="PA + TP/Legal" value={pack.paAndTp} onChange={v => setPack(iIdx, pIdx, 'paAndTp', v)} />
                                        <PackField label="GST" value={pack.gst} onChange={v => setPack(iIdx, pIdx, 'gst', v)} />
                                        <PackField label="Total Premium" value={pack.totalPremium} onChange={v => setPack(iIdx, pIdx, 'totalPremium', v)} highlight />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button className="btn-add-insurer" onClick={addInsurer}><Plus size={16} /> Add Insurer</button>
        </div>
    );
};

const PackField: React.FC<{ label: string; value: string; onChange: (v: string) => void; highlight?: boolean }> = ({ label, value, onChange, highlight }) => (
    <div className={`pack-field ${highlight ? 'highlight' : ''}`}>
        <span>{label}</span>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="0" />
    </div>
);

const PackFieldWithIncl: React.FC<{ label: string; value: string; incl: boolean; onChange: (v: string) => void; onIncl: (v: boolean) => void }> = ({ label, value, incl, onChange, onIncl }) => (
    <div className="pack-field">
        <span>{label}</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {!incl && <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="0" style={{ width: 70 }} />}
            {incl && <span className="incl-badge">Included</span>}
            <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
                <input type="checkbox" checked={incl} onChange={e => onIncl(e.target.checked)} style={{ width: 'auto' }} />
                Incl
            </label>
        </div>
    </div>
);

export default MotorQuotation;
