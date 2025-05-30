// ฟังก์ชันนี้ควรเรียกหลัง login หรือหลัง user profile พร้อมแล้ว
function showProfileMenu() {
    // ดึงข้อมูลจาก localStorage (หรือ API)
    const profileImg = localStorage.getItem('profileAvatar') || "/img/profile/default.png";
    const profileName = localStorage.getItem('name') || "ชื่อผู้ใช้";
    const profileEmail = localStorage.getItem('email') || "email@email.com";

    // ตั้งค่าให้กับ navbar
    document.getElementById('navProfileImg').src = profileImg;
    document.getElementById('profileName').textContent = profileName; // ตรงกับ HTML
    document.getElementById('profileEmail').textContent = profileEmail; // ตรงกับ HTML

    // โชว์เมนู profile (เปลี่ยนจาก d-none)
    document.querySelector('.profile-menu-wrapper').classList.remove('d-none');

    // ซ่อนปุ่ม login/signup
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
}

// เรียกฟังก์ชันเมื่อ login หรือมี user แล้ว
// ตัวอย่าง: ถ้า user login แล้วให้โชว์โปรไฟล์เลย
if(localStorage.getItem('name')) {
    showProfileMenu();
}

// แนะนำเพิ่มใน js/side-menu.js หรือไฟล์ global
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const profileMenu = document.querySelector('.profile-menu-wrapper');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    if (token) {
        // แสดงเมนูโปรไฟล์
        profileMenu.classList.remove('d-none');
        // ซ่อนปุ่มเข้าสู่ระบบ/สมัครสมาชิก
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        // (โหลดข้อมูลผู้ใช้มาแสดงได้ที่นี่)
    } else {
        // ซ่อนเมนูโปรไฟล์
        profileMenu.classList.add('d-none');
        // แสดงปุ่มเข้าสู่ระบบ/สมัครสมาชิก
        if (loginBtn) loginBtn.style.display = '';
        if (signupBtn) signupBtn.style.display = '';
    }
});
