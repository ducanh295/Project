import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const ShoppingCart = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useContext(CartContext);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Calculate subtotal whenever cart items change
    const newSubtotal = cartItems.reduce((acc, item) => {
      if (item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number') {
        return acc + (item.product.price * item.quantity);
      } else {
        console.warn('Skipping item in subtotal calculation due to missing/invalid product data:', item);
        return acc;
      }
    }, 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  return (
    <div>
      <div className="collection-header">
        <div className="collection-hero">
        </div>
      </div>
      <div id="page-content">
        <div className="page section-header text-center">
          <div className="page-title">
            <div className="wrapper">
              <h1 className="page-width">Shopping Cart</h1>
            </div>
          </div>
        </div>
        <div className="bredcrumbWrap">
          <div className="container breadcrumbs">
            <RouterLink to="/" title="Back to the home page">Home</RouterLink><span aria-hidden="true">›</span><span>Shopping Cart</span>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 main-col">
              {cartItems.length === 0 ? (
                <div className="text-center">
                  <h3>Your cart is empty</h3>
                  <RouterLink to="/shop" className="btn btn-secondary btn--small cart-continue">
                    Continue shopping
                  </RouterLink>
                </div>
              ) : (
                <div className="form table-responsive">
                  <form method="post" action="/" className="cart-form">
                    <table className="table table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th className="text-center">Image</th>
                          <th className="text-center">Product Name</th>
                          <th className="text-center">Price</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-center">Total</th>
                          <th className="text-center">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            {item.product ? (
                              <>
                                <td className="text-center">
                                  <RouterLink to={`/detail/${item.product.productId}`}>
                                    <img src={item.product.pictures} alt={item.product.productName} width="50" />
                                  </RouterLink>
                                </td>
                                <td className="text-center">
                                  <RouterLink to={`/detail/${item.product.productId}`}>{item.product.productName}</RouterLink>
                                  <br />
                                  <span>Color: {item.product.colors}</span><br />
                                  <span>Size: {item.product.sizes}</span>
                                </td>
                                <td className="text-center">${item.product.price.toFixed(2)}</td>
                                <td className="text-center">
                                  <div className="qtyField">
                                    <a href="#" className="qtyBtn minus" onClick={(e) => {
                                      e.preventDefault();
                                      handleQuantityChange(item.product.productId, item.quantity - 1);
                                    }}><i className="fa anm anm-minus-r" aria-hidden="true"></i></a>
                                    <input type="text" name="quantity" value={item.quantity} className="qty" readOnly />
                                    <a href="#" className="qtyBtn plus" onClick={(e) => {
                                      e.preventDefault();
                                      handleQuantityChange(item.product.productId, item.quantity + 1);
                                    }}><i className="fa anm anm-plus-r" aria-hidden="true"></i></a>
                                  </div>
                                </td>
                                <td className="text-center">${(item.product.price * item.quantity).toFixed(2)}</td>
                                <td className="text-center">
                                  <a href="#" className="btn btn-sm btn-danger" onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveItem(item.product.productId);
                                  }}>
                                    <i className="fa anm anm-times-l" aria-hidden="true"></i> Remove
                                  </a>
                                </td>
                              </>
                            ) : (
                              <td colSpan="6" className="text-center text-danger">Sản phẩm không khả dụng</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-right"><strong>Subtotal:</strong></td>
                          <td colSpan="2" className="text-center"><strong>${subtotal.toFixed(2)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                    <div className="clearfix cart-footer">
                      <div className="pull-left">
                        <RouterLink to="/shop" className="btn btn-secondary btn--small cart-continue">Continue shopping</RouterLink>
                      </div>
                      <div className="pull-right">
                        <RouterLink to="/checkout" className="btn btn-secondary btn--small">Checkout</RouterLink>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart; 