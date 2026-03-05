import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.json') {
        cb(null, true);
    } else {
        cb(new Error('Only .json files are allowed.'));
    }
};

// Max 10MB, JSON files only
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

export default upload;
