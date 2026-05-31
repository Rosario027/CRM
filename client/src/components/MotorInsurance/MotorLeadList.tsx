import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Car, Search, Filter } from 'lucide-react';
import MotorLeadForm from './MotorLeadForm';
import './MotorInsurance.css';

export interface CustomFieldConfig {
    id: number;
    module: string;
    fieldNumber: number;
    label: string;
    isEnabled: boolean;
    fieldType: string;
}

export interface MotorLead {
    id?: number;
    source?: string;
    customerName?: string;
    referral?: string;
    packageDueDate?: string;
    saodDueDate?: string;
    tpDueDate?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    regNo?: string;
    idv?: string;
    contact?: string;
    email?: string;
    pan?: string;
    aadhaar?: string;
    insurer2024?: string;
    insurer2025?: string;
    insurer2026?: string;
    status?: string;
    customField1?: string;
    customField2?: string;
    customField3?: string;
    customField4?: string;
    customField5?: string;
    assignedToId?: number;
}

interface Props {
    userRole: string;
}

const statusColors: Record<string, string> = {
    open: '#f59e0b',
    closed: '#10b981',
    renewed: '#3b82f6',
    lost: '#ef4444',
};

const MotorLeadList: React.FC<Props> = ({ userRole }) => {
    const [leads, setLeads] = useState<MotorLead[]>([]);
    const [customFields, setCustomFields] = useState<CustomFieldConfig[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editLead, setEditLead] = useState<MotorLead | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    const isAdmin = ['admin', 'proprietor'].includes(userRole?.toLowerCase() || '');

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/motor-leads');
            if (res.ok) setLeads(await res.json());
        } catch { /* offline */ }
        setLoading(false);
    };

    const fetchCustomFields = async () => {
        try {
            const res = await fetch('/api/admin-fields');
            if (res.ok) {
                const all: CustomFieldConfig[] = await res.json();
                setCustomFields(all);
            }
        } catch { /* offline */ }
    };

    useEffect(() => {
        fetchLeads();
        fetchCustomFields();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this lead?')) return;
        await fetch(`/api/motor-leads/${id}`, { method: 'DELETE' });
        setLeads(prev => prev.filter(l => l.id !== id));
    };

    const handleSave = async (data: MotorLead) => {
        const method = data.id ? 'PUT' : 'POST';
        const url = data.id ? `/api/motor-leads/${data.id}` : '/api/motor-leads';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            await fetchLeads();
            setShowForm(false);
            setEditLead(null);
        }
    };

    const motorCustomFields = customFields.filter(f => f.module === 'motor');
    const enabledCustomFields = motorCustomFields.filter(f => f.isEnabled);

    const filtered = leads.filter(l => {
        const matchSearch = !search ||
            l.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            l.regNo?.toLowerCase().includes(search.toLowerCase()) ||
            l.vehicleMake?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || l.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const formatDate = (d?: string) => {
        if (!d) return '-';
        const dt = new Date(d);
        return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) return <div className="loading">Loading motor leads...</div>;

    return (
        <div className="motor-page">
            <div className="page-header">
                <div>
                    <h2><Car size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />Motor Insurance Leads</h2>
                    <p className="subtitle">{leads.length} total leads</p>
                </div>
                <button className="btn-primary" onClick={() => { setEditLead(null); setShowForm(true); }}>
                    <Plus size={16} /> Add Lead
                </button>
            </div>

            <div className="filter-bar">
                <div className="search-box">
                    <Search size={16} />
                    <input
                        placeholder="Search by name, reg no, vehicle..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-select">
                    <Filter size={16} />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="renewed">Renewed</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Customer</th>
                            <th>Vehicle</th>
                            <th>Reg No</th>
                            <th>IDV</th>
                            <th>Pkg Due Date</th>
                            <th>SAOD Due</th>
                            <th>TP Due</th>
                            <th>2024</th>
                            <th>2025</th>
                            <th>2026</th>
                            <th>Contact</th>
                            {enabledCustomFields.map(f => <th key={f.id}>{f.label}</th>)}
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={99} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No leads found</td></tr>
                        )}
                        {filtered.map(lead => (
                            <tr key={lead.id}>
                                <td><span className="badge">{lead.source || '-'}</span></td>
                                <td>
                                    <div className="lead-name">{lead.customerName || '-'}</div>
                                    {lead.referral && <div className="lead-sub">Ref: {lead.referral}</div>}
                                </td>
                                <td>{lead.vehicleMake} {lead.vehicleModel}</td>
                                <td className="mono">{lead.regNo || '-'}</td>
                                <td>{lead.idv ? `₹${Number(lead.idv).toLocaleString('en-IN')}` : '-'}</td>
                                <td className={isDueSoon(lead.packageDueDate) ? 'due-soon' : ''}>{formatDate(lead.packageDueDate)}</td>
                                <td className={isDueSoon(lead.saodDueDate) ? 'due-soon' : ''}>{formatDate(lead.saodDueDate)}</td>
                                <td className={isDueSoon(lead.tpDueDate) ? 'due-soon' : ''}>{formatDate(lead.tpDueDate)}</td>
                                <td><span className="insurer-tag">{lead.insurer2024 || '-'}</span></td>
                                <td><span className="insurer-tag">{lead.insurer2025 || '-'}</span></td>
                                <td><span className="insurer-tag active">{lead.insurer2026 || '-'}</span></td>
                                <td>{lead.contact || '-'}</td>
                                {enabledCustomFields.map(f => (
                                    <td key={f.id}>{(lead as any)[`customField${f.fieldNumber}`] || '-'}</td>
                                ))}
                                <td>
                                    <span className="status-pill" style={{ background: statusColors[lead.status || 'open'] }}>
                                        {lead.status || 'open'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="icon-btn edit" onClick={() => { setEditLead(lead); setShowForm(true); }} title="Edit">
                                            <Edit2 size={14} />
                                        </button>
                                        {isAdmin && (
                                            <button className="icon-btn delete" onClick={() => handleDelete(lead.id!)} title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <MotorLeadForm
                    lead={editLead}
                    customFields={motorCustomFields}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditLead(null); }}
                />
            )}
        </div>
    );
};

function isDueSoon(dateStr?: string): boolean {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const now = new Date();
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
}

export default MotorLeadList;
