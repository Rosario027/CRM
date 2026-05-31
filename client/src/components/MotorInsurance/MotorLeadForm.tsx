import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { MotorLead, CustomFieldConfig } from './MotorLeadList';
import { initialBrands } from '../../utils/motorBrands';
import { initialModels } from '../../utils/motorModels';

interface Props {
    lead: MotorLead | null;
    customFields: CustomFieldConfig[];
    onSave: (data: MotorLead) => void;
    onClose: () => void;
}

const SOURCES = ['CA', 'AAA', 'Direct', 'Referral', 'Online', 'Walk-in', 'Other'];
const STATUSES = ['open', 'closed', 'renewed', 'lost'];
const INSURERS = [
    'TATA AIG', 'ICICI Lombard', 'Reliance General', 'Royal Sundaram',
    'Bajaj Allianz', 'HDFC ERGO', 'New India Assurance', 'Oriental Insurance',
    'United India Insurance', 'National Insurance', 'SBI General', 'Kotak General',
    'IFFCO Tokio', 'Digit Insurance', 'Acko General', 'IndusInd General',
    'Zurich Kotak', 'Navi General', 'Open'
];

const MotorLeadForm: React.FC<Props> = ({ lead, customFields, onSave, onClose }) => {
    const [form, setForm] = useState<MotorLead>(lead || {});
    const [customModel, setCustomModel] = useState('');
    const [useCustomModel, setUseCustomModel] = useState(false);

    const set = (key: keyof MotorLead, val: string) => setForm(p => ({ ...p, [key]: val }));

    const availableModels = form.vehicleMake ? (initialModels[form.vehicleMake] || []) : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalForm = { ...form };
        if (useCustomModel) finalForm.vehicleModel = customModel;
        onSave(finalForm);
    };

    const enabledCustomFields = customFields.filter(f => f.isEnabled);

    return (
        <div className="modal-overlay">
            <div className="modal-box lead-form-modal">
                <div className="modal-header">
                    <h3>{lead?.id ? 'Edit Motor Lead' : 'Add Motor Lead'}</h3>
                    <button className="close-btn" onClick={onClose}><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="lead-form">
                    <div className="form-grid">

                        <div className="form-section">
                            <h4>Customer Info</h4>
                            <div className="field-row">
                                <label>Source</label>
                                <select value={form.source || ''} onChange={e => set('source', e.target.value)}>
                                    <option value="">Select</option>
                                    {SOURCES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="field-row">
                                <label>Customer Name</label>
                                <input value={form.customerName || ''} onChange={e => set('customerName', e.target.value)} placeholder="Full name" />
                            </div>
                            <div className="field-row">
                                <label>Referral</label>
                                <input value={form.referral || ''} onChange={e => set('referral', e.target.value)} placeholder="Referred by" />
                            </div>
                            <div className="field-row">
                                <label>Contact</label>
                                <input value={form.contact || ''} onChange={e => set('contact', e.target.value)} placeholder="Phone number" />
                            </div>
                            <div className="field-row">
                                <label>Email</label>
                                <input type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="Email address" />
                            </div>
                            <div className="field-row">
                                <label>PAN</label>
                                <input value={form.pan || ''} onChange={e => set('pan', e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
                            </div>
                            <div className="field-row">
                                <label>Aadhaar</label>
                                <input value={form.aadhaar || ''} onChange={e => set('aadhaar', e.target.value)} placeholder="12-digit Aadhaar" maxLength={12} />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>Vehicle Details</h4>
                            <div className="field-row">
                                <label>Make</label>
                                <select value={form.vehicleMake || ''} onChange={e => { set('vehicleMake', e.target.value); set('vehicleModel', ''); setUseCustomModel(false); }}>
                                    <option value="">Select Brand</option>
                                    {initialBrands.map(b => <option key={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="field-row">
                                <label>Model</label>
                                {!useCustomModel ? (
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <select value={form.vehicleModel || ''} onChange={e => set('vehicleModel', e.target.value)} style={{ flex: 1 }}>
                                            <option value="">Select Model</option>
                                            {availableModels.map(m => <option key={m}>{m}</option>)}
                                        </select>
                                        <button type="button" className="btn-sm" onClick={() => setUseCustomModel(true)} title="Enter manually">✏️</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <input value={customModel} onChange={e => setCustomModel(e.target.value)} placeholder="Enter model name" style={{ flex: 1 }} />
                                        <button type="button" className="btn-sm" onClick={() => setUseCustomModel(false)}>↩</button>
                                    </div>
                                )}
                            </div>
                            <div className="field-row">
                                <label>Reg No</label>
                                <input value={form.regNo || ''} onChange={e => set('regNo', e.target.value.toUpperCase())} placeholder="TN37EX8218" />
                            </div>
                            <div className="field-row">
                                <label>IDV (₹)</label>
                                <input type="number" value={form.idv || ''} onChange={e => set('idv', e.target.value)} placeholder="Insurance Declared Value" />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>Due Dates</h4>
                            <div className="field-row">
                                <label>Package Due Date</label>
                                <input type="date" value={form.packageDueDate || ''} onChange={e => set('packageDueDate', e.target.value)} />
                            </div>
                            <div className="field-row">
                                <label>SAOD Due Date</label>
                                <input type="date" value={form.saodDueDate || ''} onChange={e => set('saodDueDate', e.target.value)} />
                                <span className="field-note">Standalone Own Damage</span>
                            </div>
                            <div className="field-row">
                                <label>TP Due Date</label>
                                <input type="date" value={form.tpDueDate || ''} onChange={e => set('tpDueDate', e.target.value)} />
                                <span className="field-note">Third Party</span>
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>Insurer History</h4>
                            <div className="field-row">
                                <label>2024 Insurer</label>
                                <select value={form.insurer2024 || ''} onChange={e => set('insurer2024', e.target.value)}>
                                    <option value="">None</option>
                                    {INSURERS.map(i => <option key={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="field-row">
                                <label>2025 Insurer</label>
                                <select value={form.insurer2025 || ''} onChange={e => set('insurer2025', e.target.value)}>
                                    <option value="">None</option>
                                    {INSURERS.map(i => <option key={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="field-row">
                                <label>2026 Insurer</label>
                                <select value={form.insurer2026 || ''} onChange={e => set('insurer2026', e.target.value)}>
                                    <option value="">None</option>
                                    {INSURERS.map(i => <option key={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="field-row">
                                <label>Status</label>
                                <select value={form.status || 'open'} onChange={e => set('status', e.target.value)}>
                                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {enabledCustomFields.length > 0 && (
                            <div className="form-section">
                                <h4>Additional Fields</h4>
                                {enabledCustomFields.map(f => (
                                    <div className="field-row" key={f.id}>
                                        <label>{f.label}</label>
                                        <input
                                            type={f.fieldType === 'date' ? 'date' : f.fieldType === 'number' ? 'number' : 'text'}
                                            value={(form as any)[`customField${f.fieldNumber}`] || ''}
                                            onChange={e => set(`customField${f.fieldNumber}` as keyof MotorLead, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Lead</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MotorLeadForm;
