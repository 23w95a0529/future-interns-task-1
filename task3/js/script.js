// ---------- mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- menu tabs ----------
const tabs = document.querySelectorAll('.menu-tab');
const panels = document.querySelectorAll('.menu-panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
  });
});

// ---------- scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// ---------- contact form (demo fallback) ----------
// Formsubmit.co requires the action email to be confirmed once by the owner.
// Until then, this shows a friendly confirmation instead of a failed request,
// so the form still feels complete during a client demo.
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    // Let Formsubmit handle real submissions once the owner's email is verified.
    // For a first demo/pitch, uncomment the two lines below to preview a
    // client-side confirmation instead of navigating away.
    //
    // e.preventDefault();
    // alert('Thanks! This is a demo — connect a real email or form service before launch.');
  });
}
