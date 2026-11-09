document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach((faq) => {
        faq.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navActions = document.querySelector('.nav-actions');

  if (menuToggle && nav && navActions) {
    menuToggle.addEventListener('click', () => {
      const isVisible = nav.style.display === 'flex';

      nav.style.display = isVisible ? 'none' : 'flex';
      navActions.style.display = isVisible ? 'none' : 'flex';

      nav.style.position = 'absolute';
      nav.style.top = '82px';
      nav.style.left = '50%';
      nav.style.transform = 'translateX(-50%)';
      nav.style.flexDirection = 'column';
      nav.style.background = 'rgba(8, 18, 16, 0.98)';
      nav.style.border = '1px solid rgba(142, 255, 212, 0.15)';
      nav.style.padding = '16px';
      nav.style.borderRadius = '18px';
      nav.style.minWidth = '220px';

      navActions.style.position = 'absolute';
      navActions.style.top = 'calc(82px + 210px)';
      navActions.style.left = '50%';
      navActions.style.transform = 'translateX(-50%)';
      navActions.style.flexDirection = 'column';
      navActions.style.width = '220px';
    });
  }
});

