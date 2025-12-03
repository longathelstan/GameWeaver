import React, { useState, useEffect } from 'react';
import { useAppStore, Question } from '@/lib/store';
import { getEnv } from '@/lib/env';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, RefreshCw, ArrowRight, Check } from 'lucide-react';

const Step2Questions = () => {
    const { selectedTopics, questions, setQuestions, updateQuestion, setCurrentStep } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedTopics.length > 0 && questions.length === 0) {
            generateQuestions();
        }
    }, []);

    const generateQuestions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${getEnv('NEXT_PUBLIC_BACKEND_URL')}/api/generate-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topics: selectedTopics, quantity: 5 }),
            });
            const data = await res.json();
            if (res.ok) {
                setQuestions(data.questions);
            }
        } catch (error) {
            console.error('Error generating questions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">2. Xem lại & Chỉnh sửa Câu hỏi</h2>
                <Button onClick={generateQuestions} disabled={isLoading} variant="outline">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Tạo lại tất cả
                </Button>
            </div>

            {isLoading && questions.length === 0 ? (
                <div className="flex justify-center p-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {questions.map((q, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">
                                        {index + 1}
                                    </span>
                                    Câu hỏi {index + 1}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Nội dung câu hỏi</label>
                                    <Textarea
                                        value={q.question}
                                        onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt, optIndex) => (
                                        <div key={optIndex} className="flex items-center space-x-2">
                                            <div className={`w-4 h-4 rounded-full border ${opt === q.correctAnswer ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
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
                                    <label className="text-sm font-medium">Đáp án đúng</label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <Button onClick={() => setCurrentStep(3)} size="lg">
                    Duyệt & Tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Step2Questions;
