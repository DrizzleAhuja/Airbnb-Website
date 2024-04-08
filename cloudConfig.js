const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Set up multer storage with cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

// Initialize multer with cloudinary storage
const uploadit = multer({ storage: storage });

module.exports = { uploadit };
