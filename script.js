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

      // On mobile/tablet, close sidebar after clicking a tab
      const sidebar = document.querySelector(".sidebar");
      const sidebarOverlay = document.querySelector(".sidebar-overlay");
      const closeSidebarBtn = document.querySelector(".close-sidebar-btn");

      if (
        window.innerWidth <= 1024 &&
        sidebar &&
        sidebar.classList.contains("show")
      ) {
        sidebar.classList.remove("show");
        sidebarOverlay.classList.remove("show");
        closeSidebarBtn.classList.add("d-none");
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

  // Mobile menu / Sidebar toggle logic
  const sidebar = document.querySelector(".sidebar");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");
  const closeSidebarBtn = document.querySelector(".close-sidebar-btn");

  if (mobileMenuBtn && sidebar && sidebarOverlay && closeSidebarBtn) {
    const toggleSidebar = () => {
      sidebar.classList.toggle("show");
      sidebarOverlay.classList.toggle("show");
      closeSidebarBtn.classList.toggle("d-none");
    };

    mobileMenuBtn.addEventListener("click", toggleSidebar);
    closeSidebarBtn.addEventListener("click", toggleSidebar);
    sidebarOverlay.addEventListener("click", toggleSidebar);
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

  // ==========================================
  // EASTER EGG: M-T-P MODE (KEYBOARD EVENT QUEUEING)
  // ==========================================

  // 1. Khởi tạo mảng hàng đợi lưu lịch sử phím gõ
  const keyQueue = [];
  // 2. Định nghĩa chuỗi mật mã
  const secretCode = ["m", "t", "p"];

  // Biến cờ để ngăn chặn trigger liên tục khi đang ở MTP mode
  let isMtpModeActive = false;

  window.addEventListener("keydown", (e) => {
    // Chỉ lấy phím chữ/số cơ bản, bỏ qua các phím điều khiển (Shift, Ctrl, v.v.)
    if (e.key.length === 1) {
      const key = e.key.toLowerCase();

      // Đẩy phím mới gõ vào cuối hàng đợi
      keyQueue.push(key);

      // Giữ cho độ dài hàng đợi không bao giờ vượt quá chiều dài mật mã
      // Bằng cách đẩy phần tử rác cũ nhất ở đầu (shift) ra khỏi mảng
      if (keyQueue.length > secretCode.length) {
        keyQueue.shift();
      }

      // So sánh: Nối mảng thành chuỗi để kiểm tra trùng khớp
      if (keyQueue.join("") === secretCode.join("")) {
        toggleMtpMode();
        // Xóa mảng để tránh trigger lại ngay lập tức nếu user gõ tiếp chữ p
        keyQueue.length = 0;
      }
    }
  });

  // Biến toàn cục để lưu trữ audio, giúp dừng nhạc khi tắt mode
  let mtpAudio = null;

  function toggleMtpMode() {
    // Tránh spam
    if (isMtpModeActive) {
      document.body.classList.remove("mtp-mode");
      isMtpModeActive = false;
      if (mtpAudio) {
        mtpAudio.pause(); // Dừng nhạc khi thoát MTP mode
        mtpAudio.currentTime = 0;
      }
      return;
    }

    isMtpModeActive = true;

    // 3. Đổi giao diện
    document.body.classList.add("mtp-mode");

    // 4. Phát âm thanh (Web Audio API siêu cơ bản)
    // Sửa lại đường dẫn đúng là thư mục 'audio' (không có s)
    if (!mtpAudio) {
      mtpAudio = new Audio("./assets/audio/making-my-way-ST.mp3");
      mtpAudio.volume = 0.5;
    }
    mtpAudio
      .play()
      .catch((err) => console.log("Audio autoplay prevented by browser"));

    // 5. Hiển thị Toast Notification (Dynamic DOM Manipulation)
    showEasterEggToast(
      "🎵 Âm nhạc kết nối tâm hồn! Chào mừng đến với không gian riêng của tôi.",
    );
  }

  function showEasterEggToast(message) {
    // Setup nếu toast đã tồn tại thì xóa để tạo mới (chống trùng lặp DOM)
    let existingToast = document.querySelector(".easter-egg-toast");
    if (existingToast) {
      existingToast.remove();
    }

    // Tạo khối DOM
    const toast = document.createElement("div");
    toast.className = "easter-egg-toast";
    toast.innerHTML = `
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,41.25l-80-24A8,8,0,0,0,136,24.89V128a48,48,0,1,0,16,35.83V70.09L218.34,90.2a8,8,0,0,0,9.66-7.73V49A8,8,0,0,0,229.66,41.25ZM152,163.83A32,32,0,1,1,120,131.83,32,32,0,0,1,152,163.83ZM212,73.57l-60-18V41.09l60,18Z"></path></svg>
      <div>${message}</div>
    `;

    document.body.appendChild(toast);

    // Dùng setTimeout cực ngắn để ép trình duyệt render class rác trước khi add class .show
    // Mẹo trigger CSS Transition cho thẻ vừa thêm vào (Reflow hook)
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Tự động gỡ bỏ sau 5 giây
    setTimeout(() => {
      toast.classList.remove("show");
      // Đợi slide out xong (0.6s) rồi xóa hẳn khỏi DOM giải phóng rác RAM
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 600);
    }, 5000);
  }
});
