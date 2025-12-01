import { Router } from 'express';
import { ingestDataController, getBooksController, getBookDetailsController } from '../controllers/dataController';
import { mapContentController } from '../controllers/mapController';
import { generateQuestionsController, suggestGameController, generateGameCodeController } from '../controllers/generationController';
import upload from '../middlewares/multer';

const router = Router();

router.post('/ingest-data', upload.single('file'), ingestDataController);
router.post('/map-content', mapContentController);
router.post('/generate-questions', generateQuestionsController);
router.post('/suggest-game', suggestGameController);
router.post('/generate-game-code', generateGameCodeController);

router.get('/books', getBooksController);
router.get('/books/:id', getBookDetailsController);

export default router;
