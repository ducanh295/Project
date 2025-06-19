import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="footer-logo">
                  <img src="/assets/images/logo.png" alt="Car Store" />
                </div>
                <div className="footer-about">
                  <p>Car Store is your trusted partner for all your car rental needs. We provide quality service and the best cars at competitive prices.</p>
                </div>
                <div className="footer-contact">
                  <p><i className="ri-map-pin-line"></i> 123 Street, City, Country</p>
                  <p><i className="ri-phone-line"></i> +84 123 456 789</p>
                  <p><i className="ri-mail-line"></i> info@carstore.com</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-title">Quick Links</h4>
                <ul className="footer-links">
                  <li><a href="/">Home</a></li>
                  <li><a href="/cars">Cars</a></li>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/services">Services</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-title">Our Services</h4>
                <ul className="footer-links">
                  <li><a href="/services/car-rental">Car Rental</a></li>
                  <li><a href="/services/car-maintenance">Car Maintenance</a></li>
                  <li><a href="/services/car-insurance">Car Insurance</a></li>
                  <li><a href="/services/car-parts">Car Parts</a></li>
                  <li><a href="/services/car-wash">Car Wash</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h4 className="footer-title">Newsletter</h4>
                <div className="footer-newsletter">
                  <p>Subscribe to our newsletter to get latest updates</p>
                  <form action="#">
                    <input type="email" placeholder="Enter your email" />
                    <button type="submit">Subscribe</button>
                  </form>
                </div>
                <div className="footer-social">
                  <a href="#"><i className="ri-facebook-fill"></i></a>
                  <a href="#"><i className="ri-twitter-fill"></i></a>
                  <a href="#"><i className="ri-instagram-fill"></i></a>
                  <a href="#"><i className="ri-linkedin-fill"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="copyright">
                <p>&copy; 2024 Car Store. All Rights Reserved.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="footer-bottom-links">
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-conditions">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 