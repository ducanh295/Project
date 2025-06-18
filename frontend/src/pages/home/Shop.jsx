import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import carService from '../../services/carService';
import categoryService from '../../services/categoryService';

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryToggle = (categoryId) => {
    setOpenCategories(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId]
    }));
  };

  const handleCategoryFilter = async (categoryId = null) => {
    setSelectedCategoryId(categoryId);
    setLoading(true);
    try {
      const response = categoryId 
        ? await carService.getProductsByCategory(categoryId) 
        : await carService.getAllCars();
      setProducts(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const performSearch = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const response = await carService.searchProducts(term);
      setProducts(response);
    } catch (err) {
      setError('Failed to search products. Please try again later.');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        console.log('Categories fetched:', response);
        setCategories(response);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await carService.getAllCars();
        console.log('Products fetched:', response);
        setProducts(response);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    handleCategoryFilter();
  }, []);

  useEffect(() => {
    // Initialize countdown timer after products are loaded
    if (window.jQuery && products.length > 0) {
      window.jQuery('[data-countdown]').each(function () {
        const $this = window.jQuery(this);
        const finalDate = $this.data('countdown');
        // Only initialize if it hasn't been initialized already to prevent re-initialization on re-renders
        if (!$this.data('countdown-initialized')) {
          $this.countdown(finalDate, function (event) {
            $this.html(event.strftime(
              '<span class="ht-count days"><span class="count-inner">%D</span> Days</span>' +
              '<span class="ht-count hour"><span class="count-inner">%H</span> Hr</span>' +
              '<span class="ht-count minutes"><span class="count-inner">%M</span> Min</span>' +
              '<span class="ht-count second"><span class="count-inner">%S</span> Sc</span>'
            ));
          });
          $this.data('countdown-initialized', true); // Mark as initialized
        }
      });
    }
  }, [products]); // Re-run this effect when products data changes

  console.log('Rendering Shop component - Categories:', categories);
  console.log('Rendering Shop component - Products:', products);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">{error}</div>;
  }

  return (
    <div>
      <div className="collection-header">
        <div className="collection-hero">
          <div className="collection-hero__image"></div>
          <div>
            <h1 className="collection-hero__title page-width" style={{ color: '#000' }}>Our Product Collection</h1>
          </div>
        </div>
      </div>

      <div id="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-3 col-lg-2 sidebar filterbar">
              <div className="closeFilter d-block d-md-none d-lg-none">
                <i className="icon icon anm anm-times-l"></i>
              </div>
              <div className="sidebar_tags">
                <div className="sidebar_widget search-widget">
                  <div className="widget-title">
                    <h2>Search Products</h2>
                  </div>
                  <div className="widget-content">
                    <div className="search-box-sidebar" style={{ display: 'flex' }}>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            performSearch(searchTerm);
                          }
                        }}
                        className="form-control"
                        style={{ flexGrow: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      />
                      <button onClick={() => performSearch(searchTerm)} className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                        <i className="icon anm anm-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="sidebar_widget categories filter-widget">
                  <div className="widget-title">
                    <h2>Categories</h2>
                  </div>
                  <div className="widget-content">
                    <ul className="sidebar_categories">
                      {Array.isArray(categories) && categories.map((p, index) => (
                        !p.parent && ( <React.Fragment key={index} >
                            {Array.isArray(p.subcategories) && p.subcategories.length > 0 ? (
                              <li className={`level1 sub-level ${openCategories[p.categoryId] ? 'open' : ''}`}>
                                <a href="#" className="site-nav" style={{ color: '#000', fontWeight: 'bold' }} onClick={(e) => {
                                  e.preventDefault();
                                  handleCategoryToggle(p.categoryId);
                                  handleCategoryFilter(p.categoryId);
                                }}>
                                  {p.categoryName}
                                </a>
                                <ul className="sublinks" style={{ display: openCategories[p.categoryId] ? 'block' : 'none' }}>
                                  {p.subcategories.map((c, subIndex) => (
                                    <li className="level2" key={subIndex}>
                                      <a href="#" className="site-nav" style={{ color: '#000' }} onClick={(e) => { e.preventDefault(); handleCategoryFilter(c.categoryId); }}>{c.categoryName}</a>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ) : (
                              <li className="level1">
                                <a href="#" className="site-nav" style={{ color: '#000' }} onClick={(e) => { e.preventDefault(); handleCategoryFilter(p.categoryId); }}>{p.categoryName}</a>
                              </li>
                            )}
                          </React.Fragment>
                        )
                      ))}
                      <li className="level1">
                        <a href="#" className="site-nav" style={{ color: '#000', fontWeight: selectedCategoryId === null ? 'bold' : 'normal' }} onClick={(e) => { e.preventDefault(); handleCategoryFilter(null); }}>
                          All Products
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="sidebar_widget static-banner">
                  <img src="/assets/images/side-banner-2.jpg" alt="" />
                </div>
                <div className="sidebar_widget">
                  <div className="widget-title">
                    <h2>Information</h2>
                  </div>
                  <div className="widget-content">
                    <p>Use this text to share information about your brand with your customers. Describe a product, share announcements, or welcome customers to your store.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-9 col-lg-10 main-col">
              <div className="productList">
                <button type="button" className="btn btn-filter d-block d-md-none d-lg-none">
                  Product Filters
                </button>
                <div className="toolbar">
                  <div className="filters-toolbar-wrapper">
                    <div className="row">
                      <div className="col-4 col-md-4 col-lg-4 filters-toolbar__item collection-view-as d-flex justify-content-start align-items-center">
                        <a href="#" title="Grid View" className="change-view change-view--active">
                          <img src="/assets/images/grid.jpg" alt="Grid" />
                        </a>
                        <a href="#" title="List View" className="change-view">
                          <img src="/assets/images/list.jpg" alt="List" />
                        </a>
                      </div>
                      <div className="col-4 col-md-4 col-lg-4 text-center filters-toolbar__item filters-toolbar__item--count d-flex justify-content-center align-items-center">
                        <span className="filters-toolbar__product-count">Showing: {products.length} products</span>
                      </div>
                      <div className="col-4 col-md-4 col-lg-4 text-right">
                        {/* Removed search-box from here */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-products grid--view-items">
                  <div className="row">
                    {Array.isArray(products) && products.map((product, index) => (
                      <div className="col-6 col-sm-6 col-md-4 col-lg-3 item" key={index}>
                        <div className="product-image">
                          <RouterLink to={`/shop/chi-tiet/${product.productId}`}>
                            <img
                              className=""
                              src={product.pictures ? product.pictures : '/assets/images/no-image.jpg'}
                              alt="image"
                              title="product"
                            />
                            <div className="product-labels rectangular">
                              <span className="lbl on-sale">-16%</span>
                              <span className="lbl pr-label1">new</span>
                            </div>

                            {/* Countdown start - desktop */}
                            <div className="saleTime desktop" data-countdown="2022/03/01">
                              <span className="ht-count days"><span className="count-inner"></span></span>
                              <span className="ht-count hour"><span className="count-inner"></span></span>
                              <span className="ht-count minutes"><span className="count-inner"></span></span>
                              <span className="ht-count second"><span className="count-inner"></span></span>
                            </div>
                            {/* Countdown end - desktop */}
                          </RouterLink>

                          <div className="button-set">
                            <a href="#" title="Quick View"
                              className="quick-view-popup quick-view" data-toggle="modal"
                              data-target="#content_quickview">
                              <i className="icon anm anm-search-plus-r"></i>
                            </a>
                            <div className="wishlist-btn">
                              <a className="wishlist add-to-wishlist" href="#"
                                title="Add to Wishlist">
                                <i className="icon anm anm-heart-l"></i>
                              </a>
                            </div>
                            <div className="compare-btn">
                              <a className="compare add-to-compare" href="compare.html"
                                title="Add to Compare">
                                <i className="icon anm anm-random-r"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="product-details text-center">
                          <div className="product-name">
                            <a href="#">{product.productName}</a>
                          </div>
                          <div className="product-price">
                            {product.priceOld && (
                              <span className="old-price">{parseFloat(product.priceOld).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            )}
                            <span className="price">{parseFloat(product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                          </div>
                          <div className="product-review">
                            <i className="font-13 fa fa-star"></i>
                            <i className="font-13 fa fa-star"></i>
                            <i className="font-13 fa fa-star"></i>
                            <i className="font-13 fa fa-star-o"></i>
                            <i className="font-13 fa fa-star-o"></i>
                          </div>
                        </div>
                        {/* Countdown start - mobile */}
                        <div className="timermobile">
                          <div className="saleTime desktop" data-countdown="2022/03/01">
                            <span className="ht-count days"><span className="count-inner"></span></span>
                            <span className="ht-count hour"><span className="count-inner"></span></span>
                            <span className="ht-count minutes"><span className="count-inner"></span></span>
                            <span className="ht-count second"><span className="count-inner"></span></span>
                          </div>
                        </div>
                        {/* Countdown end - mobile */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Top */}
      <span id="site-scroll"><i className="icon anm anm-angle-up-r"></i></span>
      {/* End Scroll Top */}

      {/* Quick View popup */}
      <div className="modal fade quick-view-popup" id="content_quickview">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div id="ProductSection-product-template"
                className="product-template__container prstyle1">
                <div className="product-single">
                  {/* Start model close */}
                  <a href="#" data-dismiss="modal"
                    className="model-close-btn pull-right" title="close"><span
                      className="icon icon anm anm-times-l"></span></a>
                  {/* End model close */}
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="product-details-img">
                        <div className="pl-20">
                          <img
                            src="/assets/images/product-detail-page/camelia-reversible-big1.jpg"
                            alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="product-single__meta">
                        <h2 className="product-single__title">Product Quick View
                          Popup</h2>
                        <div className="prInfoRow">
                          <div className="product-stock">
                            <span className="instock ">In Stock</span> <span
                              className="outstock hide">Unavailable</span>
                          </div>
                          <div className="product-sku">
                            SKU: <span className="variant-sku">19115-rdxs</span>
                          </div>
                        </div>
                        <p
                          className="product-single__price product-single__price-product-template">
                          <span className="visually-hidden">Regular price</span> <s
                            id="ComparePrice-product-template"><span className="money">$600.00</span></s>
                          <span
                            className="product-price__price product-price__price-product-template product-price__sale product-price__sale--single">
                            <span id="ProductPrice-product-template"><span
                              className="money">$500.00</span></span>
                          </span>
                        </p>
                        <div className="product-single__description rte">Belle
                          Multipurpose Bootstrap 4 Html Template that will give you
                          and your customers a smooth shopping experience which can
                          be used for various kinds of stores such as fashion,...</div>

                        <form method="post" action="http://annimexweb.com/cart/add"
                          id="product_form_10508262282" acceptCharset="UTF-8"
                          className="product-form product-form-product-template hidedropdown"
                          encType="multipart/form-data">
                          <div className="swatch clearfix swatch-0 option1"
                            data-option-index="0">
                            <div className="product-form__item">
                              <label className="header">Color: <span
                                className="slVariant">Red</span></label>
                              <div data-value="Red"
                                className="swatch-element color red available">
                                <input className="swatchInput" id="swatch-0-red"
                                  type="radio" name="option-0" value="Red" /> <label
                                  className="swatchLbl color medium rectangle"
                                  htmlFor="swatch-0-red"
                                  style={{ backgroundImage: 'url(/assets/images/product-detail-page/variant1-1.jpg)' }}
                                  title="Red"></label>
                              </div>
                              <div data-value="Blue"
                                className="swatch-element color blue available">
                                <input className="swatchInput" id="swatch-0-blue"
                                  type="radio" name="option-0" value="Blue" /> <label
                                  className="swatchLbl color medium rectangle"
                                  htmlFor="swatch-0-blue"
                                  style={{ backgroundImage: 'url(/assets/images/product-detail-page/variant1-2.jpg)' }}
                                  title="Blue"></label>
                              </div>
                              <div data-value="Green"
                                className="swatch-element color green available">
                                <input className="swatchInput" id="swatch-0-green"
                                  type="radio" name="option-0" value="Green" /> <label
                                  className="swatchLbl color medium rectangle"
                                  htmlFor="swatch-0-green"
                                  style={{ backgroundImage: 'url(/assets/images/product-detail-page/variant1-3.jpg)' }}
                                  title="Green"></label>
                              </div>
                              <div data-value="Gray"
                                className="swatch-element color gray available">
                                <input className="swatchInput" id="swatch-0-gray"
                                  type="radio" name="option-0" value="Gray" /> <label
                                  className="swatchLbl color medium rectangle"
                                  htmlFor="swatch-0-gray"
                                  style={{ backgroundImage: 'url(/assets/images/product-detail-page/variant1-4.jpg)' }}
                                  title="Gray"></label>
                              </div>
                            </div>
                          </div>
                          <div className="swatch clearfix swatch-1 option2"
                            data-option-index="1">
                            <div className="product-form__item">
                              <label className="header">Size: <span
                                className="slVariant">XS</span></label>
                              <div data-value="XS" className="swatch-element xs available">
                                <input className="swatchInput" id="swatch-1-xs" type="radio"
                                  name="option-1" value="XS" /> <label
                                  className="swatchLbl medium rectangle" htmlFor="swatch-1-xs"
                                  title="XS">XS</label>
                              </div>
                              <div data-value="S" className="swatch-element s available">
                                <input className="swatchInput" id="swatch-1-s" type="radio"
                                  name="option-1" value="S" /> <label
                                  className="swatchLbl medium rectangle" htmlFor="swatch-1-s"
                                  title="S">S</label>
                              </div>
                              <div data-value="M" className="swatch-element m available">
                                <input className="swatchInput" id="swatch-1-m" type="radio"
                                  name="option-1" value="M" /> <label
                                  className="swatchLbl medium rectangle" htmlFor="swatch-1-m"
                                  title="M">M</label>
                              </div>
                              <div data-value="L" className="swatch-element l available">
                                <input className="swatchInput" id="swatch-1-l" type="radio"
                                  name="option-1" value="L" /> <label
                                  className="swatchLbl medium rectangle" htmlFor="swatch-1-l"
                                  title="L">L</label>
                              </div>
                            </div>
                          </div>
                          {/* Product Action */}
                          <div className="product-action clearfix">
                            <div className="product-form__item--quantity">
                              <div className="wrapQtyBtn">
                                <div className="qtyField">
                                  <a className="qtyBtn minus" href="#"><i
                                    className="fa anm anm-minus-r" aria-hidden="true"></i></a> <input
                                    type="text" id="Quantity" name="quantity" defaultValue="1"
                                    className="product-form__input qty" /> <a
                                    className="qtyBtn plus" href="#"><i
                                    className="fa anm anm-plus-r" aria-hidden="true"></i></a>
                                </div>
                              </div>
                            </div>
                            <div className="product-form__item--submit">
                              <button type="button" name="add"
                                className="btn product-form__cart-submit">
                                <span>Add to cart</span>
                              </button>
                            </div>
                          </div>
                          {/* End Product Action */}
                        </form>
                        <div className="display-table shareRow">
                          <div className="display-table-cell">
                            <div className="wishlist-btn">
                              <a className="wishlist add-to-wishlist" href="#"
                                title="Add to Wishlist"><i
                                className="icon anm anm-heart-l" aria-hidden="true"></i> <span>Add
                                to Wishlist</span></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End-product-single */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Quick View popup */}
    </div>
  );
};

export default Shop; 