import React, { useEffect, useState } from 'react';
import {
    Heart, Shield, Car, Plane, Home, Briefcase,
    Plus, IndianRupee, TrendingUp, Clock, Star,
    X, ChevronRight
} from 'lucide-react';
import AddProductModal from './AddProductModal';
import './Products.css';

interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    shortDescription: string;
    premiumStarting: string;
    coverageAmount: string;
    duration: string;
    features: string[];
    terms: string;
    isActive: boolean;
    createdAt: string;
}

interface ProductCatalogProps {
    userRole: string;
}

const categoryConfig: Record<string, { icon: React.ReactNode; gradient: string; color: string; label: string }> = {
    life: { icon: <Heart size={28} />, gradient: 'linear-gradient(135deg, #fce4ec, #f8bbd0)', color: '#e91e63', label: 'Life Insurance' },
    health: { icon: <Shield size={28} />, gradient: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', color: '#4caf50', label: 'Health Insurance' },
    motor: { icon: <Car size={28} />, gradient: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', color: '#2196f3', label: 'Motor Insurance' },
    travel: { icon: <Plane size={28} />, gradient: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', color: '#ff9800', label: 'Travel Insurance' },
    home: { icon: <Home size={28} />, gradient: 'linear-gradient(135deg, #f3e5f5, #ce93d8)', color: '#9c27b0', label: 'Home Insurance' },
    business: { icon: <Briefcase size={28} />, gradient: 'linear-gradient(135deg, #eceff1, #cfd8dc)', color: '#607d8b', label: 'Business Insurance' },
};

const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
};

const ProductCatalog: React.FC<ProductCatalogProps> = ({ userRole }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const isAdmin = userRole === 'admin' || userRole === 'proprietor';

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) fetchProducts();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    return (
        <div className="products-container">
            {/* Hero Header */}
            <div className="products-hero">
                <div className="hero-content">
                    <h1>
                        <Shield size={32} className="hero-icon" />
                        Our Insurance Products
                    </h1>
                    <p>Comprehensive coverage solutions for every aspect of life. Explore our range of insurance products designed to protect what matters most.</p>
                </div>
                {isAdmin && (
                    <button className="add-product-btn" onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}>
                        <Plus size={20} />
                        Add Product
                    </button>
                )}
            </div>

            {/* Category Filter Pills */}
            <div className="category-filters">
                <button
                    className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                >
                    All Products
                </button>
                {Object.entries(categoryConfig).map(([key, config]) => (
                    <button
                        key={key}
                        className={`category-pill ${activeCategory === key ? 'active' : ''}`}
                        onClick={() => setActiveCategory(key)}
                        style={{ '--pill-color': config.color } as React.CSSProperties}
                    >
                        {config.icon}
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Product Cards Grid */}
            {loading ? (
                <div className="products-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="products-empty">
                    <Shield size={64} />
                    <h3>No Products Found</h3>
                    <p>{isAdmin ? 'Start by adding your first insurance product.' : 'Products will appear here once added by admin.'}</p>
                </div>
            ) : (
                <div className="products-grid">
                    {filteredProducts.map((product) => {
                        const config = categoryConfig[product.category] || categoryConfig.business;
                        return (
                            <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                                {/* Card Header with Category */}
                                <div className="card-header" style={{ background: config.gradient }}>
                                    <div className="card-category-icon" style={{ color: config.color }}>
                                        {config.icon}
                                    </div>
                                    <span className="card-category-label" style={{ color: config.color }}>
                                        {config.label}
                                    </span>
                                    {product.duration && (
                                        <span className="card-duration">
                                            <Clock size={12} /> {product.duration}
                                        </span>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="card-body">
                                    <h3 className="card-title">{product.name}</h3>
                                    <p className="card-description">{product.shortDescription || product.description.substring(0, 100)}</p>

                                    {/* Pricing Row */}
                                    <div className="card-pricing">
                                        <div className="pricing-item">
                                            <span className="pricing-label">Premium from</span>
                                            <span className="pricing-value">
                                                <IndianRupee size={14} />
                                                {formatCurrency(product.premiumStarting)}
                                            </span>
                                        </div>
                                        <div className="pricing-divider"></div>
                                        <div className="pricing-item">
                                            <span className="pricing-label">Coverage up to</span>
                                            <span className="pricing-value coverage">
                                                <TrendingUp size={14} />
                                                {formatCurrency(product.coverageAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Features Preview */}
                                    {product.features && product.features.length > 0 && (
                                        <div className="card-features">
                                            {product.features.slice(0, 3).map((feature, i) => (
                                                <div key={i} className="feature-item">
                                                    <Star size={12} />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                            {product.features.length > 3 && (
                                                <span className="more-features">+{product.features.length - 3} more</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Card Footer */}
                                    <div className="card-footer">
                                        <button className="view-details-btn" style={{ color: config.color }}>
                                            View Details <ChevronRight size={16} />
                                        </button>
                                        {isAdmin && (
                                            <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="product-detail-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="detail-close-btn" onClick={() => setSelectedProduct(null)}>
                            <X size={20} />
                        </button>

                        <div className="detail-header" style={{ background: categoryConfig[selectedProduct.category]?.gradient }}>
                            <div style={{ color: categoryConfig[selectedProduct.category]?.color }}>
                                {categoryConfig[selectedProduct.category]?.icon}
                            </div>
                            <span className="detail-category">{categoryConfig[selectedProduct.category]?.label}</span>
                        </div>

                        <div className="detail-body">
                            <h2>{selectedProduct.name}</h2>
                            <p className="detail-description">{selectedProduct.description}</p>

                            <div className="detail-pricing-row">
                                <div className="detail-price-box">
                                    <span className="detail-price-label">Premium Starting</span>
                                    <span className="detail-price-value">{formatCurrency(selectedProduct.premiumStarting)}/yr</span>
                                </div>
                                <div className="detail-price-box highlight">
                                    <span className="detail-price-label">Coverage Amount</span>
                                    <span className="detail-price-value">{formatCurrency(selectedProduct.coverageAmount)}</span>
                                </div>
                            </div>

                            {selectedProduct.duration && (
                                <div className="detail-info-row">
                                    <Clock size={16} /> Policy Duration: <strong>{selectedProduct.duration}</strong>
                                </div>
                            )}

                            {selectedProduct.features && selectedProduct.features.length > 0 && (
                                <div className="detail-features">
                                    <h4>Key Features</h4>
                                    <ul>
                                        {selectedProduct.features.map((f, i) => (
                                            <li key={i}><Star size={14} /> {f}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedProduct.terms && (
                                <div className="detail-terms">
                                    <h4>Terms & Conditions</h4>
                                    <p>{selectedProduct.terms}</p>
                                </div>
                            )}

                            {isAdmin && (
                                <button className="edit-product-btn" onClick={() => { setIsModalOpen(true); }}>
                                    Edit Product
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }}
                onSuccess={fetchProducts}
                editProduct={selectedProduct}
            />
        </div>
    );
};

export default ProductCatalog;
