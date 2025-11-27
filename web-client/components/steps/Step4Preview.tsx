import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Code, RefreshCw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Sandpack } from "@codesandbox/sandpack-react";

const Step4Preview = () => {
    const {
        selectedGameType,
        questions,
        customGamePrompt,
        generatedCode,
        setGeneratedCode
    } = useAppStore();

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (selectedGameType && !generatedCode) {
            generateCode();
        }
    }, []);

    const generateCode = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-game-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameType: selectedGameType,
                    questions,
                    customPrompt: customGamePrompt
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setGeneratedCode(data.code);
            }
        } catch (error) {
            console.error('Error generating code:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([generatedCode], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'GameComponent.tsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">4. Code Preview & Download</h2>
                <div className="space-x-2">
                    <Button onClick={generateCode} disabled={isGenerating} variant="outline">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Regenerate
                    </Button>
                    <Button onClick={handleDownload} disabled={!generatedCode}>
                        <Download className="mr-2 h-4 w-4" /> Download .tsx
                    </Button>
                </div>
            </div>

            {isGenerating && !generatedCode ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">AI is writing your game code...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
                    {/* Code Editor */}
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5" /> Generated Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden rounded-b-lg">
                            <Editor
                                height="100%"
                                defaultLanguage="typescript"
                                value={generatedCode}
                                onChange={(value) => setGeneratedCode(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Preview Area */}
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden rounded-b-lg border-t">
                            <Sandpack
                                template="react"
                                theme="dark"
                                files={{
                                    "/App.js": generatedCode,
                                }}
                                options={{
                                    showNavigator: true,
                                    showTabs: false,
                                    externalResources: ["https://cdn.tailwindcss.com"],
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Step4Preview;
