/* Minimal navigation, image zoom and footer year. No dependencies or tracking. */
(function () {
  'use strict';
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav-links');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const modal = document.getElementById('image-lightbox');
  const modalImage = document.getElementById('lightbox-image');
  const modalCaption = document.getElementById('lightbox-caption');
  document.querySelectorAll('[data-full-image]').forEach(button => {
    button.addEventListener('click', () => {
      const src = button.getAttribute('data-full-image');
      if (!src) return;
      if (modal && typeof modal.showModal === 'function' && modalImage && modalCaption) {
        modalImage.src = src;
        modalImage.alt = button.getAttribute('data-image-alt') || 'Expanded photograph';
        modalCaption.textContent = modalImage.alt;
        modal.showModal();
      } else {
        window.open(src, '_blank', 'noopener,noreferrer');
      }
    });
  });
  if (modal) {
    modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
    modal.addEventListener('close', () => { if (modalImage) modalImage.removeAttribute('src'); });
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window && nav) {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) links.forEach(link => link.classList.toggle('active', link.hash === '#' + active.target.id));
    }, {rootMargin: '-18% 0px -62% 0px', threshold: [0, .15, .4]});
    sections.forEach(section => observer.observe(section));
  }
})();
