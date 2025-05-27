// แสดง/ซ่อนรหัสผ่าน
function togglePassword(inputId, iconId) {
    let input = document.getElementById(inputId);
    let icon = document.getElementById(iconId);
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
    }
}

// ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
function validatePassword() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let errorText = document.getElementById("passwordError");

    if (password !== confirmPassword) {
        errorText.classList.remove("d-none");
        return false; // ป้องกันการส่งฟอร์ม
    } else {
        errorText.classList.add("d-none");
        return true; // อนุญาตให้ส่งฟอร์ม
    }
}

