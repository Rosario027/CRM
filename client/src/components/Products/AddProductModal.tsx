import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editProduct?: any;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess, editProduct }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'life',
        description: '',
        shortDescription: '',
        premiumStarting: '',
        coverageAmount: '',
        duration: '1 Year',
        terms: '',
    });
    const [features, setFeatures] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name || '',
                category: editProduct.category || 'life',
                description: editProduct.description || '',
                shortDescription: editProduct.shortDescription || '',
                premiumStarting: editProduct.premiumStarting || '',
                coverageAmount: editProduct.coverageAmount || '',
                duration: editProduct.duration || '1 Year',
                terms: editProduct.terms || '',
            });
            setFeatures(editProduct.features?.length ? editProduct.features : ['']);
        } else {
            resetForm();
        }
    }, [editProduct, isOpen]);

    const resetForm = () => {
        setFormData({
            name: '', category: 'life', description: '', shortDescription: '',
            premiumStarting: '', coverageAmount: '', duration: '1 Year', terms: '',
        });
        setFeatures(['']);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFeatureChange = (index: number, value: string) => {
        const updated = [...features];
        updated[index] = value;
        setFeatures(updated);
    };

    const addFeature = () => setFeatures([...features, '']);

    const removeFeature = (index: number) => {
        if (features.length > 1) {
            setFeatures(features.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const cleanFeatures = features.filter(f => f.trim() !== '');

        const body = {
            ...formData,
            features: cleanFeatures,
            createdById: user.id || 1,
        };

        try {
            const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products';
            const method = editProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                onSuccess();
                onClose();
                resetForm();
            } else {
                alert(data.message || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container product-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editProduct ? 'Edit Product' : 'Add Insurance Product'}</h2>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. NEWERA Health Shield" required />
                        </div>
                        <div className="form-group">
                            <label>Category *</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="life">Life Insurance</option>
                                <option value="health">Health Insurance</option>
                                <option value="motor">Motor Insurance</option>
                                <option value="travel">Travel Insurance</option>
                                <option value="home">Home Insurance</option>
                                <option value="business">Business Insurance</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Short Description</label>
                        <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Brief one-liner about the product" maxLength={150} />
                    </div>

                    <div className="form-group">
                        <label>Full Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed product description..." rows={3} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Premium Starting (₹) *</label>
                            <input type="number" name="premiumStarting" value={formData.premiumStarting} onChange={handleChange} placeholder="e.g. 5000" required min="0" step="0.01" />
                        </div>
                        <div className="form-group">
                            <label>Coverage Amount (₹) *</label>
                            <input type="number" name="coverageAmount" value={formData.coverageAmount} onChange={handleChange} placeholder="e.g. 500000" required min="0" step="0.01" />
                        </div>
                        <div className="form-group">
                            <label>Duration</label>
                            <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 1 Year, Lifetime" />
                        </div>
                    </div>

                    {/* Dynamic Features List */}
                    <div className="form-group features-group">
                        <label>Key Features</label>
                        {features.map((feature, index) => (
                            <div key={index} className="feature-input-row">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    placeholder={`Feature ${index + 1}, e.g. Cashless hospitalization`}
                                />
                                {features.length > 1 && (
                                    <button type="button" className="remove-feature-btn" onClick={() => removeFeature(index)}>
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="add-feature-btn" onClick={addFeature}>
                            <Plus size={16} /> Add Feature
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Terms & Conditions</label>
                        <textarea name="terms" value={formData.terms} onChange={handleChange} placeholder="Product terms and conditions..." rows={2} />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : (editProduct ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
