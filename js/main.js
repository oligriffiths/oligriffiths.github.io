// Switch between light and dark mode, remembering the choice.
document.querySelectorAll('.theme-toggle').forEach(function (button) {
  button.addEventListener('click', function () {
    var root = document.documentElement;
    var current = root.getAttribute('data-theme');
    if (!current) {
      current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
    }
  });
});

// Toggle the mobile navbar menu.
document.querySelectorAll('.navbar-burger').forEach(function (burger) {
  burger.addEventListener('click', function () {
    var menu = document.getElementById(burger.dataset.target);
    var open = burger.classList.toggle('is-active');
    menu.classList.toggle('is-active', open);
    burger.setAttribute('aria-expanded', open);
  });
});

// Close the mobile menu after following an in-page link.
document.querySelectorAll('.navbar-menu .navbar-item').forEach(function (item) {
  item.addEventListener('click', function () {
    document.querySelectorAll('.navbar-burger, .navbar-menu').forEach(function (el) {
      el.classList.remove('is-active');
    });
  });
});

// Fade sections in as they scroll into view.
(function () {
  var sections = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(function (el) {
    observer.observe(el);
  });
  document.documentElement.classList.add('js');
})();
