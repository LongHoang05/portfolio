// Custom Cursor Glow Logic
// ==========================================
// HIỆU ỨNG DẢI MÀU ĐUỔI THEO CHUỘT (TRAIL)
// ==========================================
let dots = [];
const numDots = 20;
let mouseX = 0;
let mouseY = 0;
let trailAnimationId = null;

// Hàm khởi tạo và chạy hiệu ứng chuột
function initCursorTrail() {
  if (window.innerWidth <= 768) return; // Không chạy trên mobile

  // Chỉ tạo DOM ảo nếu chưa có
  if (dots.length === 0) {
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement("div");
      dot.className = "cursor-glow";
      document.body.appendChild(dot);
      dots.push({ x: 0, y: 0, element: dot });
    }

    // Đăng ký event một lần
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }

  // Nếu đang không chạy (hoặc bị dừng trước đó), kích hoạt lại
  if (!trailAnimationId) {
    const animateTrail = () => {
      let x = mouseX;
      let y = mouseY;

      dots.forEach((dot, index) => {
        dot.x += (x - dot.x) * 0.3;
        dot.y += (y - dot.y) * 0.3;
        const scale = (numDots - index) / numDots;
        const opacity = (numDots - index) / numDots;
        dot.element.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${scale})`;
        dot.element.style.opacity = opacity;
        x = dot.x;
        y = dot.y;
      });

      trailAnimationId = requestAnimationFrame(animateTrail);
    };

    animateTrail();
  }
}

// Hàm dọn dẹp bộ nhớ trên mobile
function destroyCursorTrail() {
  if (trailAnimationId) {
    cancelAnimationFrame(trailAnimationId);
    trailAnimationId = null;
  }
  // Xóa thẻ DOM khỏi HTML
  dots.forEach((dot) => {
    if (dot.element && dot.element.parentNode) {
      dot.element.parentNode.removeChild(dot.element);
    }
  });
  dots = []; // Xóa Array để giải phóng bộ nhớ
}

// Chạy lần đầu
initCursorTrail();

// Lắng nghe sự kiện xoay ngang/dọc điện thoại hoặc kéo thả cửa sổ Resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    destroyCursorTrail(); // Tắt hoàn toàn Tracking tọa độ, giải phóng DOM/RAM
  } else {
    initCursorTrail(); // Bật lại nếu kéo màn hình ra to
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Reset scroll position on refresh
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const navButtons = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinksList = document.querySelector(".nav-links");

  // ==========================================
  // SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal-item");

  const revealOptions = {
    root: null,
    rootMargin: "0px 0px -50px 0px", // Kích hoạt khi phần tử nhô lên 50px từ đáy màn hình
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Ngừng theo dõi sau khi đã hiển thị để tối ưu hiệu năng
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => revealObserver.observe(el));

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

  // ===================== THEME TOGGLE LOGIC =====================
  const themeToggleBtn = document.querySelector(".theme-toggle");
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");

  // Function to apply the theme
  const applyTheme = (isLight) => {
    const reactIcon = document.getElementById("react-icon");
    const mysqlIcon = document.getElementById("mysql-icon");

    if (isLight) {
      document.body.classList.add("light-mode");
      if (sunIcon && moonIcon) {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
      }
      if (reactIcon) reactIcon.src = "assets/imgs/React_light.svg";
      if (mysqlIcon) mysqlIcon.src = "assets/imgs/MySQL_light.svg";
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      if (sunIcon && moonIcon) {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
      }
      if (reactIcon) reactIcon.src = "assets/imgs/React_dark.svg";
      if (mysqlIcon) mysqlIcon.src = "assets/imgs/MySQL_dark.svg";
      localStorage.setItem("theme", "dark");
    }
  };

  // Check Local Storage on Load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    applyTheme(true);
  } else {
    applyTheme(false); // default to dark
  }

  // Toggle button event listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isCurrentlyLight = document.body.classList.contains("light-mode");
      applyTheme(!isCurrentlyLight);
    });
  }
  // =============================================================

  // Contact form dummy submission
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      // 1. Kiểm tra Validate chuẩn HTML5
      if (!contactForm.checkValidity()) {
        return; // Dừng lại ở đây, để trình duyệt tự hiện tooltip báo lỗi trống
      }

      // 2. Chặn load lại trang nếu Validation đã Pass
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
