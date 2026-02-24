// Custom Cursor Glow Logic
// ==========================================
// HIỆU ỨNG DẢI MÀU ĐUỔI THEO CHUỘT (TRAIL)
// ==========================================
const dots = [];
const numDots = 20; // Số lượng đốt (Tăng lên nếu muốn đuôi dài hơn)

// Tự động tạo các thẻ div làm đốt của dải màu
for (let i = 0; i < numDots; i++) {
  const dot = document.createElement("div");
  dot.className = "cursor-glow";
  document.body.appendChild(dot);
  dots.push({
    x: 0,
    y: 0,
    element: dot,
  });
}

let mouseX = 0;
let mouseY = 0;

// Lấy tọa độ chuột
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Hàm tạo chuyển động rượt đuổi
function animateTrail() {
  let x = mouseX;
  let y = mouseY;

  dots.forEach((dot, index) => {
    // Tốc độ đuổi: 0.3 (càng nhỏ đuôi càng dài và lơi ra)
    dot.x += (x - dot.x) * 0.3;
    dot.y += (y - dot.y) * 0.3;

    // Tính toán để đốt nhỏ dần và mờ dần về cuối đuôi
    const scale = (numDots - index) / numDots;
    const opacity = (numDots - index) / numDots;

    dot.element.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${scale})`;
    dot.element.style.opacity = opacity;

    // Cập nhật tọa độ để đốt tiếp theo rượt theo đốt hiện tại
    x = dot.x;
    y = dot.y;
  });

  requestAnimationFrame(animateTrail); // Lặp lại liên tục 60 khung hình/giây
}

// Kích hoạt hiệu ứng
animateTrail();

document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinksList = document.querySelector(".nav-links");

  // Intersection Observer for scroll reveals
  const revealElements = document.querySelectorAll(".reveal-item");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Play animation only once
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // Smooth scrolling with offset for sticky header
  const headerOffset = 100; // Adjust this based on your sticky nav height + some padding

  navButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const targetTabId = btn.getAttribute("data-tab");
      const targetElement = document.getElementById(targetTabId);

      if (targetElement) {
        // Re-trigger tabFadeIn animation
        targetElement.classList.remove("active");
        void targetElement.offsetWidth; // trigger reflow
        targetElement.classList.add("active");

        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }

      // On mobile, close menu after clicking
      if (window.innerWidth <= 768 && navLinksList.classList.contains("show")) {
        navLinksList.classList.remove("show");
      }
    });
  });

  // Scroll spy: update active nav link based on scroll position
  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.scrollY + headerOffset + 50; // Add offset to trigger slightly earlier

    tabContents.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      // Check if scroll position is within this section
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    // Fallback for bottom of the page (to select the last item if we can't scroll further)
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 10
    ) {
      current = tabContents[tabContents.length - 1].getAttribute("id");
    }

    if (current) {
      navButtons.forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-tab") === current) {
          btn.classList.add("active");
        }
      });
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinksList.classList.toggle("show");
    });
  }

  // Contact form dummy submission
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector(".submit-btn");
      const originalText = btn.innerHTML;

      btn.innerHTML = 'Sent Successfully! <i class="ph ph-check"></i>';
      btn.style.backgroundColor = "#a8e6cf"; // Success color
      btn.style.color = "#0a0a0a";

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
        contactForm.reset();
      }, 3000);
    });
  }
});
