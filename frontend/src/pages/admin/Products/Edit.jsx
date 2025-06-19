import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Navbar from '../../../components/layout/admin/Navbar';
import Sidebar from '../../../components/layout/admin/Sidebar';
import useAdminAssets from '../../../hooks/useAdminAssets';
import Select from 'react-select';

const Edit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useAdminAssets();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load sản phẩm trước
        const productRes = await api.get(`/api/admin/products/${id}`);
        const productData = productRes.data;
        console.log('Loaded product:', productData);
        setProduct(productData);

        // Load danh mục sau
        const categoriesRes = await api.get('/api/admin/categories');
        const categoriesData = categoriesRes.data;
        console.log('Loaded categories:', categoriesData);
        setCategories(categoriesData);

        // Tạo danh sách options cho react-select
        const allOptions = categoriesData.flatMap(parent =>
          parent.subcategories && parent.subcategories.length > 0
            ? parent.subcategories.map(child => ({
              value: child.categoryId,
              label: child.categoryName
            }))
            : [{
              value: parent.categoryId,
              label: parent.categoryName
            }]
        );

        console.log('All category options:', allOptions);
        console.log('Product categoryId:', productData.categoryId);

        // Tìm option tương ứng với categoryId của sản phẩm
        const selectedOption = allOptions.find(opt =>
          Number(opt.value) === Number(productData.categoryId)
        );
        console.log('Found selected option:', selectedOption);

        if (selectedOption) {
          setSelectedCategory(selectedOption);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Không thể tải dữ liệu sản phẩm!');
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setError('Vui lòng chọn danh mục!');
      return;
    }

    try {
      // Tạo object dữ liệu trước
      const productData = new FormData();
      productData.append('productId', product.productId);
      productData.append('productName', product.productName);
      productData.append('priceOld', product.priceOld);
      productData.append('price', product.price);
      productData.append('colors', product.colors || '');
      productData.append('sizes', product.sizes || '');
      productData.append('brief', product.brief || '');
      productData.append('description', product.description || '');
      productData.append('categoryId', selectedCategory.value);
      productData.append('status', product.status);
      if (file) {
        productData.append('file', file);
      }
      // Log để debug
      for (let pair of productData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }
      const response = await api.put(`/api/admin/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/admin/products');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Cập nhật sản phẩm thất bại! ${errorMessage}`);
    }
  };

  const handleCategoryChange = (option) => {
    console.log('Selected category change:', option);
    setSelectedCategory(option);
    if (option) {
      setProduct(prev => ({
        ...prev,
        categoryId: option.value
      }));
    }
  };

  if (!product || !categories.length) return <div>Đang tải...</div>;

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container-fuild mt-4 d-flex justify-content-center">
          <div className="card shadow rounded w-100" >
          <h2 className="card-title text-center m-4" style={{fontWeight: 'bolder', fontSize: '20px' }}>Sửa sản phẩm</h2>

            <div className="card-body">
              {error && <div className="alert alert-danger text-center">{error}</div>}
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mã sản phẩm</label>
                    <input type="text" className="form-control" name="productId" value={product.productId} disabled />
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
                    <input type="text" className="form-control" name="colors" value={product.colors || ''} onChange={handleChange} placeholder="VD: Đen,Trắng,Đỏ" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Kích cỡ</label>
                    <input type="text" className="form-control" name="sizes" value={product.sizes || ''} onChange={handleChange} placeholder="VD: S,M,L" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả ngắn</label>
                  <textarea className="form-control" name="brief" value={product.brief || ''} onChange={handleChange} rows={2} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả chi tiết</label>
                  <textarea className="form-control" name="description" value={product.description || ''} onChange={handleChange} rows={4} />
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
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder="-- Chọn danh mục --"
                    isClearable
                    required
                    classNamePrefix="select"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ảnh sản phẩm</label>
                  <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                  {(file || product.pictures) && (
                    <div className="mt-2 text-center">
                      <img src={file ? URL.createObjectURL(file) : product.pictures} alt="Ảnh sản phẩm" style={{maxWidth: 180, maxHeight: 180, borderRadius: 8, border: '1px solid #eee'}} />
                    </div>
                  )}
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" name="status" checked={product.status} onChange={handleChange} id="statusCheck" />
                  <label className="form-check-label" htmlFor="statusCheck">Hiện</label>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-success px-4">Cập nhật</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit; 