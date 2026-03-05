import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

// ── Schemas ───────────────────────────────────────────────────────────────────

const QuestionSchema = z.object({
    id: z.string(),
    question: z.string().min(1),
    options: z.array(z.string()).min(2),
    correctAnswer: z.string().min(1),
});

const CreateQuestionBankSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    questions: z.array(QuestionSchema).min(1, 'At least one question is required.'),
    projectId: z.coerce.number().int().positive().default(1),
});

// ── Controllers ───────────────────────────────────────────────────────────────

export const createQuestionBankController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parsed = CreateQuestionBankSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.issues.map((e) => e.message).join(', '), 400);
        }
        const { name, questions, projectId } = parsed.data;

        const bank = await prisma.questionBank.create({
            data: { name, questions, projectId },
        });

        res.status(201).json({ success: true, questionBank: bank });
    } catch (err) {
        next(err);
    }
};

export const getQuestionBanksController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const banks = await prisma.questionBank.findMany({
            select: { id: true, name: true, createdAt: true, projectId: true },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ success: true, questionBanks: banks });
    } catch (err) {
        next(err);
    }
};

export const getQuestionBankByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError('Invalid ID.', 400);

        const bank = await prisma.questionBank.findUnique({ where: { id } });
        if (!bank) throw new AppError('Question bank not found.', 404);

        res.status(200).json({ success: true, questionBank: bank });
    } catch (err) {
        next(err);
    }
};

export const deleteQuestionBankController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError('Invalid ID.', 400);

        await prisma.questionBank.delete({ where: { id } }).catch(() => {
            throw new AppError('Question bank not found.', 404);
        });

        res.status(200).json({ success: true, message: 'Question bank deleted.' });
    } catch (err) {
        next(err);
    }
};
