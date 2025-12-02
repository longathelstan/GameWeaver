import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Code, Play, Send, Sparkles, RefreshCw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Sandpack } from "@codesandbox/sandpack-react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

const Step4Preview = () => {
    const {
        selectedGameType,
        questions,
        customGamePrompt,
        generatedCode,
        setGeneratedCode
    } = useAppStore();

    const [isGenerating, setIsGenerating] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: 'Chào bạn! Mình là GameWeaver AI. Bạn có muốn chỉnh sửa gì cho game này không?'
        }
    ]);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const generateCode = React.useCallback(async () => {
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
    }, [selectedGameType, questions, customGamePrompt, setGeneratedCode]);

    useEffect(() => {
        if (selectedGameType && !generatedCode) {
            generateCode();
        }
    }, [selectedGameType, generatedCode, generateCode]);

    const handleRefine = async () => {
        if (!chatInput.trim() || isRefining) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: chatInput };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsRefining(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refine-game-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentCode: generatedCode,
                    instruction: userMsg.content
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setGeneratedCode(data.code);
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    content: 'Đã cập nhật game theo yêu cầu của bạn! Hãy kiểm tra bên phần Xem trước nhé.'
                }]);
                // Switch to preview tab to see changes
                setActiveTab('preview');
            } else {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    content: 'Xin lỗi, có lỗi xảy ra khi cập nhật game. Vui lòng thử lại.'
                }]);
            }
        } catch (error) {
            console.error('Error refining code:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: 'Xin lỗi, có lỗi xảy ra khi kết nối với server.'
            }]);
        } finally {
            setIsRefining(false);
        }
    };

    const isHtml = generatedCode?.trim().startsWith('<!DOCTYPE html>') || generatedCode?.trim().startsWith('<html');

    const handleDownload = () => {
        const extension = isHtml ? 'html' : 'tsx';
        const mimeType = isHtml ? 'text/html' : 'text/typescript';
        const blob = new Blob([generatedCode], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GameComponent.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-[calc(100vh-200px)] flex gap-6">
            {/* Left Column: Chat Interface */}
            <div className="w-1/3 flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">GameWeaver Assistant</h3>
                </div>

                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex max-w-[95%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm",
                                    msg.role === 'user'
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isRefining && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm ml-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                AI đang suy nghĩ và sửa code...
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRefine();
                        }}
                        className="flex gap-2"
                    >
                        <Textarea
                            placeholder="Nhập yêu cầu chỉnh sửa..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="min-h-[50px] resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleRefine();
                                }
                            }}
                        />
                        <Button type="submit" size="icon" disabled={isRefining || !chatInput.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Right Column: Preview & Code */}
            <div className="flex-1 flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm">
                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                        <Button
                            variant={activeTab === 'preview' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('preview')}
                            className="text-xs font-medium"
                        >
                            <Play className="w-3 h-3 mr-1.5" /> Preview
                        </Button>
                        <Button
                            variant={activeTab === 'code' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('code')}
                            className="text-xs font-medium"
                        >
                            <Code className="w-3 h-3 mr-1.5" /> Code
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={generateCode} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                            <span className="ml-2 hidden sm:inline">Tạo lại</span>
                        </Button>
                        <Button size="sm" onClick={handleDownload} disabled={!generatedCode}>
                            <Download className="h-3 w-3 mr-1.5" />
                            <span className="hidden sm:inline">Tải xuống</span>
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 relative bg-white dark:bg-zinc-950">
                    {isGenerating && !generatedCode ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-background/80 backdrop-blur-sm">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-lg font-medium text-muted-foreground">Đang khởi tạo thế giới game...</p>
                        </div>
                    ) : null}

                    {activeTab === 'preview' && (
                        <div className="w-full h-full">
                            {isHtml ? (
                                <iframe
                                    srcDoc={generatedCode}
                                    className="w-full h-full border-none"
                                    title="Game Preview"
                                    sandbox="allow-scripts allow-same-origin allow-modals"
                                />
                            ) : (
                                <Sandpack
                                    template="react"
                                    theme="dark"
                                    files={{
                                        "/App.js": generatedCode,
                                    }}
                                    options={{
                                        showNavigator: false,
                                        showTabs: false,
                                        externalResources: ["https://cdn.tailwindcss.com"],
                                    }}
                                    customSetup={{
                                        dependencies: {
                                            "lucide-react": "latest",
                                            "framer-motion": "latest"
                                        }
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === 'code' && (
                        <Editor
                            height="100%"
                            defaultLanguage={isHtml ? "html" : "typescript"}
                            value={generatedCode}
                            onChange={(value) => setGeneratedCode(value || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                padding: { top: 16, bottom: 16 },
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step4Preview;
