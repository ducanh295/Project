import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Navbar from '../../../components/layout/admin/Navbar';
import Sidebar from '../../../components/layout/admin/Sidebar';
import useAdminAssets from '../../../hooks/useAdminAssets';

const List = () => {
  useAdminAssets();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/categories');
      setCategories(res.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách danh mục.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name, isParent) => {
    const confirmMsg = isParent
      ? `Bạn có chắc muốn xóa danh mục cha [${name}] và TẤT CẢ danh mục con không?`
      : `Bạn có chắc muốn xóa danh mục [${name}] không?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await api.delete(`/api/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Xóa thất bại!');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  // Lọc danh mục cha
  const parentCategories = categories.filter(c => !c.parent);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container-fluid mt-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="mt-2">DANH SÁCH DANH MỤC</h2>
              <Link to="/admin/categories/create" className="btn btn-primary">Thêm mới Danh mục con</Link>
            </div>
            <div className="card-body">
              <table className="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th>Mã số</th>
                    <th>Tên danh mục</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {parentCategories.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">Không có danh mục gốc nào để hiển thị.</td>
                    </tr>
                  )}
                  {parentCategories.map(parent => (
                    <React.Fragment key={parent.categoryId}>
                      <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <td>{parent.categoryId}</td>
                        <td style={{ fontWeight: 'bold' }}>{parent.categoryName}</td>
                        <td>{parent.status ? 'Còn hàng' : 'Hết hàng'}</td>
                        <td>
                          <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(parent.categoryId, parent.categoryName, true)}>Xóa</button>
                          <Link to={`/admin/categories/detail/${parent.categoryId}`} className="btn btn-success btn-sm mx-1">Chi tiết</Link>
                        </td>
                      </tr>
                      {(parent.subcategories || []).map(child => (
                        <tr key={child.categoryId}>
                          <td>{child.categoryId}</td>
                          <td><span style={{ paddingLeft: 25 }}>{child.categoryName}</span></td>
                          <td>{child.status ? 'Còn hàng' : 'Hết hàng'}</td>
                          <td>
                            <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(child.categoryId, child.categoryName, false)}>Xóa</button>
                            <Link to={`/admin/categories/edit/${child.categoryId}`} className="btn btn-info btn-sm mx-1">Sửa</Link>
                            <Link to={`/admin/categories/detail/${child.categoryId}`} className="btn btn-success btn-sm mx-1">Chi tiết</Link>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List; 