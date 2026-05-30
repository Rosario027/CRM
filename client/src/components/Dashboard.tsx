import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Users,
    CheckCircle2,
    Clock
} from 'lucide-react';
import './Dashboard.css';

interface DashboardProps {
    userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
    const isAdmin = userRole === 'admin' || userRole === 'proprietor';
    const navigate = useNavigate();
    const [stats, setStats] = React.useState({
        tasksLast7Days: 0,
        totalStaff: 0,
        pendingTasks: { high: 0, medium: 0, low: 0, total: 0 }
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const userId = user?.id;

                const res = await fetch(`/api/dashboard/stats?role=${userRole}&userId=${userId}`);
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchStats();
    }, [userRole]);

    const handlePriorityClick = (priority: string) => {
        navigate(`/tasks?priority=${priority}`);
    };

    return (
        <div className="dashboard-container">
            <div className="welcome-banner">
                <h1>Dashboard</h1>
                <p>Overview of your office management metrics.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Tasks Assigned (7 Days)</h3>
                        <p className="stat-value">{stats.tasksLast7Days}</p>
                    </div>
                </div>

                <div className="stat-card pending-card">
                    <div className="stat-icon green">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Pending Tasks</h3>
                        <p className="stat-value">{stats.pendingTasks.total}</p>
                    </div>
                </div>

                {isAdmin && (
                    <>
                        <div className="stat-card" onClick={() => navigate('/staff')} style={{ cursor: 'pointer' }}>
                            <div className="stat-icon purple">
                                <Users size={24} />
                            </div>
                            <div className="stat-info">
                                <h3 className="admin-stat-label">Total Staff</h3>
                                <p className="stat-value">{stats.totalStaff}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon orange">
                                <DollarSign size={24} />
                            </div>
                            <div className="stat-info">
                                <h3 className="admin-stat-label">Expenses</h3>
                                <p className="stat-value">₹1,240</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Large Pending Tasks Breakdown - Clickable */}
            <div className="pending-tasks-panel">
                <h3 className="panel-title">Pending Tasks by Priority</h3>
                <div className="priority-rows">
                    <div className="priority-row high-row" onClick={() => handlePriorityClick('high')}>
                        <div className="priority-indicator high-indicator"></div>
                        <span className="priority-label">High Priority</span>
                        <span className="priority-count">{stats.pendingTasks.high}</span>
                        <span className="priority-arrow">→</span>
                    </div>
                    <div className="priority-row medium-row" onClick={() => handlePriorityClick('medium')}>
                        <div className="priority-indicator medium-indicator"></div>
                        <span className="priority-label">Medium Priority</span>
                        <span className="priority-count">{stats.pendingTasks.medium}</span>
                        <span className="priority-arrow">→</span>
                    </div>
                    <div className="priority-row low-row" onClick={() => handlePriorityClick('low')}>
                        <div className="priority-indicator low-indicator"></div>
                        <span className="priority-label">Low Priority</span>
                        <span className="priority-count">{stats.pendingTasks.low}</span>
                        <span className="priority-arrow">→</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="section-card">
                    <h3>Recent Activities</h3>
                    <p className="empty-state">No recent activities to show.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
