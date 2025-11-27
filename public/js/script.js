const logSign = document.querySelector(".userReg");
const userContainer = document.querySelector(".user-container");

let hideTimeout;

if (logSign && userContainer) {
    
    userContainer.addEventListener("mouseenter", () => {
        clearTimeout(hideTimeout);
        logSign.classList.add("visible");
    });

    logSign.addEventListener("mouseenter", () => {
        clearTimeout(hideTimeout);
        logSign.classList.add("visible");
    });

    userContainer.addEventListener("mouseleave", () => {
        hideTimeout = setTimeout(() => {
            logSign.classList.remove("visible");
        }, 300);
    });

    logSign.addEventListener("mouseleave", () => {
        hideTimeout = setTimeout(() => {
            logSign.classList.remove("visible");
        }, 300);
    });
}



// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

 // Scroll animations
 const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.place-card, .feature-item, .stat-item').forEach(el => {
  observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});