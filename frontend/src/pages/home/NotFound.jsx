import React from 'react';

const NotFound = () => {
  return (
    <div className="container">
      <img style={{ margin: 'auto', width: '50%', display: 'block' }}  alt="403 Forbidden Access" />
      <h4 style={{ textAlign: 'center' }}>
        TRANG NÀY KHÔNG TỒN TẠI HOẶC BẠN KHÔNG CÓ QUYỀN TRUY CẬP! 
        <a style={{ textAlign: 'center' }} href="#" onClick={() => window.history.back()}>
          QUAY LẠI
        </a>
      </h4>
    </div>
  );
};

export default NotFound; 