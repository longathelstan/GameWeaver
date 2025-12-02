import React, { useState, useEffect } from 'react';
import { useAppStore, TreeData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

interface Book {
    id: number;
    name: string;
    createdAt: string;
}

const Step1Upload = () => {
    const { setTreeData, treeData, selectedTopics, setSelectedTopics, setCurrentStep } = useAppStore();
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`);
                const data = await res.json();
                setBooks(data.books || []);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setIsLoadingBooks(false);
            }
        };
        fetchBooks();
    }, []);

    const handleBookSelect = async (bookId: number) => {
        setIsLoadingDetails(true);
        setSelectedBookId(bookId);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`);
            const data = await res.json();
            if (data.book && data.book.structure) {
                setTreeData(data.book.structure);
                // Reset selection when changing books
                setSelectedTopics([]);
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const toggleTopic = (value: string) => {
        if (selectedTopics.includes(value)) {
            setSelectedTopics(selectedTopics.filter((t) => t !== value));
        } else {
            setSelectedTopics([...selectedTopics, value]);
        }
    };

    const renderTree = (nodes: TreeData[]) => {
        return (
            <div className="pl-4">
                {nodes.map((node) => (
                    <div key={node.value} className="my-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={node.value}
                                checked={selectedTopics.includes(node.value)}
                                onCheckedChange={() => toggleTopic(node.value)}
                            />
                            <label
                                htmlFor={node.value}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {node.label}
                            </label>
                        </div>
                        {node.children && renderTree(node.children)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>1. Chọn Sách Giáo Khoa</CardTitle>
                    <CardDescription>Chọn một cuốn sách đã được tải lên để tạo trò chơi.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingBooks ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${selectedBookId === book.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-200'
                                        }`}
                                    onClick={() => handleBookSelect(book.id)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
                                            <Book className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{book.name}</h3>
                                            <p className="text-sm text-gray-500">ID: {book.id}</p>
                                        </div>
                                        {selectedBookId === book.id && (
                                            isLoadingDetails ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            ) : (
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {treeData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Chọn Bài Học / Chủ Đề</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                            {renderTree(treeData)}
                        </ScrollArea>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => setCurrentStep(2)} disabled={selectedTopics.length === 0}>
                                Tiếp theo: Tạo Câu Hỏi <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Step1Upload;
