const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  lessons: [{ title: String, videoUrl: String, isFreePreview: Boolean }]
}, { timestamps: true });
module.exports = mongoose.model('Course', courseSchema);
