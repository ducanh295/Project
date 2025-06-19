import React, { useState } from 'react';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});

  const handleToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <a href="/admin" className="brand-link">
        <span className="brand-text font-weight-light">Car Store</span>
      </a>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src="/assets/dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User" />
          </div>
          <div className="info">
            {/* TODO: Lấy tên user từ API */}
            <a href="#" className="d-block">Admin User</a>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column">
          <li className="nav-item">
            <div className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleToggle('product')}>
              <i className="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Quản lý sản phẩm
                <i className={`right fas fa-angle-left${openMenus.product ? ' rotate-90' : ''}`}></i>
              </p>
            </div>
            {openMenus.product && (
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/admin/products" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>danh sách sản phẩm</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Thêm sản phẩm</p>
                  </a>
                </li>
              </ul>
              )}
            </li>
            <hr />
            {/* Quản lý Danh mục */}
            <li className="nav-item">
              <div className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleToggle('category')}>
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  Quản lý danh mục
                  <i className={`right fas fa-angle-left${openMenus.category ? ' rotate-90' : ''}`}></i>
                </p>
              </div>
              {openMenus.category && (
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="/admin/categories" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>danh sách danh mục</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Thêm danh mục</p>
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <hr />
            {/* Quản lý danh sách tài khoản */}
            <li className="nav-item">
              <div className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleToggle('account')}>
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  Quản lý danh sách tài khoản người dùng
                  <i className={`right fas fa-angle-left${openMenus.account ? ' rotate-90' : ''}`}></i>
                </p>
              </div>
              {openMenus.account && (
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="/admin/accUser" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>danh sách tài khoản</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Thêm tài khoản</p>
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 