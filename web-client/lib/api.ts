/**
 * Centralized API client for GameWeaver.
 * All backend interactions go through here — base URL from env, typed errors.
 */

import { getEnv } from './env';

const BASE_URL = () => getEnv('NEXT_PUBLIC_BACKEND_URL');

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Book {
    id: number;
    name: string;
    createdAt: string;
    projectId: number;
}

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface GameSuggestion {
    type: string;
    title: string;
    description: string;
    reason: string;
}

export interface QuestionBank {
    id: number;
    name: string;
    questions?: Question[];
    projectId: number;
    createdAt: string;
}

export interface Game {
    id: number;
    name: string;
    gameType: string;
    code?: string;
    projectId: number;
    questionBankId?: number;
    createdAt: string;
}

// ─── Fetch wrapper ────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL()}/api${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const msg = (data as { message?: string }).message ?? `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data as T;
}

// ─── Books ────────────────────────────────────────────────────────────────────

export async function getBooks(): Promise<{ books: Book[] }> {
    return apiFetch('/books');
}

export async function getBookDetails(id: number): Promise<{ book: { id: number; name: string; structure: unknown; createdAt: string } }> {
    return apiFetch(`/books/${id}`);
}

export async function uploadBook(file: File, projectId = 1): Promise<{ success: boolean; message: string; bookId: number; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', String(projectId));

    const res = await fetch(`${BASE_URL()}/api/ingest-data`, {
        method: 'POST',
        body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const msg = (data as { message?: string }).message ?? `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
}

// ─── Generation ───────────────────────────────────────────────────────────────

export async function generateQuestions(
    topics: string[],
    bookId: number,
    quantity = 5
): Promise<{ questions: Question[] }> {
    return apiFetch('/generate-questions', {
        method: 'POST',
        body: JSON.stringify({ topics, bookId, quantity }),
    });
}

export async function suggestGame(questions: Question[]): Promise<{ suggestions: GameSuggestion[] }> {
    return apiFetch('/suggest-game', {
        method: 'POST',
        body: JSON.stringify({ questions }),
    });
}

export async function generateGameCode(
    gameType: string,
    questions: Question[],
    customPrompt?: string
): Promise<{ code: string }> {
    return apiFetch('/generate-game-code', {
        method: 'POST',
        body: JSON.stringify({ gameType, questions, customPrompt }),
    });
}

export async function refineGameCode(
    currentCode: string,
    instruction: string
): Promise<{ code: string }> {
    return apiFetch('/refine-game-code', {
        method: 'POST',
        body: JSON.stringify({ currentCode, instruction }),
    });
}

// ─── Question Banks ───────────────────────────────────────────────────────────

export async function saveQuestionBank(
    name: string,
    questions: Question[],
    projectId = 1
): Promise<{ questionBank: QuestionBank }> {
    return apiFetch('/question-banks', {
        method: 'POST',
        body: JSON.stringify({ name, questions, projectId }),
    });
}

export async function getQuestionBanks(): Promise<{ questionBanks: QuestionBank[] }> {
    return apiFetch('/question-banks');
}

// ─── Games ────────────────────────────────────────────────────────────────────

export async function saveGame(
    name: string,
    gameType: string,
    code: string,
    projectId = 1,
    questionBankId?: number
): Promise<{ game: Game }> {
    return apiFetch('/games', {
        method: 'POST',
        body: JSON.stringify({ name, gameType, code, projectId, questionBankId }),
    });
}

export async function getGames(): Promise<{ games: Game[] }> {
    return apiFetch('/games');
}

export async function getGameById(id: number): Promise<{ game: Game }> {
    return apiFetch(`/games/${id}`);
}
