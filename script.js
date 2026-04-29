// ---------- Theme toggle (no persistence for sandbox safety) ----------
(function () {
  const btn = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;

  let theme = root.getAttribute('data-theme') ||
    (window.matchMedia &&
      matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');

  root.setAttribute('data-theme', theme);

  function setIcon(t) {
    if (!btn) return;
    if (t === 'dark') {
      btn.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="5"/>' +
        '<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42' +
        'M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>' +
        '</svg>';
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      btn.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
        '</svg>';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  setIcon(theme);

  if (btn) {
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      setIcon(theme);
      localStorage.setItem('theme', theme);
    });
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme = savedTheme;
    root.setAttribute('data-theme', theme);
    setIcon(theme);
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  theme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
})();

// ---------- Scroll header state ----------
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Mobile menu ----------
const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');
let menuOpen = false;

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNav.classList.toggle('open', menuOpen);
    menuBtn.setAttribute('aria-expanded', String(menuOpen));
    mobileNav.setAttribute('aria-hidden', String(!menuOpen));
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

// ---------- Active nav highlight ----------
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a')];

function setActiveNav() {
  const headerOffset = 120;
  const scrollPos = window.scrollY + headerOffset;

  let currentSection = sections[0];

  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) {
      currentSection = section;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${currentSection.id}`
    );
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('load', setActiveNav);

// ---------- Fade-in on scroll ----------
const revealEls = document.querySelectorAll('.reveal');

const ioReveal = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        ioReveal.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach(el => ioReveal.observe(el));

// ---------- Stat counter (subtle) ----------
const statNums = document.querySelectorAll('.stat-number[data-target]');

const ioStats = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (Number.isNaN(target)) return;

      const duration = 800;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = `${value}+`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      ioStats.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => ioStats.observe(el));


// --- Typewriter effect in hero ---
const roles = ['ML / AI Engineer', 'Applied ML Engineer', 'AI Systems Engineer', 'Open Source Builder'];
let roleIdx = 0, charIdx = 0, deleting = false;
const taglineEl = document.querySelector('.hero-tagline strong');
if (taglineEl) {
  taglineEl.innerHTML = roles[0] + '<span class="cursor" aria-hidden="true"></span>';
  let timeout;
  function type() {
    const current = roles[roleIdx];
    if (deleting) {
      charIdx--;
    } else {
      charIdx++;
    }
    taglineEl.innerHTML = current.substring(0, charIdx) + '<span class="cursor" aria-hidden="true"></span>';
    let delay = deleting ? 50 : 100;
    if (!deleting && charIdx === current.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }
    timeout = setTimeout(type, delay);
  }
  setTimeout(type, 1800);
}

// ---------- Contact form UX ----------
const form = document.getElementById('contact-form');
const successEl = document.getElementById('form-success');
const endpoint = 'https://portfolio-feedback-mu.vercel.app/api/feedback';

if (form && successEl) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in Name, Email, and Message.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const payload = {
      type: 'contact_form',
      name,
      email,
      subject,
      message,
      ts: new Date().toISOString()
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Request failed');

      form.style.display = 'none';
      successEl.style.display = 'block';
    } catch (err) {
      alert('Something went wrong. Please try again or email me directly.');
    } finally {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  });
}
