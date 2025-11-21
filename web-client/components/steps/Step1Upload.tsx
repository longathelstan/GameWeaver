import React, { useState } from 'react';
import { useAppStore, TreeData } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileJson, ArrowRight, Loader2 } from 'lucide-react';

const Step1Upload = () => {
    const { setTreeData, treeData, selectedTopics, setSelectedTopics, setCurrentStep } = useAppStore();
    const [isUploading, setIsUploading] = useState(false);
    const [isMapping, setIsMapping] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Ingest Data
            const ingestRes = await fetch('http://localhost:3001/api/ingest-data', {
                method: 'POST',
                body: formData,
            });
            const ingestData = await ingestRes.json();

            if (ingestRes.ok) {
                // Map Content
                setIsMapping(true);
                const mapRes = await fetch('http://localhost:3001/api/map-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: ingestData.data }),
                });
                const mapData = await mapRes.json();

                if (mapRes.ok) {
                    setTreeData(mapData.treeData);
                }
            }
        } catch (error) {
            console.error('Error uploading/mapping:', error);
        } finally {
            setIsUploading(false);
            setIsMapping(false);
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
                    <CardTitle>1. Upload Textbook Data (JSON)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isUploading || isMapping ? (
                                    <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                                ) : (
                                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                )}
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">JSON files only</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
                        </label>
                    </div>
                </CardContent>
            </Card>

            {treeData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Select Lessons / Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                            {renderTree(treeData)}
                        </ScrollArea>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => setCurrentStep(2)} disabled={selectedTopics.length === 0}>
                                Next: Generate Questions <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Step1Upload;
