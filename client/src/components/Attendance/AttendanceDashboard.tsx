import React, { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import './Attendance.css';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AttendanceDashboardProps {
    user?: User; // Pass the logged-in user
}

const AttendanceDashboard: React.FC<AttendanceDashboardProps> = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [status, setStatus] = useState<'checked-out' | 'checked-in'>('checked-out');
    const [todayRecord, setTodayRecord] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Retrieve user from localStorage (since we aren't using a global context yet)
    // In a real app, use Context or Redux
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchStatus();
            fetchHistory();
        }
    }, [userId]);

    const fetchStatus = async () => {
        try {
            const res = await fetch(`/api/attendance/today/${userId}`);
            const data = await res.json();
            if (data.success && data.data) {
                setTodayRecord(data.data);
                if (!data.data.checkOutTime) {
                    setStatus('checked-in');
                } else {
                    setStatus('checked-out');
                }
            } else {
                setStatus('checked-out');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/attendance/history/${userId}`);
            const data = await res.json();
            if (data.success) {
                setHistory(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckIn = async () => {
        try {
            const res = await fetch('/api/attendance/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (data.success) {
                fetchStatus();
                fetchHistory(); // Update history immediately
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Failed to check in');
        }
    };

    const handleCheckOut = async () => {
        try {
            const res = await fetch('/api/attendance/check-out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (data.success) {
                fetchStatus();
                fetchHistory();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Failed to check out');
        }
    };

    if (!userId) {
        return <div className="attendance-container">Please log in to view attendance.</div>;
    }

    return (
        <div className="attendance-container">
            <div className="attendance-header">
                <h1>Attendance</h1>
                <p>Track your work hours and daily status.</p>
            </div>

            <div className="attendance-grid">
                <div className="attendance-main">
                    <div className="status-card">
                        <div className="time-display">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="date-display">
                            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>

                        <div className="action-buttons">
                            <button
                                className="check-btn in"
                                onClick={handleCheckIn}
                                disabled={status === 'checked-in' || (todayRecord && todayRecord.checkOutTime)}
                            >
                                <LogIn size={20} />
                                Check In
                            </button>
                            <button
                                className="check-btn out"
                                onClick={handleCheckOut}
                                disabled={status === 'checked-out'}
                            >
                                <LogOut size={20} />
                                Check Out
                            </button>
                        </div>

                        {todayRecord && todayRecord.checkOutTime && (
                            <div style={{ color: '#059669', marginTop: '1rem', fontWeight: 500 }}>
                                You have completed your work day! ({todayRecord.workHours} hrs)
                            </div>
                        )}
                    </div>

                    <div className="history-card">
                        <h3>Recent Activity</h3>
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Hours</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record: any) => (
                                    <tr key={record.id}>
                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                        <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                        <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                        <td>{record.workHours || '-'}</td>
                                        <td>
                                            <span style={{
                                                color: record.status === 'present' ? '#16a34a' : '#ea580c',
                                                fontWeight: 500,
                                                textTransform: 'capitalize'
                                            }}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="stats-sidebar">
                    <div className="summary-card">
                        <h3>Monthly Summary</h3>
                        <div className="summary-stat">
                            <span className="summary-label">Days Present</span>
                            <span className="summary-value">{history.filter(h => h.status === 'present').length}</span>
                        </div>
                        <div className="summary-stat">
                            <span className="summary-label">Average Hours</span>
                            <span className="summary-value">8.2</span>
                        </div>
                        <div className="summary-stat">
                            <span className="summary-label">On Time</span>
                            <span className="summary-value">100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDashboard;
