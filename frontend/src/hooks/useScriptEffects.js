import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import Swiper from 'swiper';

export const useScriptEffects = () => {
  useEffect(() => {
    // Cấu hình ScrollReveal
    const scrollRevealOption = {
      origin: "bottom",
      distance: "50px",
      duration: 1000,
    };

    // Áp dụng ScrollReveal cho các phần tử
    ScrollReveal().reveal(".header__container form", {
      ...scrollRevealOption,
      delay: 500,
    });
    ScrollReveal().reveal(".header__container img", {
      ...scrollRevealOption,
      delay: 1000,
    });
    ScrollReveal().reveal(".range__card", {
      duration: 1000,
      interval: 500,
    });
    ScrollReveal().reveal(".location__image img", {
      ...scrollRevealOption,
      origin: "right",
    });
    ScrollReveal().reveal(".location__content .section__header", {
      ...scrollRevealOption,
      delay: 500,
    });
    ScrollReveal().reveal(".location__content p", {
      ...scrollRevealOption,
      delay: 1000,
    });
    ScrollReveal().reveal(".location__content .location__btn", {
      ...scrollRevealOption,
      delay: 1500,
    });
    ScrollReveal().reveal(".story__card", {
      ...scrollRevealOption,
      interval: 500,
    });
    ScrollReveal().reveal(".download__image img", {
      ...scrollRevealOption,
      origin: "right",
    });
    ScrollReveal().reveal(".download__content .section__header", {
      ...scrollRevealOption,
      delay: 500,
    });
    ScrollReveal().reveal(".download__links", {
      ...scrollRevealOption,
      delay: 1000,
    });

    // Khởi tạo Swiper
    const swiper = new Swiper(".swiper", {
      loop: true,
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 0,
        depth: 500,
        modifier: 1,
        scale: 0.75,
        slideShadows: false,
        stretch: -100,
      },
    });

    // Cleanup function
    return () => {
      // Cleanup ScrollReveal instances if needed
      ScrollReveal().destroy();
      // Cleanup Swiper instance if needed
      if (swiper) {
        swiper.destroy();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount
}; 