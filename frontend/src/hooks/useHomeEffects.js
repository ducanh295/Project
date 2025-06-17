import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import Swiper from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

export const useHomeEffects = () => {
  useEffect(() => {
    // Cấu hình ScrollReveal
    const scrollRevealOption = {
      origin: "bottom",
      distance: "50px",
      duration: 1000,
    };

    // Áp dụng ScrollReveal cho các phần tử
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

    // Khởi tạo Swiper
    const swiper = new Swiper(".swiper", {
      modules: [EffectCoverflow],
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

    // Xử lý banner animation
    const banner = document.querySelector(".banner__wrapper");
    if (banner) {
      const bannerContent = Array.from(banner.children);
      bannerContent.forEach((item) => {
        const duplicateNode = item.cloneNode(true);
        duplicateNode.setAttribute("aria-hidden", true);
        banner.appendChild(duplicateNode);
      });
    }

    // Cleanup function
    return () => {
      ScrollReveal().destroy();
      if (swiper) {
        swiper.destroy();
      }
    };
  }, []);
}; 