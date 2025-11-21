import { Router } from 'express';
import { ingestDataController } from '../controllers/dataController';
import upload from '../middlewares/multer';

const router = Router();

router.post('/ingest-data', upload.single('file'), ingestDataController);

export default router;
