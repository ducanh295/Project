import React from 'react';
import { useHomeEffects } from '../../hooks/useHomeEffects';

const Home = () => {
  useHomeEffects();

  return (
    <div>
		<section className="section__container range__container" id="about">
      <h2 className="section__header">WIDE RANGE OF VEHICLES</h2>
      <div className="range__grid">
        <div className="range__card">
          <img src="/assets/images/range-1.jpg" alt="range" />
          <div className="range__details">
            <h4>CARS</h4>
            <a href="#"><i className="ri-arrow-right-line"></i></a>
          </div>
        </div>
        <div className="range__card">
          <img src="/assets/images/range-2.jpg" alt="range" />
          <div className="range__details">
            <h4>SUVS</h4>
            <a href="#"><i className="ri-arrow-right-line"></i></a>
          </div>
        </div>
        <div className="range__card">
          <img src="/assets/images/range-3.jpg" alt="range" />
          <div className="range__details">
            <h4>VANS</h4>
            <a href="#"><i className="ri-arrow-right-line"></i></a>
          </div>
        </div>
        <div className="range__card">
          <img src="/assets/images/range-4.jpg" alt="range" />
          <div className="range__details">
            <h4>ELECTRIC</h4>
            <a href="#"><i className="ri-arrow-right-line"></i></a>
          </div>
        </div>
      </div>
    </section>

    <section className="section__container location__container" id="rent">
      <div className="location__image">
        <img src="/assets/images/location.png" alt="location" />
      </div>
      <div className="location__content">
        <h2 className="section__header">FIND CAR IN YOUR LOCATIONS</h2>
        <p>
          Discover the perfect vehicle tailored to your needs, wherever you are.
          Our 'Find Car in Your Locations' feature allows you to effortlessly
          search and select from our premium fleet available near you. Whether
          you're looking for a luxury sedan, a spacious SUV, or a sporty
          convertible, our easy-to-use tool ensures you find the ideal car for
          your journey. Simply enter your location, and let us connect you with
          top-tier vehicles ready for rental.
        </p>
        <div className="location__btn">
          <button className="btn">Find a Location</button>
        </div>
      </div>
    </section>

    <section className="select__container" id="ride">
      <h2 className="section__header">PICK YOUR DREAM CAR TODAY</h2>
      
      <div className="swiper">
       
        <div className="swiper-wrapper">
    
          <div className="swiper-slide">
            <div className="select__card">
              <img src="/assets/images/select-1.png" alt="select" />
              <div className="select__info">
                <div className="select__info__card">
                  <span><i className="ri-speed-up-line"></i></span>
                  <h4>200 <span>km/h</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-settings-5-line"></i></span>
                  <h4>6 <span>speed</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-roadster-line"></i></span>
                  <h4>5 <span>seats</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-signpost-line"></i></span>
                  <h4>15 <span>milage</span></h4>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="select__card">
              <img src="/assets/images/select-2.png" alt="select" />
              <div className="select__info">
                <div className="select__info__card">
                  <span><i className="ri-speed-up-line"></i></span>
                  <h4>215 <span>km/h</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-settings-5-line"></i></span>
                  <h4>6 <span>speed</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-roadster-line"></i></span>
                  <h4>5 <span>seats</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-signpost-line"></i></span>
                  <h4>16 <span>milage</span></h4>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="select__card">
              <img src="/assets/images/select-3.png" alt="select" />
              <div className="select__info">
                <div className="select__info__card">
                  <span><i className="ri-speed-up-line"></i></span>
                  <h4>306 <span>km/h</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-settings-5-line"></i></span>
                  <h4>6 <span>speed</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-roadster-line"></i></span>
                  <h4>5 <span>seats</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-signpost-line"></i></span>
                  <h4>12 <span>milage</span></h4>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="select__card">
              <img src="/assets/images/select-4.png" alt="select" />
              <div className="select__info">
                <div className="select__info__card">
                  <span><i className="ri-speed-up-line"></i></span>
                  <h4>350 <span>km/h</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-settings-5-line"></i></span>
                  <h4>6 <span>speed</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-roadster-line"></i></span>
                  <h4>2 <span>seats</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-signpost-line"></i></span>
                  <h4>08 <span>milage</span></h4>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="select__card">
              <img src="/assets/images/select-5.png" alt="select" />
              <div className="select__info">
                <div className="select__info__card">
                  <span><i className="ri-speed-up-line"></i></span>
                  <h4>254 <span>km/h</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-settings-5-line"></i></span>
                  <h4>6 <span>speed</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-roadster-line"></i></span>
                  <h4>5 <span>seats</span></h4>
                </div>
                <div className="select__info__card">
                  <span><i className="ri-signpost-line"></i></span>
                  <h4>10 <span>milage</span></h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form className="select__form">
        <div className="select__price">
          <span><i className="ri-price-tag-3-line"></i></span>
          <div><span id="select-price">225</span> /day</div>
        </div>
        <div className="select__btns">
          <button className="btn">View Details</button>
          <button className="btn">Rent Now</button>
        </div>
      </form>
    </section>

    <section className="section__container story__container">
      <h2 className="section__header">STORIES BEHIND THE WHEEL</h2>
      <div className="story__grid">
        <div className="story__card">
          <div className="story__date">
            <span>12</span>
            <div>
              <p>January</p>
              <p>2024</p>
            </div>
          </div>
          <h4>Adventures on the Open Road</h4>
          <p>
            Join us as we dive into the exhilarating stories of travelers who
            embarked on unforgettable journeys with PREMIUM CAR RENTAL.
          </p>
          <img src="/assets/images/story-1.jpg" alt="story" />
        </div>
        <div className="story__card">
          <div className="story__date">
            <span>04</span>
            <div>
              <p>March</p>
              <p>2024</p>
            </div>
          </div>
          <h4>Luxury and Comfort: Experiences</h4>
          <p>
            In this series, we highlight the luxurious touches, unparalleled
            comfort, and exceptional service that make every ride.
          </p>
          <img src="/assets/images/story-2.jpg" alt="story" />
        </div>
        <div className="story__card">
          <div className="story__date">
            <span>18</span>
            <div>
              <p>June</p>
              <p>2024</p>
            </div>
          </div>
          <h4>Cars that Adapt to Your Lifestyle</h4>
          <p>
            Read about how our versatile vehicles have seamlessly integrated
            into the lives of professionals and families alike.
          </p>
          <img src="/assets/images/story-3.jpg" alt="story" />
        </div>
      </div>
    </section>

    <section className="banner__container">
      <div className="banner__wrapper">
        <img src="/assets/images/banner-1.png" alt="banner" />
        <img src="/assets/images/banner-2.png" alt="banner" />
        <img src="/assets/images/banner-3.png" alt="banner" />
        <img src="/assets/images/banner-4.png" alt="banner" />
        <img src="/assets/images/banner-5.png" alt="banner" />
        <img src="/assets/images/banner-6.png" alt="banner" />
        <img src="/assets/images/banner-7.png" alt="banner" />
        <img src="/assets/images/banner-8.png" alt="banner" />
        <img src="/assets/images/banner-9.png" alt="banner" />
        <img src="/assets/images/banner-10.png" alt="banner" />
      </div>
    </section>

    <section className="download">
      <div className="section__container download__container">
        <div className="download__content">
          <h2 className="section__header">PREMIUM CAR RENTAL</h2>
          <div className="download__links">
            <a href="#">
              <img src="/assets/images/apple.png" alt="apple" />
            </a>
            <a href="#">
              <img src="/assets/images/google.png" alt="google" />
            </a>
          </div>
        </div>
        <div className="download__image">
          <img src="/assets/images/download.png" alt="download" />
        </div>
      </div>
    </section>

    <section className="news" id="contact">
      <div className="section__container news__container">
        <h2 className="section__header">Stay up to date on all the latest news.</h2>
        <form>
          <input type="text" placeholder="Your email" />
          <button className="btn">
            <i className="ri-send-plane-fill"></i>
          </button>
        </form>
      </div>
    </section>
	</div>
  );
};

export default Home; 