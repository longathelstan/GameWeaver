import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Gamepad2, Sparkles, ArrowRight } from 'lucide-react';

const Step3GameSelection = () => {
    const {
        questions,
        gameSuggestions,
        setGameSuggestions,
        selectedGameType,
        setSelectedGameType,
        customGamePrompt,
        setCustomGamePrompt,
        setCurrentStep
    } = useAppStore();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (questions.length > 0 && gameSuggestions.length === 0) {
            getSuggestions();
        }
    }, []);

    const getSuggestions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/suggest-game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions }),
            });
            const data = await res.json();
            if (res.ok) {
                setGameSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error('Error getting suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">3. Choose Game Type</h2>

            <Tabs defaultValue="suggest" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="suggest">AI Suggestions</TabsTrigger>
                    <TabsTrigger value="custom">Custom Request</TabsTrigger>
                </TabsList>

                <TabsContent value="suggest" className="space-y-4 mt-4">
                    {isLoading ? (
                        <div className="flex justify-center p-10">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {gameSuggestions.map((game, index) => (
                                <Card
                                    key={index}
                                    className={`cursor-pointer transition-all hover:border-primary ${selectedGameType === game.type ? 'border-2 border-primary bg-primary/5' : ''}`}
                                    onClick={() => {
                                        setSelectedGameType(game.type);
                                        setCustomGamePrompt(''); // Clear custom prompt if selecting suggestion
                                    }}
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gamepad2 className="h-5 w-5" />
                                            {game.title}
                                        </CardTitle>
                                        <CardDescription>{game.type}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{game.description}</p>
                                        <div className="mt-4 p-2 bg-muted rounded text-xs italic">
                                            " {game.reason} "
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="custom" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Describe your game idea</CardTitle>
                            <CardDescription>
                                Tell the AI exactly what kind of game you want to build with these questions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="e.g., I want a space-themed shooting game where correct answers shoot down asteroids..."
                                className="min-h-[150px]"
                                value={customGamePrompt}
                                onChange={(e) => {
                                    setCustomGamePrompt(e.target.value);
                                    setSelectedGameType('Custom Game');
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={() => setCurrentStep(4)}
                    size="lg"
                    disabled={!selectedGameType}
                >
                    Generate Game Code <Sparkles className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Step3GameSelection;
