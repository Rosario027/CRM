import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    ClipboardList,
    Receipt,
    Settings,
    LogOut,
    Briefcase,
    ShieldCheck,
    Car,
    FileText,
    Heart,
} from 'lucide-react';
import newEraIcon from '../assets/new-era-icon.png';
import './Sidebar.css';

interface SidebarProps {
    userRole: string;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, onLogout }) => {
    const isAdmin = ['admin', 'proprietor'].includes(userRole?.toLowerCase() || '');

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src={newEraIcon} alt="New Era Logo" className="brand-icon" />
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

                    <li className="nav-group-label">Motor Insurance</li>

                    <li>
                        <NavLink to="/motor-leads" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Car size={20} />
                            <span>Motor Leads</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/motor-quotation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FileText size={20} />
                            <span>Motor Quotation</span>
                        </NavLink>
                    </li>

                    <li className="nav-group-label">Health Insurance</li>

                    <li>
                        <NavLink to="/health-quotation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Heart size={20} />
                            <span>Health Quotation</span>
                        </NavLink>
                    </li>

                    <li className="nav-group-label">Operations</li>

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
                        <>
                            <li className="nav-group-label">Admin</li>
                            <li>
                                <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Settings size={20} />
                                    <span>Settings</span>
                                </NavLink>
                            </li>
                        </>
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
