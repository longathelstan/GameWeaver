import { create } from 'zustand';

export type TreeData = {
    value: string;
    label: string;
    children?: TreeData[];
};

export type Question = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
};

export type GameSuggestion = {
    type: string;
    title: string;
    description: string;
    reason: string;
};

interface AppState {
    currentStep: number;
    setCurrentStep: (step: number) => void;

    // Step 1: Data
    treeData: TreeData[];
    setTreeData: (data: TreeData[]) => void;
    selectedTopics: string[];
    setSelectedTopics: (topics: string[]) => void;

    // Step 2: Questions
    questions: Question[];
    setQuestions: (questions: Question[]) => void;
    updateQuestion: (id: string, updatedQuestion: Partial<Question>) => void;

    // Step 3: Game Selection
    gameSuggestions: GameSuggestion[];
    setGameSuggestions: (suggestions: GameSuggestion[]) => void;
    selectedGameType: string | null;
    setSelectedGameType: (type: string | null) => void;
    customGamePrompt: string;
    setCustomGamePrompt: (prompt: string) => void;

    // Step 4: Code
    generatedCode: string;
    setGeneratedCode: (code: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentStep: 1,
    setCurrentStep: (step) => set({ currentStep: step }),

    treeData: [],
    setTreeData: (data) => set({ treeData: data }),
    selectedTopics: [],
    setSelectedTopics: (topics) => set({ selectedTopics: topics }),

    questions: [],
    setQuestions: (questions) => set({ questions }),
    updateQuestion: (id, updatedQuestion) =>
        set((state) => ({
            questions: state.questions.map((q) =>
                q.id === id ? { ...q, ...updatedQuestion } : q
            ),
        })),

    gameSuggestions: [],
    setGameSuggestions: (suggestions) => set({ gameSuggestions: suggestions }),
    selectedGameType: null,
    setSelectedGameType: (type) => set({ selectedGameType: type }),
    customGamePrompt: '',
    setCustomGamePrompt: (prompt) => set({ customGamePrompt: prompt }),

    generatedCode: '',
    setGeneratedCode: (code) => set({ generatedCode: code }),
}));
