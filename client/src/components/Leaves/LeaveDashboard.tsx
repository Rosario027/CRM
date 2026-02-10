import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import RequestLeaveModal from './RequestLeaveModal';
import './Leaves.css';

const LeaveDashboard: React.FC = () => {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get current user
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userRole = user?.role || 'staff';

    useEffect(() => {
        if (user) {
            fetchLeaves();
        }
    }, []);

    const fetchLeaves = async () => {
        try {
            let url = '/api/leaves';
            if (userRole === 'staff') {
                url += `?role=staff&userId=${user.id}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setLeaves(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch leaves:', error);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/leaves/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                fetchLeaves();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="leaves-container">
            <div className="leaves-header">
                <div>
                    <h1>Leave Management</h1>
                    <p>Track and manage leave requests.</p>
                </div>
                {userRole === 'staff' && (
                    <button className="request-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        Request Leave
                    </button>
                )}
            </div>

            <div className="leaves-grid">
                <div className="leaves-list">
                    <table className="leaves-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Type</th>
                                <th>Dates</th>
                                <th>Reason</th>
                                <th>Status</th>
                                {(userRole === 'admin' || userRole === 'proprietor') && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave.id}>
                                    <td>{leave.userName}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{leave.type}</td>
                                    <td>
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td>{leave.reason}</td>
                                    <td>
                                        <span className={`status-badge ${leave.status}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    {(userRole === 'admin' || userRole === 'proprietor') && (
                                        <td>
                                            {leave.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="action-btn approve"
                                                        onClick={() => handleStatusUpdate(leave.id, 'approved')}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {leaves.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No leave requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="leave-stats">
                    <div className="stats-card">
                        <h3>Pending Requests</h3>
                        <div className="stats-number">
                            {leaves.filter(l => l.status === 'pending').length}
                        </div>
                    </div>
                </div>
            </div>

            {user && (
                <RequestLeaveModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchLeaves}
                    userId={user.id}
                />
            )}
        </div>
    );
};

export default LeaveDashboard;
