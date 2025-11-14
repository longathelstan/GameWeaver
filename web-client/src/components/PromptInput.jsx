import React from 'react';
import { Form, Input, Button, Select, Card } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const PromptInput = ({ onGenerate, loading }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        onGenerate(values);
    };

    return (
        <Card title="Input Controls" bordered={false}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    gameType: 'Quiz',
                    outputMode: 'REACT_JSON'
                }}
            >
                <Form.Item
                    name="prompt"
                    label="Prompt"
                    rules={[{ required: true, message: 'Please input your prompt!' }]}
                >
                    <TextArea rows={4} placeholder="e.g., 'Create a 5-question quiz about space'" />
                </Form.Item>

                <Form.Item
                    name="gameType"
                    label="Game Type"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Option value="Quiz">Quiz</Option>
                        <Option value="Word_Guess">Word Guess</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="outputMode"
                    label="Output Mode"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Option value="REACT_JSON">React (JSON)</Option>
                        <Option value="HTML">HTML/CSS/JS</Option>
                        <Option value="VBA">PowerPoint (VBA)</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Generate
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PromptInput;
