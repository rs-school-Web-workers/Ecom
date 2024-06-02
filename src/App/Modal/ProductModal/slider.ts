import SwiperCore from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

window.onload = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const swiper = new SwiperCore('.swiper-container', {
    direction: 'horizontal',
    grabCursor: true,
    // loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
  });
};
