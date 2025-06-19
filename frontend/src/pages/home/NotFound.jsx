import React from 'react';

const NotFound = () => {
  return (
    <div className="container">
      
      <h1 style={{ textAlign: 'center' }}>
        TRANG NÀY KHÔNG TỒN TẠI HOẶC BẠN KHÔNG CÓ QUYỀN TRUY CẬP! 
        <a style={{ textAlign: 'center', color : 'blue' }} href="#" onClick={() => window.history.back()}>
          QUAY LẠI
        </a>
      </h1>
    </div>
  );
};

export default NotFound; 