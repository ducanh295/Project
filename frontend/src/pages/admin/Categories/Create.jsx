import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';
import Navbar from '../../../components/layout/admin/Navbar';
import Sidebar from '../../../components/layout/admin/Sidebar';
import useAdminAssets from '../../../hooks/useAdminAssets';

const Create = () => {
  useAdminAssets();
  const [categoryName, setCategoryName] = useState('');
  const [parentId, setParentId] = useState('');
  const [status, setStatus] = useState(true);
  const [parents, setParents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/admin/categories').then(res => {
      setParents(res.data.filter(c => !c.parent));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!parentId || !categoryName.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      const data = {
        categoryName,
        status
      };
      if (parentId) data.parentId = parentId;
      console.log('POST /api/admin/categories', data);
      await api.post('/api/admin/categories', data);
      navigate('/admin/categories');
    } catch (err) {
      setError('Thêm danh mục thất bại!');
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <div className="container mt-4">
          <div className="row mb-2">
            <div className="col-sm-6"><h2>THÊM MỚI DANH MỤC CON</h2></div>
            <div className="col-sm-6 text-right"><Link to="/admin/categories" className="btn btn-secondary">Quay lại Danh sách</Link></div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="card card-primary">
            <div className="card-header"><h3 className="card-title">Nhập thông tin danh mục con</h3></div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="form-group">
                  <label>Danh mục cha <span className="text-danger">*</span></label>
                  <select className="form-control" value={parentId} onChange={e => setParentId(e.target.value)} required>
                    <option value="">--- Chọn danh mục cha ---</option>
                    {parents.map(p => <option key={p.categoryId} value={p.categoryId}>{p.categoryName}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tên Danh mục con <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" value={categoryName} onChange={e => setCategoryName(e.target.value)} required placeholder="Nhập tên danh mục con" />
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" id="statusTrue" value={true} checked={status === true} onChange={() => setStatus(true)} />
                    <label className="form-check-label" htmlFor="statusTrue">Còn hàng</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" id="statusFalse" value={false} checked={status === false} onChange={() => setStatus(false)} />
                    <label className="form-check-label" htmlFor="statusFalse">Hết hàng</label>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-primary">Thêm mới</button>
                <Link to="/admin/categories" className="btn btn-secondary ml-2">Hủy</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create; 