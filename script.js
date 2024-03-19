window.onload = function () {
  Particles.init({
    selector: ".background"
  });
};
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

const particles = Particles.init({
  selector: ".background",
  color: ["#03dac6", "#ff0266", "#000000"],
  connectParticles: true,
  responsive: [
    {
      breakpoint: 768,
      options: {
        color: ["#faebd7", "#03dac6", "#ff0266"],
        maxParticles: 43,
        connectParticles: false
      }
    }
  ]
});

class NavigationPage {
  constructor() {
    this.currentId = null;
    this.currentTab = null;
    this.tabContainerHeight = 70;
    this.lastScroll = 0;
    let self = this;
    $(".nav-tab").click(function (event) {
      event.preventDefault();
      let scrollTop =
        $($(this).attr("href")).offset().top - self.tabContainerHeight + 1;
      self.smoothScroll(scrollTop);
    });
    $(window).scroll(() => {
      this.onScroll();
    });
    $(window).resize(() => {
      this.onResize();
    });
  }

  smoothScroll(target) {
    const startTime = performance.now();
    const startTop = window.scrollY || window.pageYOffset;
    const duration = 600; // Adjust the duration as needed

    function scroll() {
      const currentTime = performance.now();
      const progress = Math.min(1, (currentTime - startTime) / duration);
      const easeInOutQuad = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const newY = startTop + (target - startTop) * easeInOutQuad;
      window.scrollTo(0, newY);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    }

    scroll();
  }

  onScroll() {
    this.checkHeaderPosition();
    this.findCurrentTabSelector();
    this.lastScroll = $(window).scrollTop();
  }

  onResize() {
    if (this.currentId) {
      this.setSliderCss();
    }
  }

  checkHeaderPosition() {
    const headerHeight = 75;
    if ($(window).scrollTop() > headerHeight) {
      $(".nav-container").addClass("nav-container--scrolled");
    } else {
      $(".nav-container").removeClass("nav-container--scrolled");
    }
    let offset =
      $(".nav").offset().top +
      $(".nav").height() -
      this.tabContainerHeight -
      headerHeight;
    if (
      $(window).scrollTop() > this.lastScroll &&
      $(window).scrollTop() > offset
    ) {
      $(".nav-container").addClass("nav-container--move-up");
      $(".nav-container").removeClass("nav-container--top-first");
      $(".nav-container").addClass("nav-container--top-second");
    } else if (
      $(window).scrollTop() < this.lastScroll &&
      $(window).scrollTop() > offset
    ) {
      $(".nav-container").removeClass("nav-container--move-up");
      $(".nav-container").removeClass("nav-container--top-second");
      $(".nav-container-container").addClass("nav-container--top-first");
    } else {
      $(".nav-container").removeClass("nav-container--move-up");
      $(".nav-container").removeClass("nav-container--top-first");
      $(".nav-container").removeClass("nav-container--top-second");
    }
  }

  findCurrentTabSelector(element) {
    let newCurrentId;
    let newCurrentTab;
    let self = this;
    $(".nav-tab").each(function () {
      let id = $(this).attr("href");
      let offsetTop = $(id).offset().top - self.tabContainerHeight;
      let offsetBottom =
        $(id).offset().top + $(id).height() - self.tabContainerHeight;
      if (
        $(window).scrollTop() > offsetTop &&
        $(window).scrollTop() < offsetBottom
      ) {
        newCurrentId = id;
        newCurrentTab = $(this);
      }
    });
    if (this.currentId != newCurrentId || this.currentId === null) {
      this.currentId = newCurrentId;
      this.currentTab = newCurrentTab;
      this.setSliderCss();
    }
  }

  setSliderCss() {
    let width = 0;
    let left = 0;
    if (this.currentTab) {
      width = this.currentTab.css("width");
      left = this.currentTab.offset().left;
    }
    $(".nav-tab-slider").css("width", width);
    $(".nav-tab-slider").css("left", left);
  }
}

new NavigationPage();



function init() { 
  const catWrapper = document.querySelector('.cat_wrapper')
  const wrapper = document.querySelector('.wrapper')
  const cat = document.querySelector('.cat')
  const head = document.querySelector('.cat_head')
  const legs = document.querySelectorAll('.leg')
  const pos = {
    x: null,
    y: null
  }

  const walk = () =>{
    cat.classList.remove('first_pose')
    legs.forEach(leg=>leg.classList.add('walk'))
  }

  const handleMouseMotion = e =>{
    pos.x = e.clientX
    pos.y = e.clientY
    walk()
  }

  const handleTouchMotion = e =>{
    if (!e.targetTouches) return
    pos.x = e.targetTouches[0].offsetX
    pos.y = e.targetTouches[0].offsetY
    walk()
  }

  const turnRight = () =>{
    cat.style.left = `${pos.x - 90}px`
    cat.classList.remove('face_left')
    cat.classList.add('face_right')
  }

  const turnLeft = () =>{
    cat.style.left = `${pos.x + 10}px`
    cat.classList.remove('face_right')
    cat.classList.add('face_left')
  }

  const decideTurnDirection = () =>{
    cat.getBoundingClientRect().x < pos.x ?
      turnRight()
      :
      turnLeft()
  }

  const headMotion = () =>{
    pos.y > (wrapper.clientHeight - 100) ?
      head.style.top = '-15px'
      :
      head.style.top = '-30px'
  }

  const jump = () =>{
    catWrapper.classList.remove('jump')
    if (pos.y < (wrapper.clientHeight - 250)) {
      setTimeout(()=>{
        catWrapper.classList.add('jump')
      },100)
    } 
  }

  const decideStop = ()=>{
    if (cat.classList.contains('face_right') && pos.x - 90 === cat.offsetLeft ||
        cat.classList.contains('face_left') && pos.x + 10 === cat.offsetLeft) {
      legs.forEach(leg=>leg.classList.remove('walk'))    
    }
  }
  
  setInterval(()=>{
    if (!pos.x || !pos.y) return
    decideTurnDirection()
    headMotion()
    decideStop()
  },100)

  setInterval(()=>{
    if (!pos.x || !pos.y) return
    jump()
  },1000)

  document.addEventListener('mousemove', handleMouseMotion)
  document.addEventListener('mousemove', handleTouchMotion)
}

window.addEventListener('DOMContentLoaded', init)
new NavigationPage();
