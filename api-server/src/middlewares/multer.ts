import multer from 'multer';

// Use memory storage so we can access the buffer directly in the controller
const storage = multer.memoryStorage();

// Create the multer instance
const upload = multer({ storage: storage });

export default upload;
