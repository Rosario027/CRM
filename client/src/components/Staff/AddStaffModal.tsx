import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Staff.css';

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (staffData: any) => Promise<void>;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        role: 'staff',
        title: '',
        password: 'password123', // Default password for now
        employeeId: '',
        username: ''
    });
    const [usernameManuallyEdited, setUsernameManuallyEdited] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };

        // Auto-set username to firstName if not manually edited
        if (name === 'firstName' && !usernameManuallyEdited) {
            updated.username = value;
        }
        if (name === 'username') {
            setUsernameManuallyEdited(value !== '');
        }

        setFormData(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await onAdd(formData);
            onClose();
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                department: '',
                role: 'staff',
                title: '',
                password: 'password123',
                employeeId: '',
                username: ''
            });
            setUsernameManuallyEdited(false);
        } catch (error: any) {
            console.error('Error adding staff:', error);
            setError(error.message || 'Failed to add employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Add New Employee</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {error && (
                        <div className="error-message" style={{ background: '#fee', color: '#c33', padding: '10px', borderRadius: '4px', marginBottom: '10px', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            name="employeeId"
                            className="form-input"
                            value={formData.employeeId}
                            onChange={handleChange}
                            placeholder="e.g. EMP001"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-input"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-input"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Auto-filled from First Name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                name="department"
                                className="form-input"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            className="form-input"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="staff">Staff</option>
                            <option value="admin">Administrator</option>
                            <option value="proprietor">Proprietor</option>
                        </select>
                    </div>

                    {/* Hidden password field, hardcoded for now or allow edit */}
                    <div className="form-group">
                        <label>Initial Password</label>
                        <input
                            type="text"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffModal;
