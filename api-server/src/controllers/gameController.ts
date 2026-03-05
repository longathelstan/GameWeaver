import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

// ── Schemas ───────────────────────────────────────────────────────────────────

const CreateGameSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    gameType: z.string().min(1, 'gameType is required.'),
    code: z.string().min(1, 'Game code is required.'),
    projectId: z.coerce.number().int().positive().default(1),
    questionBankId: z.coerce.number().int().positive().optional(),
});

// ── Controllers ───────────────────────────────────────────────────────────────

export const createGameController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = CreateGameSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.issues.map((e) => e.message).join(', '), 400);
        }
        const { name, gameType, code, projectId, questionBankId } = parsed.data;

        const game = await prisma.game.create({
            data: { name, gameType, code, projectId, questionBankId },
        });

        res.status(201).json({ success: true, game });
    } catch (err) {
        next(err);
    }
};

export const getGamesController = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await prisma.game.findMany({
            select: {
                id: true,
                name: true,
                gameType: true,
                projectId: true,
                questionBankId: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ success: true, games });
    } catch (err) {
        next(err);
    }
};

export const getGameByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError('Invalid ID.', 400);

        const game = await prisma.game.findUnique({ where: { id } });
        if (!game) throw new AppError('Game not found.', 404);

        res.status(200).json({ success: true, game });
    } catch (err) {
        next(err);
    }
};

export const deleteGameController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError('Invalid ID.', 400);

        await prisma.game.delete({ where: { id } }).catch(() => {
            throw new AppError('Game not found.', 404);
        });

        res.status(200).json({ success: true, message: 'Game deleted.' });
    } catch (err) {
        next(err);
    }
};
