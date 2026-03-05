import React, { useState, useEffect } from 'react';
import { useAppStore, Question } from '@/lib/store';
import { generateQuestions, saveQuestionBank } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, RefreshCw, ArrowRight, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const Step2Questions = () => {
    const { selectedTopics, selectedBookId, questions, setQuestions, updateQuestion, setCurrentStep } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (selectedTopics.length > 0 && questions.length === 0) {
            handleGenerateQuestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGenerateQuestions = async () => {
        if (!selectedBookId) {
            setError('Không tìm thấy bookId. Vui lòng quay lại chọn sách.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSaveSuccess(false);
        try {
            const data = await generateQuestions(selectedTopics, selectedBookId, 5);
            setQuestions(data.questions);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Không thể tạo câu hỏi.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveQuestionBank = async () => {
        if (questions.length === 0) return;
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            const bankName = `Ngân hàng - ${selectedTopics.slice(0, 2).join(', ')} (${new Date().toLocaleDateString('vi-VN')})`;
            await saveQuestionBank(bankName, questions);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 4000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Không thể lưu.';
            setError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-2xl font-bold">2. Xem lại & Chỉnh sửa Câu hỏi</h2>
                <div className="flex gap-2">
                    <Button onClick={handleGenerateQuestions} disabled={isLoading || isSaving} variant="outline">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Tạo lại
                    </Button>
                    <Button
                        onClick={handleSaveQuestionBank}
                        disabled={questions.length === 0 || isSaving || isLoading}
                        variant="secondary"
                    >
                        {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : saveSuccess ? (
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {saveSuccess ? 'Đã lưu!' : 'Lưu ngân hàng câu hỏi'}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            {isLoading && questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 gap-3 text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p>Đang tạo câu hỏi từ AI...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {questions.map((q, index) => (
                        <Card key={q.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 shrink-0">
                                        {index + 1}
                                    </span>
                                    Câu hỏi {index + 1}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Nội dung câu hỏi</label>
                                    <Textarea
                                        value={q.question}
                                        onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt, optIndex) => (
                                        <div key={optIndex} className="flex items-center space-x-2">
                                            <div
                                                className={`w-4 h-4 rounded-full border-2 shrink-0 ${opt === q.correctAnswer
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'border-gray-300'
                                                    }`}
                                            />
                                            <Input
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOptions = [...q.options];
                                                    newOptions[optIndex] = e.target.value;
                                                    updateQuestion(q.id, { options: newOptions });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Đáp án đúng</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={q.correctAnswer}
                                        onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                                    >
                                        {q.options.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={questions.length === 0 || isLoading}
                    size="lg"
                >
                    Duyệt & Tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Step2Questions;
