document.addEventListener('DOMContentLoaded', () => {
  // Элементы
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const logo = document.getElementById('app-logo');
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  // --- 1) Восстановление темы из localStorage ---
  const saved = localStorage.getItem('theme'); // 'dark' или 'gray' (или null)
  if (saved === 'dark') {
    body.classList.add('dark');
    logo.src = 'imgft/2qq.png'; // белая иконка для тёмной темы
    themeBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    logo.src = 'imgft/32.png'; // чёрная иконка для светлой/серой темы
    themeBtn.textContent = '🌙';
  }

  // --- 2) Переключатель темы (серый <-> тёмный) ---
  themeBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    if (isDark) {
      logo.src = 'imgft/2qq.png';
      themeBtn.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      logo.src = 'imgft/32.png';
      themeBtn.textContent = '🌙';
      localStorage.setItem('theme', 'gray');
    }
  });

  // --- 3) Бургер меню ---
  burger.addEventListener('click', () => {
    const opened = mobileNav.style.display === 'block';
    if (opened) {
      mobileNav.style.display = 'none';
      mobileNav.setAttribute('aria-hidden', 'true');
    } else {
      mobileNav.style.display = 'block';
      mobileNav.setAttribute('aria-hidden', 'false');
    }
  });
  // Закрыть мобильное меню при клике на ссылку
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.style.display = 'none';
    mobileNav.setAttribute('aria-hidden', 'true');
  }));

  // --- 4) FAQ аккордеон ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('active');
    });
  });

  // --- 5) Анимация карточек при скролле (IntersectionObserver) ---
  const featureCards = document.querySelectorAll('.feature-card');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('show');
          o.unobserve(en.target);
        }
      });
    }, { threshold: 0.18 });
    featureCards.forEach(c => obs.observe(c));
  } else {
    featureCards.forEach(c => c.classList.add('show'));
  }

  // --- 6) Немного UX: автоскролл чата к низу (после появления сообщений) ---
  const phoneChat = document.getElementById('phoneChat');
  const scrollToBottom = () => {
    phoneChat.scrollTop = phoneChat.scrollHeight;
  };
  // делаем периодический скролл (через задержку, чтобы дождаться анимаций сообщений)
  setTimeout(scrollToBottom, 2400);
  setTimeout(scrollToBottom, 5400);
  setTimeout(scrollToBottom, 7600);

});
