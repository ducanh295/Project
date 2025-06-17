import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';

const MainLayout = ({ children, showBanner = false }) => {
  return (
    <div className="main-wrapper">
      <div className="header_nav">
        <Header />
        {showBanner && <Banner />}
      </div>
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 