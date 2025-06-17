import React from 'react';

const Banner = () => {
  return (
    <div>
      <div className="header__container" id="home">
        <h1 >PREMIUM CAR RENTAL</h1>
        <form action="/">
          <div className="input__group">
            <label htmlFor="location">Pick up & Return location</label> <input
              type="text" name="location" id="location"
              placeholder="Dallas, Texas" />
          </div>
          <div className="input__group">
            <label htmlFor="start">Start</label> <input type="text" name="start"
              id="start" placeholder="Aug 16, 10:00 AM" />
          </div>
          <div className="input__group">
            <label htmlFor="stop">Stop</label> <input type="text" name="stop"
              id="stop" placeholder="Aug 18, 10:00 PM" />
          </div>
          <button className="btn">
            <i className="ri-search-line"></i>
          </button>
        </form>
        <img src="assets/images/header.png" alt="header" />
      </div>
      <a href="#about" className="scroll__down"> <i
        className="ri-arrow-down-line"></i></a>
    </div>

  );
};

export default Banner; 