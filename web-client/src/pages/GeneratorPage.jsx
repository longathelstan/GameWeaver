import React, { useState } from 'react';
import { Row, Col } from 'antd';
import PromptInput from '../components/PromptInput';
import OutputViewer from '../components/OutputViewer';
import { generateContent } from '../services/apiService';

const GeneratorPage = () => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState('');

    const handleGenerate = async (values) => {
        setLoading(true);
        setOutput('');
        try {
            const result = await generateContent(values);
            setOutput(result.output);
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <PromptInput onGenerate={handleGenerate} loading={loading} />
            </Col>
            <Col span={16}>
                <OutputViewer output={output} loading={loading} />
            </Col>
        </Row>
    );
};

export default GeneratorPage;
