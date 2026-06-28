/* ============================================
   長尾商店 - script.js
   ============================================ */

// ---- Header scroll effect ----
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ---- Scroll-in animation ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.service-card, .case-card, .value-item, .career-item, .stat-item'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
  observer.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

// Trigger visible class via IntersectionObserver
const styleEl = document.createElement('style');
styleEl.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(styleEl);

// ---- Contact form ----
const form = document.getElementById('contact-form');
const toast = document.getElementById('toast');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    const first = [
      !name && form.name,
      !email && form.email,
      !message && form.message,
    ].find(Boolean);
    if (first) first.focus();
    return;
  }

  // Mailto fallback (static site)
  const subject = encodeURIComponent(`【長尾商店HP】${name}様よりお問い合わせ`);
  const body = encodeURIComponent(
    `お名前：${name}\n` +
    `会社名：${form.company.value.trim() || '（未入力）'}\n` +
    `メール：${email}\n` +
    `サービス：${form.service.options[form.service.selectedIndex].text}\n\n` +
    `内容：\n${message}`
  );
  window.location.href = `mailto:akihisa.nagao@longtailers.jp?subject=${subject}&body=${body}`;

  showToast();
  form.reset();
});

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ---- Smooth scroll offset for fixed header ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ---- Counter animation for stat numbers ----
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const text = el.textContent;
    const match = text.match(/[\d,]+/);
    if (!match) return;
    const target = parseInt(match[0].replace(',', ''), 10);
    const suffix = el.innerHTML.replace(/[\d,]+/, '');
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.innerHTML = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));
