/* =========================================================
   TheVuntgram — лендинг: тема, меню, анимации, демо-чат
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const body       = document.body;
  const themeBtn   = document.getElementById('theme-toggle');
  const logo       = document.getElementById('app-logo');
  const footerLogo = document.getElementById('footer-logo');
  const burger     = document.getElementById('burger');
  const mobileNav  = document.getElementById('mobileNav');
  const header     = document.getElementById('siteHeader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ТЕМА ---------- */
  const applyTheme = (dark) => {
    body.classList.toggle('dark', dark);
    const src = dark ? '2qq.png' : '32.png';
    if (logo) {
      logo.src = src;
      logo.style.filter = dark ? 'drop-shadow(0 2px 2px rgba(0,0,0,.6))' : 'none';
    }
    if (footerLogo) footerLogo.src = src;
    if (themeBtn) themeBtn.textContent = dark ? '☀️' : '🌙';
  };

  applyTheme(localStorage.getItem('theme') === 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const dark = !body.classList.contains('dark');
      applyTheme(dark);
      localStorage.setItem('theme', dark ? 'dark' : 'gray');
    });
  }

  /* ---------- МОБИЛЬНОЕ МЕНЮ ---------- */
  const closeNav = () => {
    mobileNav.classList.remove('open');
    burger.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  };

  if (burger && mobileNav) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', open);
      mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && e.target !== burger) closeNav();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- ХЕДЕР + ПРОГРЕСС СКРОЛЛА + КНОПКА "НАВЕРХ" ---------- */
  /* активная ссылка в меню */
  const sections = ['about', 'features', 'faq', 'support'].map(id => document.getElementById(id)).filter(Boolean);
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  function highlightNav(y) {
    const offset = y + (header ? header.offsetHeight + 40 : 100);
    let currentId = null;
    sections.forEach(s => { if (s.offsetTop <= offset) currentId = s.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + currentId));
  }

  const progress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');

  const onScroll = () => {
    const y = window.pageYOffset;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 500);
    highlightNav(y);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeNav();
      const headerH = header ? header.offsetHeight : 64;
      const top = window.pageYOffset + target.getBoundingClientRect().top - headerH - 14;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ НА СКРОЛЛЕ ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const siblings = Array.from(en.target.parentElement.children).filter(c => c.classList.contains('reveal'));
        const idx = Math.max(0, siblings.indexOf(en.target));
        en.target.style.transitionDelay = Math.min(idx * 80, 480) + 'ms';
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- СЧЁТЧИКИ В HERO ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (target === 0) { el.textContent = '0'; return; }
    const duration = 1300;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { runCounter(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count);
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const willOpen = !item.classList.contains('active');

      // закрываем остальные (аккордеон)
      document.querySelectorAll('.faq-item.active').forEach(other => {
        if (other === item) return;
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = '0px';
      });

      item.classList.toggle('active', willOpen);
      answer.style.maxHeight = willOpen ? (answer.scrollHeight + 24) + 'px' : '0px';
    });
  });
  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.active .faq-answer').forEach(a => {
      a.style.maxHeight = (a.scrollHeight + 24) + 'px';
    });
  });

  /* ---------- ДЕМО-ЧАТ ---------- */
  const chat   = document.getElementById('phoneChat');
  const typing = document.getElementById('typingBubble');
  const input  = document.getElementById('demoInput');
  const send   = document.getElementById('demoSend');
  const status = document.getElementById('chatStatus');

  const scrollChat = () => { if (chat) chat.scrollTop = chat.scrollHeight; };
  const nowTime = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };

  /* поочерёдное появление заготовленных сообщений */
  if (chat) {
    const preset = Array.from(chat.querySelectorAll('.message'));
    const playPreset = () => {
      preset.forEach((m, i) => {
        setTimeout(() => {
          if (typing) typing.classList.remove('active');
          m.classList.add('shown');
          scrollChat();
          // "печатает..." перед следующим входящим
          const next = preset[i + 1];
          if (next && next.classList.contains('message-incoming') && typing) {
            setTimeout(() => { typing.classList.add('active'); scrollChat(); }, 320);
          }
        }, 500 + i * 1200);
      });
      setTimeout(() => { if (typing) typing.classList.remove('active'); }, 500 + preset.length * 1200);
    };

    if (reduceMotion) {
      preset.forEach(m => m.classList.add('shown'));
    } else if ('IntersectionObserver' in window) {
      const po = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => { if (en.isIntersecting) { playPreset(); obs.unobserve(en.target); } });
      }, { threshold: 0.3 });
      po.observe(chat);
    } else {
      playPreset();
    }
  }

  /* можно написать прямо в демо — придёт "ответ" */
  const replies = [
    'Ага, тут так же удобно, как в приложении 😄',
    'Кстати, регистрация — по коду из школы',
    'Скинь это в группу, пусть тоже зайдут 🚀',
    'Работает 👍 сообщения приходят мгновенно',
    'Можешь установить как приложение — кнопка ниже 📱'
  ];
  let replyIdx = 0;

  const addMessage = (text, outgoing) => {
    if (!chat) return null;
    const el = document.createElement('div');
    el.className = 'message ' + (outgoing ? 'message-outgoing' : 'message-incoming');
    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = nowTime();
    if (outgoing) {
      const icon = document.createElement('i');
      icon.className = 'fas fa-check-double status-icon';
      time.appendChild(document.createTextNode(' '));
      time.appendChild(icon);
    }
    const content = document.createElement('div');
    content.className = 'message-content';
    const span = document.createElement('span');
    span.className = 'message-text';
    span.textContent = text;
    content.appendChild(span);
    content.appendChild(time);
    el.appendChild(content);
    if (typing && typing.parentNode === chat) chat.insertBefore(el, typing);
    else chat.appendChild(el);
    requestAnimationFrame(() => el.classList.add('shown'));
    scrollChat();
    return el;
  };

  const sendDemo = () => {
    if (!input) return;
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    const el = addMessage(text.slice(0, 300), true);
    input.value = '';
    input.focus();

    // "прочитано"
    setTimeout(() => {
      const icon = el && el.querySelector('.status-icon');
      if (icon) icon.classList.add('read');
    }, 900);

    // ответ собеседника
    setTimeout(() => {
      if (typing) typing.classList.add('active');
      if (status) status.innerHTML = '<span class="online-dot"></span>печатает…';
      scrollChat();
    }, 1100);
    setTimeout(() => {
      if (typing) typing.classList.remove('active');
      if (status) status.innerHTML = '<span class="online-dot"></span>в сети';
      addMessage(replies[replyIdx % replies.length], false);
      replyIdx++;
    }, 2600);
  };

  if (send) send.addEventListener('click', sendDemo);
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendDemo(); } });

  /* лёгкий 3D-наклон телефона за курсором */
  const phone = document.getElementById('phoneFrame');
  if (phone && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const wrapper = phone.parentElement;
    wrapper.addEventListener('mousemove', (e) => {
      const r = phone.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      phone.style.transform = `perspective(1000px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg) translateY(-6px)`;
      phone.style.animationPlayState = 'paused';
    });
    wrapper.addEventListener('mouseleave', () => {
      phone.style.transform = '';
      phone.style.animationPlayState = 'running';
    });
  }

  /* ---------- КНОПКА "УСТАНОВИТЬ": ripple ---------- */
  const installBtn = document.getElementById('showInstall');
  if (installBtn) {
    let ripple = null;
    const createRipple = (x, y) => {
      if (ripple && ripple.parentNode) ripple.remove();
      const rect = installBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.4;
      ripple = document.createElement('span');
      Object.assign(ripple.style, {
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        left: (x - rect.left - size / 2) + 'px',
        top: (y - rect.top - size / 2) + 'px',
        background: 'radial-gradient(circle, rgba(255,255,255,.9) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'scale(0)',
        opacity: '1',
        transition: 'transform .6s ease-out, opacity .8s ease-out',
        zIndex: '0'
      });
      installBtn.appendChild(ripple);
      requestAnimationFrame(() => { ripple.style.transform = 'scale(1)'; ripple.style.opacity = '0'; });
    };

    installBtn.addEventListener('pointerenter', (e) => {
      createRipple(e.clientX, e.clientY);
      installBtn.style.background = body.classList.contains('dark') ? '#1f1f22' : '#ffffff';
      installBtn.style.color = getComputedStyle(body).getPropertyValue('--primary');
    });
    installBtn.addEventListener('pointerleave', () => {
      installBtn.style.background = '';
      installBtn.style.color = '';
      if (ripple) { ripple.style.opacity = '0'; setTimeout(() => ripple && ripple.remove(), 500); }
    });
    installBtn.addEventListener('click', () => {
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      alert(isIOS
        ? 'Открой меню «Поделиться» в Safari и выбери «На экран «Домой»» — Vuntgram запустится как приложение.'
        : 'Открой меню браузера (⋮) и выбери «Установить приложение» / «Добавить на главный экран».');
    });
  }

  /* ---------- 3D-КАРУСЕЛЬ СКРИНШОТОВ ---------- */
  const carousel = document.querySelector('.carousel-3d');
  if (carousel) {
    let isMobile = window.innerWidth <= 768;
    let slides = [];
    let current = 1;
    let autoScroll = null;

    const pick = () => Array.from(carousel.querySelectorAll(isMobile ? '.mobile-screenshot' : '.desktop-screenshot'));

    const updatePositions = () => {
      const all = Array.from(carousel.querySelectorAll('img'));
      all.forEach(img => {
        img.classList.remove('left', 'center', 'right');
        img.style.opacity = '';
        img.style.transform = '';
      });
      if (!slides.length) return;
      const left = (current - 1 + slides.length) % slides.length;
      const right = (current + 1) % slides.length;
      slides[left].classList.add('left');
      slides[current].classList.add('center');
      slides[right].classList.add('right');
    };

    const next = () => { current = (current - 1 + slides.length) % slides.length; updatePositions(); };
    const prev = () => { current = (current + 1) % slides.length; updatePositions(); };

    const start = () => { stop(); if (!reduceMotion) autoScroll = setInterval(next, 5000); };
    const stop  = () => { if (autoScroll) clearInterval(autoScroll); autoScroll = null; };

    const rebuild = () => { isMobile = window.innerWidth <= 768; slides = pick(); current = Math.min(current, Math.max(slides.length - 1, 0)); updatePositions(); };

    rebuild();
    start();

    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(rebuild, 220); });

    // пауза, когда карусель не видна
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach(en => en.isIntersecting ? start() : stop());
      }, { threshold: 0.15 }).observe(carousel);
    }

    // свайпы
    let startX = 0, startY = 0, scrolling = false;
    carousel.addEventListener('touchstart', (e) => {
      stop();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      scrolling = false;
    }, { passive: true });
    carousel.addEventListener('touchmove', (e) => {
      if (!scrolling) {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        scrolling = dy > dx;
      }
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      if (!scrolling) {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff > 60) prev();
        else if (diff < -60) next();
      }
      start();
    });
  }
});
