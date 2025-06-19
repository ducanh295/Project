import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalCart, setTotalCart] = useState(0);

  const backendUploadsBaseUrl = 'http://localhost:8080/uploads/';
  const defaultAvatarPath = '/assets/images/avatar_default.png';

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      setTotalCart(0);
      return;
    }
    try {
      const response = await api.get('/api/cart');
      setCartItems(response.data);
      const calculatedTotal = response.data.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalCart(calculatedTotal);
    } catch (error) {
      console.error('Error fetching cart items in Header:', error);
      setCartItems([]);
      setTotalCart(0);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;

    try {
      if (!user) {
        alert('Bạn cần đăng nhập để cập nhật giỏ hàng.');
        navigate('/login');
        return;
      }

      await api.put(`/api/cart/update`, null, {
        params: {
          productId: productId,
          quantity: newQuantity
        }
      });
      fetchCartItems();
    } catch (err) {
      console.error('Error updating quantity from mini-cart:', err);
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
      console.error('Error removing item from mini-cart:', err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isCartOpen) setIsCartOpen(false);
  };

  const toggleCart = async (e) => {
    if (e) e.preventDefault();
    console.log('toggleCart clicked. Current isCartOpen:', isCartOpen);
    setIsCartOpen(!isCartOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (!isCartOpen) {
      console.log('Fetching cart items...');
      await fetchCartItems();
    }
  };

  const handleLogout = () => {
    logout();
    setCartItems([]);
    setTotalCart(0);
  };

  return (
    <div className="header_nav">
      <nav className="navbar">
        <div className="nav__header">
          <div className="nav__logo">
            <RouterLink to="/">RENTAL</RouterLink>
              </div>
          <div className="nav__menu__btn" id="menu-btn" onClick={toggleMenu}>
            <i className="ri-menu-line"></i>
          </div>
        </div>
        <ul className={`nav__links ${isMenuOpen ? 'show-menu' : ''}`} id="nav-links">
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/shop">Shop</RouterLink></li>
          <li><RouterLink to="/about-us">About</RouterLink></li>
          <li><RouterLink to="/contact-us">Contact</RouterLink></li>
        </ul>

        <div className="nav__btn">
          {user ? (
            <div className="site-header__login">
              <button type="button" className="search-trigger" >
                <div className="action">
                  <div className="profile" onClick={toggleMenu}>
                    <img src={user.picture ? `${backendUploadsBaseUrl}${user.picture}` : defaultAvatarPath} alt="" />
      </div>

                  <div className={`menu ${isMenuOpen ? 'active' : ''}`}>
                    <h3>
                      <span>{user.fullName}</span>
                      <div>
                        Operational Team
                      </div>
                    </h3>
                    <ul>
                      <li>
                        <span className="material-icons icons-size">mode</span>
                        <a href="/profile">Profile</a>
                      </li>
                      <li>
                        <span className="material-icons icons-size">call</span>
                        <a href="/contact-us">Contact</a>
                      </li>
                      <li>
                        <span className="material-icons icons-size">insert_comment</span>
                        <a href="/about-us">About us</a>
                      </li>
                      <li>
                        <span className="material-icons icons-size">logout</span>
                        <a href="/login" onClick={handleLogout}>Logout</a>
                      </li>
                    </ul>
                  </div>
              </div>
              </button>
            </div>
          ) : (
            <div className="site-header__login">
              <button type="button" className="search-trigger" >
                <RouterLink to="/login" style={{ color: '#000' }}><i className="icon anm anm-user-circle-o"></i></RouterLink>
              </button>
            </div>
          )}

          <div className="site-cart">
            <a href="#" className="site-header__cart" title="Cart" onClick={toggleCart}> <i
              className="icon anm anm-bag-l"></i>
              <span id="CartCount" className="site-header__cart-count" data-cart-render="item_count">{cartItems.length}</span>
            </a>

            {isCartOpen && (
              <div id="header-cart" className="block block-cart" style={{ display: 'block' }}>
                <ul className="mini-products-list">
                  {cartItems.length === 0 ? (
                    <li className="item text-center">
                      Giỏ hàng trống
                    </li>
                  ) : (
                    cartItems.map((item, index) => (
                    <li className="item" key={index}>
                      <a className="product-image" href="#">
                        <img src={item.picture} alt={item.productName} title={item.productName} />
                      </a>
                      <div className="product-details">
                          <a href="#" className="remove" onClick={(e) => { e.preventDefault(); handleRemoveItem(item.productId); }}><i className="anm anm-times-l" aria-hidden="true"></i></a>
                        <a href="#" className="edit-i remove"><i className="anm anm-edit" aria-hidden="true"></i></a>
                        <a className="pName" href="/cart">{item.productName}</a>
                        <div className="variant-cart"><span>{item.color}</span> / <span>{item.size}</span></div>
                        <div className="wrapQtyBtn">
                          <div className="qtyField">
                            <span className="label">Qty:</span>
                              <a className="qtyBtn minus" href="#" onClick={(e) => { e.preventDefault(); handleQuantityChange(item.productId, item.quantity - 1); }}><i className="fa anm anm-minus-r" aria-hidden="true"></i></a>
                              <input type="text" id={`Quantity-${item.productId}`} name="quantity" value={item.quantity} className="product-form__input qty" readOnly />
                              <a className="qtyBtn plus" href="#" onClick={(e) => { e.preventDefault(); handleQuantityChange(item.productId, item.quantity + 1); }}><i className="fa anm anm-plus-r" aria-hidden="true"></i></a>
              </div>
            </div>
                        <div className="priceRow">
                          <div className="product-price">
                              {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </div>
        </div>
      </div>
                    </li>
                    ))
                  )}
                </ul>

                <div className="total">
                  <div className="total-in">
                    <span className="label">Cart Subtotal:</span><span
                      className="product-price">{totalCart.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </div>
                  <div className="buttonSet text-center">
                    <RouterLink to="/cart" className="btn btn-secondary btn--small">View
                      Cart</RouterLink> <RouterLink to="/checkout" className="btn btn-secondary btn--small">Checkout</RouterLink>
                  </div>
                </div>
            </div>
            )}
          </div>
        </div>
      </nav>
      </div>
  );
};

export default Header; 