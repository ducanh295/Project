import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Navbar from '../../../components/layout/admin/Navbar';
import Sidebar from '../../../components/layout/admin/Sidebar';
import useAdminAssets from '../../../hooks/useAdminAssets';

const Detail = () => {
  useAdminAssets();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/admin/categories/${id}`)
      .then(res => { setCategory(res.data); setError(''); })
      .catch(() => setError('Không tìm thấy danh mục!'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async (catId, catName, isParent) => {
    const confirmMsg = isParent
      ? `Bạn chắc chắn muốn xóa danh mục cha [${catName}] và TẤT CẢ danh mục con không?`
      : `Bạn chắc chắn muốn xóa danh mục [${catName}] không?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await api.delete(`/api/admin/categories/${catId}`);
      navigate('/admin/categories');
    } catch (err) {
      alert('Xóa thất bại!');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!category) return null;

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container mt-4">
          <div className="row mb-2">
            <div className="col-sm-6"><h2>CHI TIẾT DANH MỤC</h2></div>
            <div className="col-sm-6 text-right"><Link to="/admin/categories" className="btn btn-secondary">Quay lại Danh sách</Link></div>
          </div>
          <div className="card card-primary card-outline">
            <div className="card-header"><h3 className="card-title">{category.categoryName}</h3></div>
            <div className="card-body">
              <dl className="row">
                <dt className="col-sm-4">Mã số</dt>
                <dd className="col-sm-8">{category.categoryId}</dd>
                <dt className="col-sm-4">Tên Danh Mục</dt>
                <dd className="col-sm-8">{category.categoryName}</dd>
                <dt className="col-sm-4">Trạng thái</dt>
                <dd className="col-sm-8">{category.status ? 'Còn hàng' : 'Hết hàng'}</dd>
                {category.parent && (
                  <>
                    <dt className="col-sm-4">Thuộc Danh mục cha</dt>
                    <dd className="col-sm-8">
                      <Link to={`/admin/categories/detail/${category.parent.categoryId}`}>{category.parent.categoryName}</Link>
                    </dd>
                  </>
                )}
              </dl>
              {/* Danh sách con nếu là cha */}
              {(!category.parent && category.subcategories && category.subcategories.length > 0) && (
                <>
                  <hr />
                  <h4>Danh mục con trực thuộc</h4>
                  <table className="table table-sm table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên Con</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.subcategories.map(sub => (
                        <tr key={sub.categoryId}>
                          <td>{sub.categoryId}</td>
                          <td>{sub.categoryName}</td>
                          <td>{sub.status ? 'Còn hàng' : 'Hết hàng'}</td>
                          <td>
                            <Link to={`/admin/categories/detail/${sub.categoryId}`} className="btn btn-xs btn-success mx-1">Chi tiết</Link>
                            <Link to={`/admin/categories/edit/${sub.categoryId}`} className="btn btn-xs btn-info mx-1">Sửa</Link>
                            <button className="btn btn-xs btn-danger mx-1" onClick={() => handleDelete(sub.categoryId, sub.categoryName, false)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {(!category.parent && (!category.subcategories || category.subcategories.length === 0)) && (
                <>
                  <hr />
                  <p><em>Danh mục này không có danh mục con.</em></p>
                </>
              )}
            </div>
            <div className="card-footer">
              <Link to="/admin/categories" className="btn btn-secondary">Quay lại</Link>
              {category.parent && (
                <Link to={`/admin/categories/edit/${category.categoryId}`} className="btn btn-info mx-2">Sửa Danh mục này</Link>
              )}
              {/* Nút xóa */}
              {!category.parent && (
                <button className="btn btn-danger float-right" onClick={() => handleDelete(category.categoryId, category.categoryName, true)}>Xóa Danh mục cha & Con</button>
              )}
              {category.parent && (
                <button className="btn btn-danger float-right" onClick={() => handleDelete(category.categoryId, category.categoryName, false)}>Xóa Danh mục này</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail; 