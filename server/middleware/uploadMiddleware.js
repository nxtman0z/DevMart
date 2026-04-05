const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'devmart/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'devmart/files',
    resource_type: 'raw',
    allowed_formats: ['zip', 'rar', '7z', 'gz'],
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'devmart/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

const uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('previewImages', 4);

const uploadFile = multer({
  storage: fileStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
}).single('productFile');

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('avatar');

// Combined upload for product creation
const uploadProductFiles = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
}).fields([
  { name: 'previewImages', maxCount: 4 },
  { name: 'productFile', maxCount: 1 },
]);

module.exports = { uploadImages, uploadFile, uploadAvatar, uploadProductFiles };
