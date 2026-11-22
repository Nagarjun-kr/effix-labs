function toggleFaq(button) {
      const item = button.closest('.faq-item');
      const panel = item.querySelector('.faq-answer-panel');
      const isOpen = item.classList.contains('open');

      // Close all other FAQs for accordion behavior
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
          }
        }
      });

      button.setAttribute('aria-expanded', String(!isOpen));
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

    function handleGbpSubmit(e) {
      e.preventDefault();
      const form = document.getElementById('gbpEnquiryForm');
      const feedback = document.getElementById('formFeedback');
      const btn = document.getElementById('submitBtn');

      const name = document.getElementById('fullName').value;
      const email = document.getElementById('workEmail').value;
      const business = document.getElementById('businessName').value;
      const website = document.getElementById('websiteUrl').value || 'Not provided';
      const locations = document.getElementById('locationCount').value;
      const msg = document.getElementById('message').value;

      const subject = encodeURIComponent("Google Business Profile Optimisation Enquiry - " + business);
      const body = encodeURIComponent(
        "Full Name: " + name + "\n" +
        "Work Email: " + email + "\n" +
        "Business Name: " + business + "\n" +
        "Website: " + website + "\n" +
        "Locations: " + locations + "\n\n" +
        "Requirements:\n" + msg
      );

      feedback.style.display = 'block';
      feedback.style.background = 'rgba(168, 85, 247, 0.15)';
      feedback.style.color = '#d8b4fe';
      feedback.style.border = '1px solid rgba(168, 85, 247, 0.3)';
      feedback.innerHTML = "Opening email client to send your enquiry to <strong>hello@effixlabs.in</strong>...";

      window.location.href = "mailto:hello@effixlabs.in?subject=" + subject + "&body=" + body;
    }
