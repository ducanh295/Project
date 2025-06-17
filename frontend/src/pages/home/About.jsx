import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const About = () => {
  return (
    <div>
      <div className="collection-header">
        <div className="collection-hero">
        </div>
      </div>

      <div id="page-content">
        <div className="page section-header text-center">
          <div className="page-title">
            <div className="wrapper"><h1 className="page-width">About Us</h1></div>
          </div>
        </div>

        <div className="bredcrumbWrap">
          <div className="container breadcrumbs">
            <RouterLink to="/" title="Back to the home page">Home</RouterLink><span aria-hidden="true">›</span><span>About Us</span>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 main-col">
              <div className="text-center mb-4">
                <h2 className="h2">Belle Multipurpose Bootstrap 4 Html Template</h2>
                <div className="rte-setting">
                  <p><strong>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</strong></p>
                  <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-4 col-md-4 col-lg-4 mb-4"><img className="blur-up lazyload" src="/assets/images/about1.jpg" alt="About Us" /></div>
            <div className="col-12 col-sm-4 col-md-4 col-lg-4 mb-4"><img className="blur-up lazyload" src="/assets/images/about2.jpg" alt="About Us" /></div>
            <div className="col-12 col-sm-4 col-md-4 col-lg-4 mb-4"><img className="blur-up lazyload" src="/assets/images/about3.jpg" alt="About Us" /></div>
          </div>
          <div className="row">
            <div className="col-12">
              <h2>Sed ut perspiciatis unde omnis iste natus error</h2>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain.</p>
              <p>simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted.</p>
              <p></p>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-4">
              <h2 className="h2">About Annimex Web</h2>
              <div className="rte-setting"><p><strong>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</strong></p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                <p></p>
                <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p></div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <h2 className="h2">Contact Us</h2>
              <ul className="addressFooter">
                <li><i className="icon anm anm-map-marker-al"></i><p>55 Gallaxy Enque, 2568 steet, 23568 NY</p></li>
                <li className="phone"><i className="icon anm anm-phone-s"></i><p>(440) 000 000 0000</p></li>
                <li className="email"><i className="icon anm anm-envelope-l"></i><p>sales@yousite.com</p></li>
              </ul>
              <hr />
              <ul className="list--inline site-footer__social-icons social-icons">
                <li><a className="social-icons__link" href="#" target="_blank" title="Belle Multipurpose Bootstrap 4 Template on Facebook"><i className="icon icon-facebook"></i></a></li>
                <li><a className="social-icons__link" href="#" target="_blank" title="Belle Multipurpose Bootstrap 4 Template on Twitter"><i className="icon icon-twitter"></i> <span className="icon__fallback-text">Twitter</span></a></li>
                <li><a className="social-icons__link" href="#" target="_blank" title="Belle Multipurpose Bootstrap 4 Template on Pinterest"><i className="icon icon-pinterest"></i> <span className="icon__fallback-text">Pinterest</span></a></li>
                <li><a className="social-icons__link" href="#" target="_blank" title="Belle Multipurpose Bootstrap 4 Template on Instagram"><i className="icon icon-instagram"></i> <span className="icon__fallback-text">Instagram</span></a></li>
                <li><a className="social-icons__link" href="#" target="_blank" title="Belle Multipurpose Bootstrap 4 Template on Tumblr"><i className="icon icon-tumblr-alt"></i> <span className="icon__fallback-text">Tumblr</span></a></li>
                <li><a className="social-icons__link" href="#" target="_blank" title="Belle Multipurpose Bootstrap 4 Template on YouTube"><i className="icon icon-youtube"></i> <span className="icon__fallback-text">YouTube</span></a></li>
                <li><a className="social-icons__link" href="#" target="_blank" title="Belle Multipurpose Bootstrap 4 Template on Vimeo"><i className="icon icon-vimeo-alt"></i> <span className="icon__fallback-text">Vimeo</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 