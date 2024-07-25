'use strict';

//  DOM ELEMENTS
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const navLinksContainer = document.querySelector('.nav__links');
const opsTabsContainer = document.querySelector('.operations__tab-container');
const navContainer = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

// FUNCTIONS
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const scroll = function (e, scrollToElement) {
  if (!e.target.classList.contains('nav__link') && !scrollToElement) return;
  e.preventDefault();
  const scrollToElementDOM = document.querySelector(
    scrollToElement ? scrollToElement : e.target.getAttribute('href')
  );
  scrollToElementDOM.scrollIntoView({ behavior: 'smooth' });
};

const fadeInMenu = function (e) {
  if (!e.target.classList.contains('nav__link')) return;
  const link = e.target;
  const allLinks = link.closest('.nav__links').querySelectorAll('.nav__link');
  allLinks.forEach(li => li !== link && (li.style.opacity = this.opacity));
  link.closest('.nav').querySelector('#logo').style.opacity = this.opacity;
};

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navContainer.classList.add('sticky');
  else navContainer.classList.remove('sticky');
};

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //replace data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', _ =>
    entry.target.classList.remove('lazy-img')
  );

  observer.unobserve(entry.target);
};

// EVENT LISTENERS

//Modal Window
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//smooth scroll
btnLearnMore.addEventListener('click', function (e) {
  scroll(e, '#section--1');
});
navLinksContainer.addEventListener('click', scroll);

// tabbed
opsTabsContainer.addEventListener('click', function (e) {
  const tabBtn = e.target.closest('.operations__tab');
  if (!tabBtn) return;
  document.querySelectorAll('.operations__tab').forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });
  tabBtn.classList.add('operations__tab--active');

  document.querySelectorAll('.operations__content').forEach(cont => {
    cont.classList.remove('operations__content--active');
  });
  document
    .querySelector(`.operations__content--${tabBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

// fade-in nav
navContainer.addEventListener('mouseover', fadeInMenu.bind({ opacity: 0.5 }));
navContainer.addEventListener('mouseout', fadeInMenu.bind({ opacity: 1 }));

// sticky navbar
const navHeight = navContainer.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//revealing elements on scroll
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading images
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//slider
function slider() {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const slidesCount = slides.length;
  const dotsContainer = document.querySelector('.dots');
  let curSlide = 0;

  const moveToSlide = function (curSlide) {
    slides.forEach((sl, i) => {
      sl.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });
    activateDot(curSlide);
  };
  const nextSlide = function () {
    //when the right button pressed first time
    //(i - 1) * 100
    //1st slide translateX: -100%
    //2nd slide translateX: 0
    //3rd slide translateX: 100%

    // when the right button pressed second time
    //(i - 2) * 100
    //1st slide translateX: -200%
    //2nd slide translateX: -100%
    //3rd slide translateX: 0

    // when the right button pressed third time
    //(i - 0) * 100
    //1st slide translateX: 0%
    //2nd slide translateX: 100%
    //3rd slide translateX: 200%
    if (curSlide === slidesCount - 1) curSlide = 0; //last slide
    else curSlide++;
    moveToSlide(curSlide);
  };

  const prevSide = function () {
    //  0, 100% 200% ... (left clicked on slide2)
    // -100% 0 100% ... (left clicked on slide3)
    // -200% -100% 0 100% ...  (left clicked on slide4)
    if (curSlide === 0) curSlide = slidesCount - 1;
    else curSlide--;
    moveToSlide(curSlide);
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (curSlide_) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));
    const targetDot = document.querySelector(
      `.dots__dot[data-slide="${curSlide_}"]`
    );
    targetDot.classList.add('dots__dot--active');
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSide);
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSide();
    e.key === 'ArrowRight' && nextSlide();
  });
  dotsContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    const slideMoveTo = e.target.dataset.slide;
    moveToSlide(slideMoveTo);
    activateDot(slideMoveTo);
  });

  createDots();
  moveToSlide(0);
  activateDot(0);
}
slider();

// smooth scrolling (old way)
// old school way
// const { left, top } = document
//   .querySelector(`#${scrollToElement}`)
//   .getBoundingClientRect();

// const { scrollX, scrollY } = window;
// window.scrollTo({
//   left: left + scrollX,
//   top: top + scrollY,
//   behavior: 'smooth',
// });

// working in safari
// let destination =
//   document.querySelector(`#${scrollToElement}`).getBoundingClientRect().top +
//   window.scrollY;
// const pace = 200;
// let prevTimestamp = performance.now();
// let currentPos = window.scrollY;
// // @param: timestamp is a "DOMHightResTimeStamp", check on MDN
// function step(timestamp) {
//   let remainingDistance =
//     currentPos < destination
//       ? destination - currentPos
//       : currentPos - destination;
//   let stepDuration = timestamp - prevTimestamp;
//   let numOfSteps = pace / stepDuration;
//   let stepLength = remainingDistance / numOfSteps;

//   currentPos =
//     currentPos < destination
//       ? currentPos + stepLength
//       : currentPos - stepLength;
//   window.scrollTo({ top: currentPos });
//   prevTimestamp = timestamp;

//   if (Math.floor(remainingDistance) >= 1) window.requestAnimationFrame(step);
// }
// window.requestAnimationFrame(step);
