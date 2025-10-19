// Kiss Pollos — Front-End Logic
(() => {
  // Prevent this file from running twice (dev servers sometimes double-inject)
  if (window.__KISS_POLLOS_APP__) return;
  window.__KISS_POLLOS_APP__ = true;

  const $ = (s, root = document) => root.querySelector(s);

  document.addEventListener('DOMContentLoaded', () => {
    /* ===== Year ===== */
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    /* ===== Open / Closed status (Mon–Fri 10:30–17:00) ===== */
    (() => {
      const el = $('#openStatus');
      if (!el) return;

      // Mon=1..Fri=5
      const hours = { 1:'10:30-17:00', 2:'10:30-17:00', 3:'10:30-17:00', 4:'10:30-17:00', 5:'10:30-17:00' };
      const now = new Date();
      const dow = now.getDay();
      const spec = hours[dow];

      if (!spec) {
        el.textContent = 'Closed today';
        el.style.background = 'rgba(255,65,65,.14)';
        return;
      }

      const toMins = (hhmm) => {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
      };
      const [open, close] = spec.split('-');
      const cur = now.getHours() * 60 + now.getMinutes();
      const isOpen = cur >= toMins(open) && cur <= toMins(close);

      el.textContent = isOpen ? `Open now • Today ${open}–${close}` : `Closed • Today ${open}–${close}`;
      el.style.background = isOpen ? 'rgba(46,163,106,.16)' : 'rgba(255,65,65,.14)';
    })();

    /* ===== Leaflet Map (guard against double init) ===== */
    const mapEl = $('#map');
    if (mapEl && typeof L !== 'undefined') {
      // If already initialized, bail out (prevents double map)
      if (!mapEl.dataset.inited) {
        mapEl.dataset.inited = '1';
        if (mapEl.offsetHeight === 0) mapEl.style.height = '400px';

        const center = [33.4306, -112.0796];
        const map = L.map(mapEl, { scrollWheelZoom: false }).setView(center, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        L.marker(center).addTo(map)
          .bindPopup('<b>Kiss Pollos</b><br>306 W Yavapai St, Phoenix, AZ 85003');
      } else {
        console.debug('[map] already initialized — skipping');
      }
    }

    /* ===== Lightbox (for gallery) ===== */
    const grid = $('#galleryGrid');
    const lightbox = $('#lightbox');
    const lightImg = $('#lightboxImg');
    const closeBtn = $('.lightbox-close');

    if (grid && lightbox && lightImg && closeBtn) {
      grid.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (!img) return;
        lightImg.src = img.src;
        lightImg.alt = img.alt || 'Photo';
        lightbox.classList.remove('hidden');
      });
      closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.add('hidden'); });
    }

    /* ===== Contact form (client demo only) ===== */
    const form = $('#contactForm');
    const status = $('#formStatus');
    if (form && status) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        status.textContent = 'Thanks! We got your message.';
        form.reset();
      });
    }

    /* ===== Scroll reveal ===== */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((ent) => { if (ent.isIntersecting) ent.target.classList.add('in'); }),
      { threshold: 0.12, rootMargin: '120px' }
    );
    document.querySelectorAll('.card, .tile, .gallery img, .review, .insta-grid img')
      .forEach(el => { el.classList.add('reveal'); io.observe(el); });
  });
})();
