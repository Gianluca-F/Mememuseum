import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => { // Specify the directory where files will be stored
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => { // Generate a unique filename using the current timestamp and original name
    const filename = file.originalname
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9._-]/g, ''); // Remove any special characters except for . _ -
    const ext = path.extname(filename).toLowerCase();
    const base = path.basename(filename, ext);
    const uniqueName = `${Date.now()}-${base}${ext}`;
    
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    !allowedTypes.includes(file.mimetype) ||
    !ext.match(/\.(jpg|jpeg|png)$/)
  ) {
    return cb({ status: 400, message: 'Unsupported file type' }, false);
  }

  cb(null, true);
};

export const uploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
});
