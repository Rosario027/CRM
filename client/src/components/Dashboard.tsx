import React from 'react';
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
    const [stats, setStats] = React.useState({
        tasksLast7Days: 0,
        pendingTasks: { high: 0, medium: 0, low: 0, total: 0 }
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get user info from localStorage if not passed as prop (though userRole is passed)
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

                <div className="stat-card">
                    <div className="stat-icon green">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Pending Tasks</h3>
                        <div className="pending-breakdown">
                            <span className="breakdown-item high" title="High Priority">
                                <span className="dot"></span> {stats.pendingTasks.high}
                            </span>
                            <span className="breakdown-item medium" title="Medium Priority">
                                <span className="dot"></span> {stats.pendingTasks.medium}
                            </span>
                            <span className="breakdown-item low" title="Low Priority">
                                <span className="dot"></span> {stats.pendingTasks.low}
                            </span>
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <>
                        <div className="stat-card">
                            <div className="stat-icon purple">
                                <Users size={24} />
                            </div>
                            <div className="stat-info">
                                <h3 className="admin-stat-label">Total Staff</h3>
                                <p className="stat-value">12</p>
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

            <div className="dashboard-sections">
                {/* We will add charts or tables here later */}
                <div className="section-card">
                    <h3>Recent Activities</h3>
                    <p className="empty-state">No recent activities to show.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
