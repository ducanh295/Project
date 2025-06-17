import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, loading, error, removeCartItem, updateCartItem, clearCart, getCartTotal } = useCart();
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const initialQuantities = {};
        cart.forEach(item => {
            initialQuantities[item.productId] = item.quantity;
        });
        setQuantities(initialQuantities);
    }, [cart]);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
        updateCartItem(productId, newQuantity);
    };

    if (loading) return <div className="container mt-5"><p>Đang tải giỏ hàng...</p></div>;
    if (error) return <div className="container mt-5"><p className="text-danger">Lỗi: {error}</p></div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Giỏ hàng của bạn</h2>
            {cart.length === 0 ? (
                <div className="text-center">
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <Link to="/" className="btn btn-primary">Tiếp tục mua sắm</Link>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.productId}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={item.imageUrl} alt={item.productName} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                                <span>{item.productName}</span>
                                            </div>
                                        </td>
                                        <td>{item.price.toLocaleString('vi-VN')} VND</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantities[item.productId] || 0}
                                                onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                                                className="form-control w-auto"
                                                style={{ minWidth: '70px' }}
                                            />
                                        </td>
                                        <td>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeCartItem(item.productId)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <h4>Tổng cộng: {getCartTotal().toLocaleString('vi-VN')} VND</h4>
                        <div>
                            <button className="btn btn-warning me-2" onClick={clearCart}>Xóa tất cả</button>
                            <Link to="/checkout" className="btn btn-success">Thanh toán</Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage; 