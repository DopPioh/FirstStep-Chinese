const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  console.log('REGISTER BODY:', req.body); // DEBUG
  const { name, email, password, phone, lineId } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      phone,
      lineId,
      passwordHash: hashedPassword
    });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
  // ส่งข้อมูลเพิ่ม
  res.json({
    token,
    name: user.name,
    email: user.email,
    phone: user.phone,
    lineId: user.lineId
  });
};

exports.logout = (req, res) => {
  // ถ้าใช้ cookie: res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'No user with that email' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 หลัก
  user.resetOTP = otp;
  user.resetOTPExpire = Date.now() + 1000 * 60 * 10; // 10 นาที
  await user.save();
  await sendOTP(email, otp);
  res.json({ message: 'OTP sent to your email' });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email, resetOTP: otp, resetOTPExpire: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.resetOTP || !user.resetOTPExpire) {
    return res.status(400).json({ message: 'ไม่พบข้อมูล OTP' });
  }
  if (user.resetOTP !== otp) {
    return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
  }
  if (user.resetOTPExpire < Date.now()) {
    return res.status(400).json({ message: 'OTP หมดอายุ' });
  }
  // OTP ถูกต้อง
  return res.json({ message: 'OTP ถูกต้อง' });
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ต้องมี middleware auth ตรวจสอบ token
    const { name, email, phone, lineId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, lineId },
      { new: true }
    );
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      lineId: user.lineId
    });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

async function sendOTP(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('Preparing to send OTP to', email);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 รหัส OTP สำหรับรีเซ็ตรหัสผ่าน - FirstStep Chinese',
      html: `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: 'Noto Sans Thai', Arial, sans-serif; background: #fff;">
      <tr>
        <td align="center" style="padding: 32px 0 8px 0;">
          <img src="https://www.firststepchinese.com/img/logo/1.png" alt="FirstStep Chinese" width="80" style="display:block;margin-bottom:16px;">
          <h1 style="color:#d32f2f;margin:0 0 16px 0;">รีเซ็ตรหัสผ่าน</h1>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 8px 0 24px 0;">
          <div style="font-size:18px;color:#222;margin-bottom:16px;">
            โปรดใช้รหัส OTP ด้านล่างนี้เพื่อรีเซ็ตรหัสผ่านของคุณ
          </div>
          <div style="background:#fff;border-radius:8px;display:inline-block;padding:24px 40px;border:2px dashed #d32f2f;">
            <span style="font-size:36px;font-weight:bold;color:#d32f2f;letter-spacing:8px;">${otp}</span>
          </div>
          <div style="font-size:15px;color:#555;margin-top:16px;">
            รหัสนี้มีอายุ 10 นาที
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 24px 0 24px; color:#444; font-size:18px;">
          หากคุณไม่ได้ทำรายการนี้ กรุณาเพิกเฉยต่ออีเมลนี้<br> 
          หากคุณมีคำถามหรือต้องการความช่วยเหลือเพิ่มเติม สามารถติดต่อทีมงานของเราได้ที่อีเมลด้านล่างนี้<br>
          <br>
          ขอขอบคุณที่ไว้วางใจเลือกเรียนภาษาจีนกับ FirstStep Chinese<br>
          <br>
          <b>ทีมงาน FirstStep Chinese</b><br>
          🌐 www.firststepchinese.com<br>
          📧 firststepchinese.learning@gmail.com
        </td>
      </tr>
    </table>
  `
    });
    console.log('OTP sent!');
  } catch (err) {
    console.error('Send OTP error:', err);
    throw err; // เพิ่มบรรทัดนี้เพื่อให้ backend ส่ง error 500 กลับไป
  }
}


