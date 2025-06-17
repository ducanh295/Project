import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Detail = () => {
  const { productId } = useParams(); // Get product ID from URL - CHANGED FROM id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const navigate = useNavigate(); // Hook for navigation

  console.log('Detail Component Rendered');
  console.log('ID from useParams:', productId); // CHANGED FROM id

  const calculateDiscount = (priceOld, price) => {
    if (!priceOld || !price || parseFloat(priceOld) <= parseFloat(price)) return 0;
    return ((parseFloat(priceOld) - parseFloat(price)) / parseFloat(priceOld)) * 100;
  };

  const calculateSaveAmount = (priceOld, price) => {
    if (!priceOld || !price || parseFloat(priceOld) <= parseFloat(price)) return 0;
    return parseFloat(priceOld) - parseFloat(price);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${productId}`); // Changed from axios.get to api.get
        setProduct(response.data);
        console.log('Product data fetched:', response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
        console.log('Loading set to false. Current product:', product);
      }
    };

    if (productId) { // CHANGED FROM id
      fetchProduct();
    }
  }, [productId]); // CHANGED FROM id

  console.log('Current loading state:', loading);
  console.log('Current error state:', error);
  console.log('Current product state:', product);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
        navigate('/login'); // Redirect to login page if not logged in
        return;
      }

      const response = await api.post('/api/cart/add', null, {
        params: {
          productId: product.productId,
          quantity: quantity
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Product added to cart:', response.data);
      alert('Sản phẩm đã được thêm vào giỏ hàng!');
      navigate('/cart'); // Navigate to shopping cart page
    } catch (err) {
      console.error('Error adding product to cart:', err);
      if (err.response && err.response.status === 401) {
        alert('Phiên đăng nhập của bạn đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
      }
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

  if (!product) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning" role="alert">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="collection-header">
        <div className="collection-hero"></div>
      </div>

      <div id="page-content">
        <div id="MainContent" className="main-content" role="main">
          <div className="bredcrumbWrap">
            <div className="container breadcrumbs">
              <RouterLink to="/" title="Back to the home page">Home</RouterLink>
              <span aria-hidden="true">›</span>
              <RouterLink to="/shop" title="Back to shop">Shop</RouterLink>
              <span aria-hidden="true">›</span>
              <span>{product.productName}</span>
            </div>
          </div>

          <div id="ProductSection-product-template" className="product-template__container prstyle2 container">
            <div className="product-single product-single-1">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                  <div className="product-details-img product-single__photos bottom">
                    <div className="zoompro-wrap product-zoom-right pl-20">
                      <div className="zoompro-span">
                        {product.pictures && (
                          <img
                            className="zoompro lazyload"
                            src={product.pictures}
                            alt={product.productName}
                            data-zoom-image={product.pictures}
                          />
                        )}
                      </div>
                      {calculateDiscount(product.priceOld, product.price) > 0 && (
                        <div className="product-labels">
                          <span className="lbl on-sale">Sale</span>
                        </div>
                      )}
                      <div className="product-buttons">
                        <a href="#" className="btn prlightbox" title="Zoom">
                          <i className="icon anm anm-expand-l-arrows" aria-hidden="true"></i>
                        </a>
                      </div>
                    </div>
                    <div className="product-thumb product-thumb-1"></div>
                    <div className="lightboximages">
                      <a href="/assets/images/product-detail-page/camelia-reversible-big1.jpg" data-size="1462x2048"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big2.jpg" data-size="1462x2048"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big3.jpg" data-size="1462x2048"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible7-big.jpg" data-size="1462x2048"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big4.jpg" data-size="1462x2048"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big5.jpg" data-size="1462x2048"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big6.jpg" data-size="731x1024"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big7.jpg" data-size="731x1024"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big8.jpg" data-size="731x1024"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big9.jpg" data-size="731x1024"></a>
                      <a href="/assets/images/product-detail-page/camelia-reversible-big10.jpg" data-size="731x1024"></a>
                    </div>
                  </div>
                  <div className="prFeatures">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 feature">
                        <img src="/assets/images/credit-card.png" alt="Safe Payment" title="Safe Payment" />
                        <div className="details"><h3>Safe Payment</h3>Pay with the world's most payment methods.</div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 feature">
                        <img src="/assets/images/shield.png" alt="Confidence" title="Confidence" />
                        <div className="details"><h3>Confidence</h3>Protection covers your purchase and personal data.</div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 feature">
                        <img src="/assets/images/worldwide.png" alt="Worldwide Delivery" title="Worldwide Delivery" />
                        <div className="details"><h3>Worldwide Delivery</h3>FREE &amp; fast shipping to over 200+ countries &amp; regions.</div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 feature">
                        <img src="/assets/images/phone-call.png" alt="Hotline" title="Hotline" />
                        <div className="details"><h3>Hotline</h3>Talk to help line for your question on 4141 456 789, 4125 666 888</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                  <div className="product-single__meta">
                    <h1 className="product-single__title">{product.productName}</h1>
                    <div className="product-nav clearfix">
                      <a href="#" className="next" title="Next"><i className="fa fa-angle-right" aria-hidden="true"></i></a>
                    </div>
                    <div className="prInfoRow">
                      <div className="product-stock">
                        <span className="instock">In Stock</span>
                      </div>
                      <div className="product-sku">SKU: <span className="variant-sku">{product.productId}</span></div>
                      <div className="product-review"><a className="reviewLink" href="#tab2"><i className="font-13 fa fa-star"></i><i className="font-13 fa fa-star"></i><i className="font-13 fa fa-star"></i><i className="font-13 fa fa-star-o"></i><i className="font-13 fa fa-star-o"></i><span className="spr-badge-caption">6 reviews</span></a></div>
                    </div>
                    <p className="product-single__price product-single__price-product-template">
                      {calculateDiscount(product.priceOld, product.price) > 0 && (
                        <s id="ComparePrice-product-template">
                          <span className="money">{parseFloat(product.priceOld).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </s>
                      )}
                      <span className="product-price__price product-price__price-product-template product-price__sale product-price__sale--single">
                        <span id="ProductPrice-product-template">
                          <span className="money">
                            {parseFloat(product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </span>
                        </span>
                      </span>
                      {calculateDiscount(product.priceOld, product.price) > 0 && (
                        <span className="discount-badge">
                          <span className="devider">|</span>&nbsp;
                          <span>You Save</span>
                          <span id="SaveAmount-product-template" className="product-single__save-amount">
                            <span className="money">
                              {calculateSaveAmount(product.priceOld, product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>
                          </span>
                          <span className="off">(<span>{calculateDiscount(product.priceOld, product.price).toFixed(0)}</span>%)</span>
                        </span>
                      )}
                    </p>
                    <div className="product-single__description rte">
                      <p>{product.description}</p>
                    </div>
                    <form method="post" action="/api/cart/add" id="product_form" className="product-form product-form-product-template hidedropdown" onSubmit={handleAddToCart}>
                      <input type="hidden" name="productId" value={product.productId} />
                      <div className="product-action clearfix">
                        <div className="product-form__item--quantity">
                          <div className="wrapQtyBtn">
                            <div className="qtyField">
                              <a href="#" className="qtyBtn minus" onClick={(e) => { e.preventDefault(); handleQuantityChange(quantity - 1); }}><i className="fa anm anm-minus-r" aria-hidden="true"></i></a>
                              <input type="text" name="quantity" value={quantity} className="qty" onChange={handleInputChange} />
                              <a href="#" className="qtyBtn plus" onClick={(e) => { e.preventDefault(); handleQuantityChange(quantity + 1); }}><i className="fa anm anm-plus-r" aria-hidden="true"></i></a>
                            </div>
                          </div>
                        </div>
                        <div className="product-form__item--submit">
                          <button type="submit" name="add" className="btn product-form__cart-submit">
                            <span>Add to cart</span>
                          </button>
                        </div>
                      </div>
                    </form>
                    <div className="display-table shareRow">
                      <div className="display-table-cell medium-up--one-third">
                        <div className="wishlist-btn">
                          <a className="wishlist add-to-wishlist" href="#" title="Add to Wishlist"><i className="icon anm anm-heart-l" aria-hidden="true"></i> <span>Add to Wishlist</span></a>
                        </div>
                      </div>
                      <div className="display-table-cell text-right">
                        <div className="social-sharing">
                          <a target="_blank" href="#" className="btn btn--small btn--secondary btn--share share-facebook" title="Share on Facebook">
                            <i className="fa fa-facebook-square" aria-hidden="true"></i> <span className="share-title" aria-hidden="true">Share</span>
                          </a>
                          <a target="_blank" href="#" className="btn btn--small btn--secondary btn--share share-twitter" title="Tweet on Twitter">
                            <i className="fa fa-twitter" aria-hidden="true"></i> <span className="share-title" aria-hidden="true">Tweet</span>
                          </a>
                          <a href="#" title="Share on google+" className="btn btn--small btn--secondary btn--share" >
                            <i className="fa fa-google-plus" aria-hidden="true"></i> <span className="share-title" aria-hidden="true">Google+</span>
                          </a>
                          <a target="_blank" href="#" className="btn btn--small btn--secondary btn--share share-pinterest" title="Pin on Pinterest">
                            <i className="fa fa-pinterest" aria-hidden="true"></i> <span className="share-title" aria-hidden="true">Pin it</span>
                          </a>
                          <a href="#" className="btn btn--small btn--secondary btn--share share-pinterest" title="Share by Email" target="_blank">
                            <i className="fa fa-envelope" aria-hidden="true"></i> <span className="share-title" aria-hidden="true">Email</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tabs-listing">
                    <div className="tab-container">
                      <h3 className="acor-ttl active" rel="tab1">Product Details</h3>
                      <div id="tab1" className="tab-content">
                        <div className="product-description rte">
                          <p>{product.description}</p>
                        </div>
                      </div>
                      <h3 className="acor-ttl" rel="tab2">Product Reviews</h3>
                      <div id="tab2" className="tab-content">
                        <div className="product-description rte">
                          <p>{product.brief}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail; 