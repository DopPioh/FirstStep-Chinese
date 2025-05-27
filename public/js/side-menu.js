// กำหนด active class ให้กับเมนูที่ตรงกับ URL ปัจจุบัน
document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add("active");
    }
});

// แสดงชื่อและอีเมลใน dropdown
document.addEventListener('DOMContentLoaded', function() {
  const name = localStorage.getItem('name') || 'ชื่อผู้ใช้';
  const email = localStorage.getItem('email') || 'email@email.com';
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileEmail').textContent = email;
});

// Logout จากเมนู
document.getElementById('logoutMenuBtn').onclick = function() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  window.location.href = '/login.html';
};

// Theme toggle (ตัวอย่าง)
document.getElementById('themeToggleBtn').onclick = function() {
  document.body.classList.toggle('dark-mode');
};

function updateAuthUI() {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email') || 'email@email.com';

  // ปุ่ม login/signup
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  if (loginBtn) loginBtn.style.display = token ? 'none' : '';
  if (signupBtn) signupBtn.style.display = token ? 'none' : '';

  // เมนูโปรไฟล์
  const profileMenu = document.getElementById('profileMenu');
  if (profileMenu) {
    if (token) {
      profileMenu.classList.remove('d-none');
      document.getElementById('profileName').textContent = name || 'ชื่อผู้ใช้';
      document.getElementById('profileEmail').textContent = email;
    } else {
      profileMenu.classList.add('d-none');
    }
  }
}
document.addEventListener('DOMContentLoaded', updateAuthUI);