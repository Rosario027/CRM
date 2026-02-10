import React, { useState, useEffect } from 'react';
import { Plus, Calendar, User } from 'lucide-react';
import TaskModal from './TaskModal';
import './Tasks.css';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'my'>('all');

    // Get current user
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userRole = user?.role || 'staff';

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const fetchTasks = async () => {
        try {
            let url = '/api/tasks';
            if (filter === 'my' && user) {
                url += `?role=staff&userId=${user.id}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setTasks(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                fetchTasks(); // Refresh list
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <div>
                    <h1>Tasks</h1>
                    <p>Manage and track team tasks.</p>
                </div>
                {(userRole === 'admin' || userRole === 'proprietor') && (
                    <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        New Task
                    </button>
                )}
            </div>

            <div className="tasks-filter">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Tasks
                </button>
                <button
                    className={`filter-btn ${filter === 'my' ? 'active' : ''}`}
                    onClick={() => setFilter('my')}
                >
                    My Tasks
                </button>
            </div>

            <div className="tasks-list">
                {tasks.map((task) => (
                    <div key={task.id} className="task-card">
                        <div className="task-content">
                            <div className="task-header">
                                <span className={`priority-badge ${task.priority}`}>
                                    {task.priority}
                                </span>
                                <h3 className="task-title">{task.title}</h3>
                            </div>

                            <p className="task-description">{task.description}</p>

                            <div className="task-meta">
                                <div className="meta-item">
                                    <User size={14} />
                                    <span>{task.assignedToName}</span>
                                </div>
                                {task.dueDate && (
                                    <div className="meta-item">
                                        <Calendar size={14} />
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="task-actions">
                            <select
                                className="status-select"
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="empty-state">No tasks found.</div>
                )}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTasks}
                currentUser={user}
            />
        </div>
    );
};

export default TaskList;
