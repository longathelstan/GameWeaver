import React, { useState, useEffect } from 'react';
import { useAppStore, TreeData } from '@/lib/store';
import { getBooks, getBookDetails, uploadBook } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, ArrowRight, Loader2, CheckCircle, AlertCircle, UploadCloud } from 'lucide-react';

interface BookSummary {
    id: number;
    name: string;
    createdAt: string;
}

const Step1Upload = () => {
    const { setTreeData, treeData, selectedTopics, setSelectedTopics, setCurrentStep, setSelectedBookId } = useAppStore();
    const [books, setBooks] = useState<BookSummary[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedBookId, setLocalBookId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        try {
            setIsLoadingBooks(true);
            const data = await getBooks();
            setBooks(data.books);
        } catch (err) {
            setError('Không thể tải danh sách sách. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsLoadingBooks(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        try {
            await uploadBook(file);
            await fetchBooks(); // Refresh list after upload
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Tải lên thất bại.';
            setError(`Lỗi upload: ${msg}`);
            console.error(err);
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = ''; // Reset input
        }
    };

    const handleBookSelect = async (bookId: number) => {
        setIsLoadingDetails(true);
        setLocalBookId(bookId);
        setError(null);
        try {
            const data = await getBookDetails(bookId);
            if (data.book?.structure) {
                setTreeData(data.book.structure as TreeData[]);
                setSelectedTopics([]);
                setSelectedBookId(bookId);
            }
        } catch (err) {
            setError('Không thể tải chi tiết sách. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const toggleTopic = (value: string) => {
        setSelectedTopics(
            selectedTopics.includes(value)
                ? selectedTopics.filter((t) => t !== value)
                : [...selectedTopics, value]
        );
    };

    const renderTree = (nodes: TreeData[]) => (
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
                            className="text-sm font-medium leading-none cursor-pointer"
                        >
                            {node.label}
                        </label>
                    </div>
                    {node.children && renderTree(node.children)}
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>1. Chọn Sách Giáo Khoa</CardTitle>
                    <CardDescription>Chọn một cuốn sách đã được tải lên để tạo trò chơi.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-4 rounded-md bg-destructive/10 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Upload Section */}
                    <div className="mb-8 p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/20 transition-colors hover:bg-muted/40">
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                        <h3 className="font-semibold text-lg mb-1">Tải lên sách mới</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Hỗ trợ file JSON cấu trúc sách giáo khoa
                        </p>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <Button disabled={isUploading}>
                                {isUploading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý AI (1-2 phút)...</>
                                ) : (
                                    'Chọn file tải lên'
                                )}
                            </Button>
                        </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-3">Hoặc chọn sách có sẵn:</h3>

                    {isLoadingBooks ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : books.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            Chưa có sách nào. Hãy nạp dữ liệu trước.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${selectedBookId === book.id
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    onClick={() => handleBookSelect(book.id)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
                                            <Book className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{book.name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {new Date(book.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        {selectedBookId === book.id &&
                                            (isLoadingDetails ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
                                            ) : (
                                                <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                                            ))}
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
                        <CardDescription>
                            Đã chọn {selectedTopics.length} mục
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                            {renderTree(treeData)}
                        </ScrollArea>
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={() => setCurrentStep(2)}
                                disabled={selectedTopics.length === 0}
                            >
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
