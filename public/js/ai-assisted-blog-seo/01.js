function toggleFaq(button) {
      const item = button.closest('.faq-item');
      const panel = item.querySelector('.faq-answer-panel');
      const isOpen = item.classList.contains('open');

      // Close all other FAQs for accordion behavior
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
          }
        }
      });

      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        item.classList.remove('open');
        panel.style.maxHeight = null;
      }
    }

    function toggleMobileNav() {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        if (navLinks.style.display === 'flex') {
          navLinks.style.display = 'none';
        } else {
          navLinks.style.display = 'flex';
          navLinks.style.flexDirection = 'column';
          navLinks.style.position = 'absolute';
          navLinks.style.top = '72px';
          navLinks.style.left = '0';
          navLinks.style.right = '0';
          navLinks.style.background = '#ffffff';
          navLinks.style.padding = '24px';
          navLinks.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
        }
      }
    }
