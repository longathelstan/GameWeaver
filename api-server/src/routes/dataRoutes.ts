import { Router } from 'express';
import { ingestDataController, getBooksController, getBookDetailsController } from '../controllers/dataController';
import { mapContentController } from '../controllers/mapController';
import {
    generateQuestionsController,
    suggestGameController,
    generateGameCodeController,
    refineGameCodeController,
} from '../controllers/generationController';
import {
    createQuestionBankController,
    getQuestionBanksController,
    getQuestionBankByIdController,
    deleteQuestionBankController,
} from '../controllers/questionBankController';
import {
    createGameController,
    getGamesController,
    getGameByIdController,
    deleteGameController,
} from '../controllers/gameController';
import upload from '../middlewares/multer';
import { aiLimiter } from '../middlewares/rateLimiter';

const router = Router();

// ── Textbook / Data ───────────────────────────────────────────────────────────
router.post('/ingest-data', upload.single('file'), ingestDataController);
router.post('/map-content', mapContentController);
router.get('/books', getBooksController);
router.get('/books/:id', getBookDetailsController);

// ── AI Generation (stricter rate limit) ──────────────────────────────────────
router.post('/generate-questions', aiLimiter, generateQuestionsController);
router.post('/suggest-game', aiLimiter, suggestGameController);
router.post('/generate-game-code', aiLimiter, generateGameCodeController);
router.post('/refine-game-code', aiLimiter, refineGameCodeController);

// ── Question Banks ────────────────────────────────────────────────────────────
router.post('/question-banks', createQuestionBankController);
router.get('/question-banks', getQuestionBanksController);
router.get('/question-banks/:id', getQuestionBankByIdController);
router.delete('/question-banks/:id', deleteQuestionBankController);

// ── Games ─────────────────────────────────────────────────────────────────────
router.post('/games', createGameController);
router.get('/games', getGamesController);
router.get('/games/:id', getGameByIdController);
router.delete('/games/:id', deleteGameController);

export default router;
