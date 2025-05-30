const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,           // เพิ่มเบอร์โทรศัพท์
  lineId: String,          // เพิ่ม ID Line
  passwordHash: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  resetToken: String,
  resetTokenExpire: Date,
  resetOTP: String,
  resetOTPExpire: Date
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);