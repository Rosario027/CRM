import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    currentUser: any;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSuccess, currentUser }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchStaff();
        }
    }, [isOpen]);

    const fetchStaff = async () => {
        try {
            const res = await fetch('/api/staff');
            const data = await res.json();
            if (data.success) {
                setStaffList(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const resolvedAssignedToId = assignedToId === 'self' ? currentUser?.id : parseInt(assignedToId);
        const resolvedAssignedById = currentUser?.id || 1; // Fallback to 1 (admin)

        if (!resolvedAssignedToId || !resolvedAssignedById) {
            alert('Could not determine user. Please log out and log back in.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    dueDate,
                    assignedToId: resolvedAssignedToId,
                    assignedById: resolvedAssignedById
                }),
            });

            const data = await res.json();
            if (data.success) {
                onSuccess();
                onClose();
                // Reset form
                setTitle('');
                setDescription('');
                setPriority('medium');
                setDueDate('');
                setAssignedToId('');
            } else {
                alert(data.message || 'Failed to create task');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Create New Task</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter task title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Describe the task..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Assign To</label>
                            <select
                                value={assignedToId}
                                onChange={(e) => setAssignedToId(e.target.value)}
                                required
                            >
                                <option value="">Select Staff</option>
                                <option value="self">Self (Me)</option>
                                {staffList
                                    .filter(staff => staff.id !== currentUser?.id)
                                    .map(staff => (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.firstName} {staff.lastName}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
