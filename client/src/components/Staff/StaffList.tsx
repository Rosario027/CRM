import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import AddStaffModal from './AddStaffModal';
import './Staff.css';

interface StaffMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string;
    title: string;
    isActive: boolean;
}

const StaffList: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchStaff = async () => {
        try {
            const response = await fetch('/api/staff');
            const data = await response.json();
            if (data.success) {
                setStaff(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleAddStaff = async (staffData: any) => {
        try {
            const response = await fetch('/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(staffData),
            });

            const data = await response.json();

            if (data.success) {
                // Refresh list
                fetchStaff();
            } else {
                // Show detailed error message
                console.error('Error response:', data);
                alert(data.message || 'Failed to add staff');
                throw new Error(data.message || 'Failed to add staff');
            }
        } catch (error: any) {
            console.error('Error adding staff:', error);
            alert(`Error: ${error.message || 'Failed to add staff member. Please try again.'}`);
            throw error;
        }
    };

    return (
        <div className="staff-container">
            <div className="staff-header">
                <h1>Staff & Employees</h1>
                <button className="add-staff-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="staff-table-container">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Job Title</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td>
                            </tr>
                        ) : staff.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No staff members found.</td>
                            </tr>
                        ) : (
                            staff.map((member) => (
                                <tr key={member.id}>
                                    <td style={{ fontWeight: 500 }}>{member.firstName} {member.lastName}</td>
                                    <td>
                                        <span className={`role-badge ${member.role}`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td>{member.department || '-'}</td>
                                    <td>{member.title || '-'}</td>
                                    <td>{member.email}</td>
                                    <td>
                                        <div className="status-indicator">
                                            <div className={`status-dot ${member.isActive ? 'active' : 'inactive'}`}></div>
                                            <span>{member.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddStaff}
            />
        </div>
    );
};

export default StaffList;
