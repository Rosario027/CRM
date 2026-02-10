import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';
import './Expenses.css';

const ExpenseDashboard: React.FC = () => {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get current user
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userRole = user?.role || 'staff';

    useEffect(() => {
        if (user) {
            fetchExpenses();
        }
    }, []);

    const fetchExpenses = async () => {
        try {
            let url = '/api/expenses';
            if (userRole === 'staff') {
                url += `?role=staff&userId=${user.id}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setExpenses(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/expenses/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                fetchExpenses();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="expenses-container">
            <div className="expenses-header">
                <div>
                    <h1>Expense Tracking</h1>
                    <p>Manage office expenses and reimbursements.</p>
                </div>
                {userRole === 'staff' && (
                    <button className="add-expense-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        Add Expense
                    </button>
                )}
            </div>

            <div className="expenses-grid">
                <div className="expenses-list">
                    <table className="expenses-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                                {(userRole === 'admin' || userRole === 'proprietor') && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.userName}</td>
                                    <td>
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className="category-badge">{expense.category}</span>
                                    </td>
                                    <td>{expense.description}</td>
                                    <td className="amount">₹{expense.amount}</td>
                                    <td>
                                        <span className={`status-badge ${expense.status}`}>
                                            {expense.status}
                                        </span>
                                    </td>
                                    {(userRole === 'admin' || userRole === 'proprietor') && (
                                        <td>
                                            {expense.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="action-btn approve"
                                                        onClick={() => handleStatusUpdate(expense.id, 'approved')}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        onClick={() => handleStatusUpdate(expense.id, 'rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No expenses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="expense-stats">
                    <div className="stats-card">
                        <h3>Total Pending</h3>
                        <div className="stats-number">
                            ₹{expenses
                                .filter(e => e.status === 'pending')
                                .reduce((sum, e) => sum + parseFloat(e.amount), 0)
                                .toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {user && (
                <AddExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchExpenses}
                    userId={user.id}
                />
            )}
        </div>
    );
};

export default ExpenseDashboard;
