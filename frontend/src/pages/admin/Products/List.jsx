import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Navbar from '../../../components/layout/admin/Navbar';
import Sidebar from '../../../components/layout/admin/Sidebar';
import useAdminAssets from '../../../hooks/useAdminAssets';

const PAGE_SIZE = 5;

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useAdminAssets();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/products');
      setProducts(res.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productid) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await api.delete(`/api/admin/products/${productid}`);
      fetchProducts();
    } catch (err) {
      alert('Xóa thất bại!');
    }
  };

  // Filter logic
  const filteredProducts = products.filter(p => {
    const matchName = p.productName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" ? true : (statusFilter === "active" ? p.status : !p.status);
    return matchName && matchStatus;
  });
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container-fuild m-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Danh sách sản phẩm</h2>
            <Link to="/admin/products/create" className="btn btn-primary">Thêm sản phẩm</Link>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="col-md-3 mb-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hiện</option>
                <option value="inactive">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center shadow-sm">
              <thead className="table-light">
                <tr>
                  
                  <th>#</th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá cũ</th>
                  <th>Giá mới</th>
                  <th>Màu sắc</th>
                  <th>Kích cỡ</th>
                  <th>Ảnh</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((p, idx) => (
                  <tr key={p.productId}>
                    
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>{p.productId}</td>
                    <td>{p.productName}</td>
                    <td>{p.priceOld?.toLocaleString()}</td>
                    <td>{p.price?.toLocaleString()}</td>
                    <td>{p.colors}</td>
                    <td>{p.sizes}</td>
                    <td>
                      {p.pictures && (
                        <img src={p.pictures} alt={p.productName} style={{maxWidth: 60, maxHeight: 60, borderRadius: 8, border: '1px solid #eee'}} />
                      )}
                    </td>
                    <td>{p.category?.categoryName}</td>
                    <td>{p.status ? 'Hiện' : 'Ẩn'}</td>
                    <td>
                      <Link to={`/admin/products/${p.productId}`} className="btn btn-info btn-sm mx-1">Xem</Link>
                      <Link to={`/admin/products/edit/${p.productId}`} className="btn btn-warning btn-sm mx-1">Sửa</Link>
                      <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(p.productId)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default List; 