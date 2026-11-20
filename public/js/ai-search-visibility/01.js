document.querySelectorAll('.faq-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('is-open');
        
        document.querySelectorAll('.faq-item').forEach(other => {
          other.classList.remove('is-open');
          other.querySelector('.faq-button').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
