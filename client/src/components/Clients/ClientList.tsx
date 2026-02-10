import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Phone, MapPin, Building } from 'lucide-react';
import AddClientModal from './AddClientModal';
import './Clients.css';

const ClientList: React.FC = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get current user to check permissions
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userRole = user?.role || 'staff';
    const isAdmin = userRole === 'admin' || userRole === 'proprietor';

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients');
            const data = await res.json();
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        }
    };

    const handleDeleteClient = async (id: number) => {
        if (!confirm('Are you sure you want to delete this client?')) return;

        try {
            const res = await fetch(`/api/clients/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                fetchClients();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Failed to delete client:', error);
        }
    };

    if (!isAdmin) {
        return <div className="clients-container"><p>Access Denied. Admins only.</p></div>;
    }

    return (
        <div className="clients-container">
            <div className="clients-header">
                <div>
                    <h1>Client Management</h1>
                    <p>Manage your client directory.</p>
                </div>
                <button className="add-client-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Add Client
                </button>
            </div>

            <div className="clients-grid">
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact Info</th>
                            <th>Company</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>
                                    <strong>{client.name}</strong>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Mail size={12} color="#64748b" /> {client.email}
                                        </span>
                                        {client.phone && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Phone size={12} color="#64748b" /> {client.phone}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {client.company && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Building size={14} color="#64748b" /> {client.company}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {client.address && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', maxWidth: '200px' }}>
                                            <MapPin size={14} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span style={{ fontSize: '0.85rem' }}>{client.address}</span>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <span className={`status-badge ${client.status}`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="client-actions">
                                    <button onClick={() => handleDeleteClient(client.id)} title="Delete Client">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No clients found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AddClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchClients}
            />
        </div>
    );
};

export default ClientList;
