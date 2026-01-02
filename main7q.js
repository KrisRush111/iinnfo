document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const logo = document.getElementById('app-logo');
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  // restore theme
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    body.classList.add('dark');
    logo.src = '2qq.png';
    themeBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    logo.src = '32.png';
    themeBtn.textContent = '🌙';
  }

  // theme toggle
  themeBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    if (isDark) {
      logo.src = '2qq.png';
      themeBtn.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      logo.src = '32.png';
      themeBtn.textContent = '🌙';
      localStorage.setItem('theme', 'gray');
    }
  });

  // burger menu toggle (slide simple)
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
  // close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.style.display = 'none';
    mobileNav.setAttribute('aria-hidden', 'true');
  }));

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('active');
    });
  });

  // IntersectionObserver for features
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

  // phone chat autoscroll with delays (ensure chat scrolls to bottom as messages appear)
  const phoneChat = document.getElementById('phoneChat');
  const scrollToBottom = () => { if (phoneChat) phoneChat.scrollTop = phoneChat.scrollHeight; };
  setTimeout(scrollToBottom, 2400);
  setTimeout(scrollToBottom, 5400);
  setTimeout(scrollToBottom, 7600);

  // smooth scrolling for header links (desktop and mobile)
  const headerHeight = document.querySelector('.header-inner')?.offsetHeight || 64;

  function smoothScrollTo(targetEl) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top;
    const offset = headerHeight + 12; // небольшая подстраховка
    window.scrollTo({
      top: absoluteTop - offset,
      behavior: 'smooth'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        // close mobile nav if open
        if (mobileNav && mobileNav.style.display === 'block') {
          mobileNav.style.display = 'none';
          mobileNav.setAttribute('aria-hidden', 'true');
        }
        smoothScrollTo(target);
        // небольшой визуальный эффект: подсветка цели
        target.animate([{ boxShadow: '0 0 0 rgba(0,0,0,0)' }, { boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }, { boxShadow: '0 0 0 rgba(0,0,0,0)' }], { duration: 700 });
      }
    });
  });

  // ensure logo brightness/contrast changes a bit in dark theme (optional polish)
  const updateLogoFilter = () => {
    if (body.classList.contains('dark')) {
      logo.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,0.6))';
    } else {
      logo.style.filter = 'none';
    }
  };
  updateLogoFilter();
  // also update on toggle
  themeBtn.addEventListener('click', () => setTimeout(updateLogoFilter, 50));
});

// === SOFT DROP RIPPLE ON HOVER ===
const installBtn = document.getElementById('showInstall');

if (installBtn) {
  installBtn.style.position = 'relative';
  installBtn.style.overflow = 'hidden';
  installBtn.style.backgroundColor = '#2ecc71'; // исходно зелёная
  installBtn.style.color = '#ffffff';
  installBtn.style.border = 'none';
  installBtn.style.cursor = 'pointer';
  installBtn.style.transition = 'background-color 1s ease, color 1s ease';

  let ripple = null;

  function createRipple(x, y) {
    if (ripple && ripple.parentNode) ripple.remove();
    const rect = installBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.4;
    ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - rect.left - size / 2}px`;
    ripple.style.top = `${y - rect.top - size / 2}px`;
    ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '1';
    ripple.style.transition = 'transform 0.6s ease-out, opacity 0.8s ease-out';
    ripple.style.zIndex = '0';
    installBtn.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)';
      ripple.style.opacity = '0';
    });
  }

  installBtn.addEventListener('pointerenter', (e) => {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    createRipple(x, y);

    // кнопка становится серо-белой, текст зелёным
    installBtn.style.backgroundColor = '#e4e2e2';
    installBtn.style.color = '#2ecc71';
  });

  installBtn.addEventListener('pointerleave', () => {
    // плавно возвращаемся в исходное состояние
    installBtn.style.backgroundColor = '#2ecc71';
    installBtn.style.color = '#ffffff';

    // удаляем остаток волны
    if (ripple) {
      ripple.style.opacity = '0';
      setTimeout(() => ripple && ripple.remove(), 500);
    }
  });
}



// === 3D ROTATING CAROUSEL (с поддержкой мобильных) ===
const carousel = document.querySelector('.carousel-3d');
if (carousel) {
  // Определяем, какие изображения использовать (мобильные или десктопные)
  const isMobile = window.innerWidth <= 768;
  const slides = Array.from(carousel.querySelectorAll(isMobile ? '.mobile-screenshot' : '.desktop-screenshot'));
  
  let current = 1; // старт с 2-го (он будет по центру)

  function updatePositions() {
    // Сначала скрываем все
    slides.forEach((img, i) => {
      img.className = isMobile ? 'mobile-screenshot' : 'desktop-screenshot';
      img.style.opacity = '0';
      img.style.transform = 'scale(0.8)';
    });
    
    // Показываем только 3 активных
    const left = (current - 1 + slides.length) % slides.length;
    const right = (current + 1) % slides.length;
    
    // Настройки для мобильных
    if (isMobile) {
      const mobileOffset = window.innerWidth <= 480 ? 100 : 120;
      const mobileScale = window.innerWidth <= 480 ? 0.75 : 0.8;
      
      slides[left].classList.add('left');
      slides[left].style.opacity = '1';
      slides[left].style.transform = `translateX(-${mobileOffset}px) scale(${mobileScale}) rotateY(20deg)`;
      
      slides[current].classList.add('center');
      slides[current].style.opacity = '1';
      slides[current].style.transform = 'translateX(0) scale(1)';
      
      slides[right].classList.add('right');
      slides[right].style.opacity = '1';
      slides[right].style.transform = `translateX(${mobileOffset}px) scale(${mobileScale}) rotateY(-20deg)`;
    } else {
      // Настройки для десктопа
      slides[left].classList.add('left');
      slides[left].style.opacity = '1';
      slides[left].style.transform = 'translateX(-220px) scale(0.9) rotateY(25deg)';
      
      slides[current].classList.add('center');
      slides[current].style.opacity = '1';
      slides[current].style.transform = 'translateX(0) scale(1.1)';
      
      slides[right].classList.add('right');
      slides[right].style.opacity = '1';
      slides[right].style.transform = 'translateX(220px) scale(0.9) rotateY(-25deg)';
    }
  }

  function next() {
    current = (current - 1 + slides.length) % slides.length;
    updatePositions();
  }

  function prev() {
    current = (current + 1) % slides.length;
    updatePositions();
  }

  // Инициализация
  updatePositions();
  let autoScroll = setInterval(next, 5000);

  // Обработчик ресайза для переключения между мобильными/десктопными изображениями
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      location.reload(); // Простейший способ - перезагрузить при изменении размера
    }, 250);
  });

  // Touch/swipe события для мобильных
  let startX = 0;
  let startY = 0;
  let isScrolling = false;
  
  carousel.addEventListener('touchstart', (e) => {
    clearInterval(autoScroll);
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isScrolling = false;
  }, { passive: true });
  
  carousel.addEventListener('touchmove', (e) => {
    if (!isScrolling) {
      const diffX = Math.abs(e.touches[0].clientX - startX);
      const diffY = Math.abs(e.touches[0].clientY - startY);
      isScrolling = diffY > diffX;
    }
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    if (isScrolling) {
      autoScroll = setInterval(next, 5000);
      return;
    }
    
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 60) prev();
    else if (diff < -60) next();
    
    autoScroll = setInterval(next, 5000);
  });
}

// Улучшенный скролл для мобильных
document.addEventListener('DOMContentLoaded', () => {
  // ... существующий код ...
  
  // Плавный скролл с учетом мобильной клавиатуры
  const smoothScrollTo = (targetEl) => {
    if (!targetEl) return;
    
    const isMobile = window.innerWidth <= 768;
    const rect = targetEl.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + rect.top;
    const offset = isMobile ? headerHeight + 20 : headerHeight + 12;
    
    window.scrollTo({
      top: absoluteTop - offset,
      behavior: 'smooth'
    });
    
    // На мобильных добавляем небольшой отступ после скролла
    if (isMobile) {
      setTimeout(() => {
        window.scrollTo({
          top: window.pageYOffset - 10,
          behavior: 'smooth'
        });
      }, 600);
    }
  };
});
