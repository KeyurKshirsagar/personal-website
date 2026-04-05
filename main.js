/* ===== Animated canvas background — Deep Ocean Dusk ===== */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const orbs = [
    { x: 0.2, y: 0.3, r: 0.55, color: '#1a3832', speedX: 0.00018, speedY: 0.00012 },
    { x: 0.7, y: 0.6, r: 0.50, color: '#2a1e08', speedX: -0.00014, speedY: 0.00010 },
    { x: 0.5, y: 0.8, r: 0.45, color: '#0d1a24', speedX: 0.00010, speedY: -0.00016 },
    { x: 0.8, y: 0.2, r: 0.40, color: '#1e2a10', speedX: -0.00012, speedY: 0.00014 },
    { x: 0.3, y: 0.7, r: 0.38, color: '#2e1a06', speedX: 0.00016, speedY: -0.00010 },
  ];

  function drawOrb(orb) {
    const cx = orb.x * W;
    const cy = orb.y * H;
    const radius = orb.r * Math.max(W, H);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, orb.color + 'cc');
    grad.addColorStop(0.5, orb.color + '55');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function animate() {
    t++;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#0f110e';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 1;

    orbs.forEach(orb => {
      orb.x += Math.sin(t * orb.speedX * 60) * 0.0003;
      orb.y += Math.cos(t * orb.speedY * 60) * 0.0003;
      if (orb.x < -0.1) orb.x = 1.1;
      if (orb.x > 1.1) orb.x = -0.1;
      if (orb.y < -0.1) orb.y = 1.1;
      if (orb.y > 1.1) orb.y = -0.1;
      drawOrb(orb);
    });

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    requestAnimationFrame(animate);
  }

  animate();
})();

/* ===== Scroll progress bar ===== */
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';
}

/* ===== Parallax on home name ===== */
const homeName = document.querySelector('.home-name');

function updateParallax() {
  if (!homeName) return;
  const scrollY = window.scrollY;
  const offset = scrollY * 0.3;
  homeName.style.transform = `translateY(${offset}px)`;
}

/* Combined scroll handler via rAF */
let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ===== IntersectionObserver for scroll-triggered animations ===== */
const animatedElements = document.querySelectorAll('.animate-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = Array.from(el.parentElement.children).filter((c) =>
          c.classList.contains('animate-in')
        );
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * 0.15}s`;
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.15 }
);

animatedElements.forEach((el) => observer.observe(el));

/* ===== About section scroll animations ===== */
const aboutElements = document.querySelectorAll('.animate-in-left, .animate-in-right');

const aboutObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        aboutObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

aboutElements.forEach((el) => aboutObserver.observe(el));

/* ===== Mobile hamburger menu ===== */
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');

if (navHamburger && navLinks) {
  navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-pill').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 600) {
        navHamburger.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
  });
}

/* ===== CONNECT overlay ===== */
const connectTrigger = document.getElementById('connectTrigger');
const connectOverlay = document.getElementById('connectOverlay');
const connectClose = document.getElementById('connectClose');
const connectContent = document.getElementById('connectContent');
const socialFloat = document.getElementById('socialFloat');

function openOverlay() {
  connectOverlay.classList.add('open');
  socialFloat.classList.add('hidden');
  if (navHamburger && navLinks && window.innerWidth <= 600) {
    navHamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
}

function closeOverlay() {
  connectOverlay.classList.remove('open');
  socialFloat.classList.remove('hidden');
}

connectTrigger.addEventListener('click', openOverlay);
connectClose.addEventListener('click', closeOverlay);

connectOverlay.addEventListener('click', (e) => {
  if (e.target === connectOverlay) closeOverlay();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && connectOverlay.classList.contains('open')) {
    closeOverlay();
  }
});
