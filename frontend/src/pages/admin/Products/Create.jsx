import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Navbar from '../../../components/layout/admin/Navbar';
import Sidebar from '../../../components/layout/admin/Sidebar';
import useAdminAssets from '../../../hooks/useAdminAssets';
import Select from 'react-select';

const Create = () => {
  const [product, setProduct] = useState({ productId: '', productName: '', priceOld: '', price: '', colors: '', sizes: '', brief: '', description: '', categoryId: '', status: true });
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useAdminAssets();

  useEffect(() => {
    api.get('/api/admin/categories').then(res => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.categoryId) {
      setError('Vui lòng chọn danh mục  !');
      return;
    }
    const formData = new FormData();
    const productToSend = {
      ...product,
      categoryId: Number(product.categoryId)
    };
    Object.entries(productToSend).forEach(([k, v]) => {
      if (v !== null && v !== undefined) {
        formData.append(k, v);
      }
    });
    if (file) formData.append('file', file);

    try {
      await api.post('/api/admin/products', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin/products');
    } catch (err) {
      setError('Thêm sản phẩm thất bại!');
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container mt-4 d-flex justify-content-center">
          <div className="card shadow rounded w-100" style={{maxWidth: 600}}>
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Thêm sản phẩm</h2>
              {error && <div className="alert alert-danger text-center">{error}</div>}
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mã sản phẩm</label>
                    <input type="text" className="form-control" name="productId" value={product.productId} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tên sản phẩm</label>
                    <input type="text" className="form-control" name="productName" value={product.productName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Giá cũ</label>
                    <input type="number" className="form-control" name="priceOld" value={product.priceOld} onChange={handleChange} required min={1} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Giá mới</label>
                    <input type="number" className="form-control" name="price" value={product.price} onChange={handleChange} required min={1} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Màu sắc</label>
                    <input type="text" className="form-control" name="colors" value={product.colors} onChange={handleChange} placeholder="VD: Đen,Trắng,Đỏ" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Kích cỡ</label>
                    <input type="text" className="form-control" name="sizes" value={product.sizes} onChange={handleChange} placeholder="VD: S,M,L" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả ngắn</label>
                  <textarea className="form-control" name="brief" value={product.brief} onChange={handleChange} rows={2} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả chi tiết</label>
                  <textarea className="form-control" name="description" value={product.description} onChange={handleChange} rows={4} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Danh mục</label>
                  <Select
                    options={categories.map(parent => ({
                      label: parent.categoryName,
                      options: parent.subcategories && parent.subcategories.length > 0 
                        ? parent.subcategories.map(child => ({
                            value: child.categoryId,
                            label: child.categoryName
                          }))
                        : [{
                            value: parent.categoryId,
                            label: parent.categoryName
                          }]
                    }))}
                    value={categories.flatMap(parent => 
                      parent.subcategories && parent.subcategories.length > 0
                        ? parent.subcategories.map(child => ({
                            value: child.categoryId,
                            label: child.categoryName
                          }))
                        : [{
                            value: parent.categoryId,
                            label: parent.categoryName
                          }]
                    ).find(opt => opt.value === Number(product.categoryId)) || null}
                    onChange={option => {
                      const categoryId = option ? Number(option.value) : null;
                      setProduct(prev => ({
                        ...prev,
                        categoryId: categoryId
                      }));
                    }}
                    placeholder="-- Chọn danh mục --"
                    isClearable
                    required
                    classNamePrefix="select"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ảnh sản phẩm</label>
                  <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                  {file && (
                    <div className="mt-2 text-center">
                      <img src={URL.createObjectURL(file)} alt="Preview" style={{maxWidth: 180, maxHeight: 180, borderRadius: 8, border: '1px solid #eee'}} />
                    </div>
                  )}
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" name="status" checked={product.status} onChange={handleChange} id="statusCheck" />
                  <label className="form-check-label" htmlFor="statusCheck">Hiện</label>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-success px-4">Thêm mới</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create; 