import React, { useEffect, useState } from 'react';
import { Save, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import './AdminSettings.css';

interface CustomField {
    id: number;
    module: string;
    fieldNumber: number;
    label: string;
    isEnabled: boolean;
    fieldType: string;
}

interface Props { userRole: string; }

const AdminSettings: React.FC<Props> = ({ userRole: _userRole }) => {
    const [fields, setFields] = useState<CustomField[]>([]);
    const [saving, setSaving] = useState<number | null>(null);
    const [saved, setSaved] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetch('/api/admin-fields').then(r => r.json()).then(setFields).catch(() => {});
    }, []);

    const motorFields = fields.filter(f => f.module === 'motor');
    const healthFields = fields.filter(f => f.module === 'health');

    const updateField = (id: number, key: keyof CustomField, val: any) =>
        setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: val } : f));

    const saveField = async (field: CustomField) => {
        setSaving(field.id);
        try {
            await fetch(`/api/admin-fields/${field.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label: field.label, isEnabled: field.isEnabled, fieldType: field.fieldType }),
            });
            setSaved(prev => new Set([...prev, field.id]));
            setTimeout(() => setSaved(prev => { const n = new Set(prev); n.delete(field.id); return n; }), 2000);
        } finally {
            setSaving(null);
        }
    };

    const FieldSection = ({ title, items }: { title: string; items: CustomField[] }) => (
        <div className="settings-section">
            <h3>{title}</h3>
            <p className="section-desc">Enable or rename the 5 configurable custom fields for this module.</p>
            <div className="fields-list">
                {items.map(field => (
                    <div className={`field-config-row ${field.isEnabled ? 'enabled' : ''}`} key={field.id}>
                        <div className="field-config-left">
                            <button
                                className={`toggle-btn ${field.isEnabled ? 'on' : 'off'}`}
                                onClick={() => updateField(field.id, 'isEnabled', !field.isEnabled)}
                                title={field.isEnabled ? 'Disable' : 'Enable'}
                            >
                                {field.isEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            </button>
                            <span className="field-num">Field {field.fieldNumber}</span>
                        </div>
                        <div className="field-config-center">
                            <input
                                value={field.label}
                                onChange={e => updateField(field.id, 'label', e.target.value)}
                                className="field-label-input"
                                disabled={!field.isEnabled}
                                placeholder={`Custom Field ${field.fieldNumber}`}
                            />
                            <select
                                value={field.fieldType}
                                onChange={e => updateField(field.id, 'fieldType', e.target.value)}
                                disabled={!field.isEnabled}
                                className="field-type-select"
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                        <button
                            className={`save-btn ${saved.has(field.id) ? 'saved' : ''}`}
                            onClick={() => saveField(field)}
                            disabled={saving === field.id}
                        >
                            {saved.has(field.id) ? '✓ Saved' : <><Save size={14} /> Save</>}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="admin-settings-page">
            <div className="page-header">
                <div>
                    <h2><Settings size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />Admin Settings</h2>
                    <p className="subtitle">Configure custom fields and module settings</p>
                </div>
            </div>

            <FieldSection title="Motor Insurance - Custom Fields" items={motorFields} />
            <FieldSection title="Health Insurance - Custom Fields" items={healthFields} />
        </div>
    );
};

export default AdminSettings;
