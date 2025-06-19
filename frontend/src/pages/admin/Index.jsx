import React from 'react';
import Navbar from '../../components/layout/admin/Navbar';
import Sidebar from '../../components/layout/admin/Sidebar';
import useAdminAssets from '../../hooks/useAdminAssets';

const Index = () => {
  useAdminAssets();
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>chào mừng bạn đến với trang Admin</h1>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;