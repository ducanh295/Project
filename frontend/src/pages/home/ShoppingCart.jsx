import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Sử dụng AuthContext

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      if (!user) { // Kiểm tra user từ context
        alert('Bạn cần đăng nhập để xem giỏ hàng.');
        navigate('/login');
        return;
      }

      const response = await api.get('/api/cart');
      setCartItems(response.data);
      calculateSubtotal(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      if (err.response && err.response.status === 401) {
        alert('Phiên đăng nhập của bạn đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]); // Thêm user vào dependency array để re-fetch khi trạng thái user thay đổi

  const calculateSubtotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(total);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;

    try {
      if (!user) {
        alert('Bạn cần đăng nhập để cập nhật giỏ hàng.');
        navigate('/login');
        return;
      }

      await api.put(`/api/cart/update`, null, { // Đổi endpoint nếu cần
        params: {
          productId: productId,
          quantity: newQuantity
        }
      });
      fetchCartItems();
    } catch (err) {
      console.error('Error updating quantity:', err);
      if (err.response && err.response.status === 401) {
        alert('Phiên đăng nhập của bạn đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        alert('Không thể cập nhật số lượng. Vui lòng thử lại sau.');
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      if (!user) {
        alert('Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng.');
        navigate('/login');
        return;
      }

      await api.delete(`/api/cart/remove-item`, {
        params: {
          productId: productId
        }
      });
      fetchCartItems();
    } catch (err) {
      console.error('Error removing item:', err);
      if (err.response && err.response.status === 401) {
        alert('Phiên đăng nhập của bạn đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      }
    }
  };

  const handleUpdateCart = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Bạn cần đăng nhập để cập nhật giỏ hàng.');
      navigate('/login');
      return;
    }
    try {
      // Lặp qua từng sản phẩm và gọi API cập nhật từng sản phẩm
      for (const item of cartItems) {
        await api.put(`/api/cart/update`, null, {
          params: {
            productId: item.productId,
            quantity: item.quantity
          }
        });
      }
      alert('Giỏ hàng đã được cập nhật!');
      fetchCartItems();
    } catch (err) {
      console.error('Error updating cart:', err);
      alert('Không thể cập nhật giỏ hàng. Vui lòng thử lại sau.');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    // Lấy thông tin từ form
    const receiveName = e.target.receiveName.value;
    const receiveAddress = e.target.receiveAddress.value;
    const receivePhone = e.target.receivePhone.value;
    const note = e.target.note.value;
    const tearm = e.target.tearm.checked;

    if (!tearm) {
      alert('Bạn phải đồng ý với các điều khoản và điều kiện.');
      return;
    }

    try {
      if (!user) {
        alert('Bạn cần đăng nhập để thanh toán.');
        navigate('/login');
        return;
      }
      // Assuming your backend expects a specific order object
      const order = {
        receiveName,
        receiveAddress,
        receivePhone,
        note,
        // total amount will be calculated on backend based on cart items
      };
      await api.post('/api/checkout', order);
      alert('Đặt hàng thành công!');
      navigate('/order-success'); // Navigate to a success page
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('Lỗi khi thanh toán. Vui lòng thử lại sau.');
    }
  };


  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div id="page-content">
      <div className="page section-header text-center">
        <div className="page-title">
          <div className="wrapper">
            <h1 className="page-width">Your cart</h1>
            {/* <span style={{ color: 'blue' }} th:text="${msg}"></span> */}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-8 col-lg-8 main-col">
            <form onSubmit={handleUpdateCart} className="cart style2">
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th colSpan="2" className="text-center">Product</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-right">Total</th>
                    <th className="action">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">Giỏ hàng của bạn đang trống.</td>
                    </tr>
                  ) : (
                    cartItems.map((item) => (
                      <tr key={item.productId} className="cart__row border-bottom line1 cart-flex border-top">
                        {/* <input type="hidden" name="productids[]" value={item.productId}/> */}
                        <td className="cart__image-wrapper cart-flex-item">
                          <RouterLink to={`/shop/chi-tiet/${item.productId}`}>
                            <img className="cart__image" src={item.picture} alt={item.productName} />
                          </RouterLink>
                        </td>
                        <td className="cart__meta small--text-left cart-flex-item">
                          <div className="list-view-item__title">
                            <RouterLink to={`/shop/chi-tiet/${item.productId}`}>{item.productName}</RouterLink>
                          </div>
                          <div className="cart__meta-text">
                            Color: <span>{item.color}</span><br />Size: <span>{item.size}</span><br />
                          </div>
                        </td>
                        <td className="cart__price-wrapper cart-flex-item">
                          <span className="money">{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </td>
                        <td className="cart__update-wrapper cart-flex-item text-right">
                          <div className="cart__qty text-center">
                            <div className="qtyField">
                              <a className="qtyBtn minus" href="#" onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}><i className="icon icon-minus"></i></a>
                              <input className="cart__qty-input qty" type="text" name="quantities[]" value={item.quantity} pattern="[0-9]*" readOnly />
                              <a className="qtyBtn plus" href="#" onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}><i className="icon icon-plus"></i></a>
                            </div>
                          </div>
                        </td>
                        <td className="text-right small--hide cart-price">
                          <div><span className="money">{(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                        </td>
                        <td className="text-center small--hide">
                          <a href="#" onClick={() => { if (window.confirm('Bạn có muốn xóa không?')) handleRemoveItem(item.productId); }} className="btn btn--secondary cart__remove" title="Remove item">
                            <i className="icon icon anm anm-times-l"></i>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-left">
                      <RouterLink to="/shop" className="btn--link cart-continue">
                        <i className="icon icon-arrow-circle-left"></i> Continue shopping
                      </RouterLink>
                    </td>
                    <td colSpan="3" className="text-right">
                      <button type="submit" name="update" className="btn btn-primary cart-update">
                        <i className="fa fa-refresh"></i> Update
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </form>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 cart__footer">
            <form onSubmit={handleCheckout}>
              <div className="cart-note">
                {user ? (
                  <div className="solid-border">
                    <h3>INFORMATION RECEIVER</h3>
                    <label>FullName</label><input type="text" value={user.fullName || ''} name="receiveName" readOnly/>
                    <label>Address</label><input type="text" value={user.address || ''} name="receiveAddress" readOnly/>
                    <label>Phone</label><input type="text" value={user.phone || ''} name="receivePhone" readOnly/>
                    <label>Note</label><input type="text" name="note" />
                    <div className="solid-border">
                      <div className="row">
                        <span className="col-12 col-sm-6 cart__subtotal-title"><strong>Subtotal</strong></span>
                        <span className="col-12 col-sm-6 cart__subtotal-title cart__subtotal text-right">
                          <span className="money">{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </span>
                      </div>
                      <div className="cart__shipping">Shipping &amp; taxes calculated at checkout</div>
                      <p className="cart_tearm">
                        <label>
                          <input type="checkbox" name="tearm" id="cartTearm" className="checkbox" value="tearm" required />
                          I agree with the terms and conditions
                        </label>
                      </p>
                      <input type="submit" name="checkout" id="cartCheckout" className="btn btn--small-wide checkout" value="Checkout" />
                      <div className="paymnet-img">
                        <img src="/assets/images/payment-img.jpg" alt="Payment" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="solid-border">
                    <div className="row">
                      <span className="col-12 col-sm-6 cart__subtotal-title"><strong>Subtotal</strong></span>
                      <span className="col-12 col-sm-6 cart__subtotal-title cart__subtotal text-right">
                        <span className="money">{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                      </span>
                    </div>
                    <div className="cart__shipping">Shipping &amp; taxes calculated at checkout</div>
                    <p className="cart_tearm">
                      <label>
                        <input type="checkbox" name="tearm" id="cartTearm" className="checkbox" value="tearm" required />
                        I agree with the terms and conditions
                      </label>
                    </p>
                    <RouterLink to="/login" id="cartCheckout" className="btn btn--small-wide checkout">Checkout</RouterLink>
                    <div className="paymnet-img">
                      <img src="/assets/images/payment-img.jpg" alt="Payment" />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
