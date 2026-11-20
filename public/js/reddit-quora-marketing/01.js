document.addEventListener('DOMContentLoaded', () => {
      const accordionItems = document.querySelectorAll('.faq-accordion-item');

      accordionItems.forEach(item => {
        const btn = item.querySelector('.faq-accordion-btn');
        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');

          // Close all other items
          accordionItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-accordion-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          // Toggle clicked item
          if (!isOpen) {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
