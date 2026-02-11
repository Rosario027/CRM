import React from 'react';
import { NavLink } from 'react-router-dom';
// Or Lucide (already installed)
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    ClipboardList,
    Receipt,
    Settings,
    LogOut,
    Building2,
    Briefcase,
    ShieldCheck
} from 'lucide-react';

import './Sidebar.css';

interface SidebarProps {
    userRole: string;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, onLogout }) => {
    // Explicitly check for admin roles. ensure case-insensitivity just in case
    const isAdmin = ['admin', 'proprietor'].includes(userRole?.toLowerCase() || '');

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Building2 className="brand-icon" size={28} />
                <h1 className="brand-name">NEWERA</h1>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>

                    {isAdmin && (
                        <li>
                            <NavLink to="/staff" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <Users size={20} />
                                <span>Staff & Employees</span>
                            </NavLink>
                        </li>
                    )}

                    {isAdmin && (
                        <li>
                            <NavLink to="/clients" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <Briefcase size={20} />
                                <span>Clients</span>
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <CalendarCheck size={20} />
                            <span>Attendance</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/tasks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <ClipboardList size={20} />
                            <span>Tasks</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/expenses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Receipt size={20} />
                            <span>Expenses</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <ShieldCheck size={20} />
                            <span>Our Products</span>
                        </NavLink>
                    </li>

                    {isAdmin && (
                        <li>
                            <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <Settings size={20} />
                                <span>Settings</span>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button onClick={onLogout} className="logout-button">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
