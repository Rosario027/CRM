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
                        <h3>Total Tasks</h3>
                        <p className="stat-value">24</p>
                        <span className="stat-trend positive">+12% this week</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Pending Tasks</h3>
                        <p className="stat-value">8</p>
                        <span className="stat-trend neutral">Same as last week</span>
                    </div>
                </div>

                {isAdmin && (
                    <>
                        <div className="stat-card">
                            <div className="stat-icon purple">
                                <Users size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>Total Staff</h3>
                                <p className="stat-value">12</p>
                                <span className="stat-trend positive">+2 new hires</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon orange">
                                <DollarSign size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>Expenses</h3>
                                <p className="stat-value">$1,240</p>
                                <span className="stat-trend negative">+5% increase</span>
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
