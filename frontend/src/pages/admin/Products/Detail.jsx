import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../services/api';
import Navbar from '../../../components/layout/admin/Navbar';
import Sidebar from '../../../components/layout/admin/Sidebar';
import useAdminAssets from '../../../hooks/useAdminAssets';

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useAdminAssets();

  useEffect(() => {
    api.get(`/api/admin/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setError(null);
      })
      .catch(() => setError('Không tìm thấy sản phẩm!'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return null;

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container-fuild m-4 d-flex justify-content-center">
          <div className="card shadow rounded w-100" >
            <h2 className="card-title text-center mb-4" style={{fontWeight: 'bolder', fontSize: '22px'}}>Chi tiết sản phẩm</h2>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-5 text-center mb-4 mb-md-0">
                  {product.pictures && (
                    <img src={product.pictures} alt={product.productName} style={{maxWidth: 500, maxHeight: 500, borderRadius: 12, border: '2px solid #eee', boxShadow: '0 2px 8px #ccc'}} />
                  )}
                </div>
                <div className="col-md-7">
                  <div className="mb-3"><strong>Mã sản phẩm:</strong> {product.productId}</div>
                  <div className="mb-3"><strong>Tên sản phẩm:</strong> {product.productName}</div>
                  <div className="mb-3"><strong>Giá cũ:</strong> <span className="text-decoration-line-through text-danger">{product.priceOld?.toLocaleString()}</span></div>
                  <div className="mb-3"><strong>Giá mới:</strong> <span className="fw-bold text-success">{product.price?.toLocaleString()}</span></div>
                  <div className="mb-3"><strong>Màu sắc:</strong> {product.colors}</div>
                  <div className="mb-3"><strong>Kích cỡ:</strong> {product.sizes}</div>
                  <div className="mb-3"><strong>Mô tả ngắn:</strong> {product.brief}</div>
                  <div className="mb-3"><strong>Mô tả chi tiết:</strong> {product.description}</div>
                  <div className="mb-3"><strong>Danh mục:</strong> {product.category?.categoryName}</div>
                  <div className="mb-3"><strong>Trạng thái:</strong> {product.status ? 'Hiện' : 'Ẩn'}</div>
                  <div className="d-flex justify-content-center justify-content-md-start mt-4">
                    <Link to="/admin/products" className="btn btn-secondary mx-2">Quay lại</Link>
                    <Link to={`/admin/products/edit/${product.productId}`} className="btn btn-warning mx-2">Sửa</Link>
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