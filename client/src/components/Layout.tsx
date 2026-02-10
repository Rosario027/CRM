import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

interface LayoutProps {
    userRole: string;
    onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ userRole, onLogout }) => {
    return (
        <div className="app-layout">
            <Sidebar userRole={userRole} onLogout={onLogout} />
            <main className="main-content">
                <header className="top-header">
                    {/* Dynamic Title dependent on route could go here */}
                    <div className="page-title">
                        <h2>Overview</h2>
                    </div>

                    <div className="user-profile">
                        <div className="avatar-circle">
                            {userRole.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <span className="user-name">Welcome, User</span>
                            <span className="user-role">{userRole}</span>
                        </div>
                    </div>
                </header>

                <div className="content-scrollable">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
