import React from 'react';
import { Card, Spin, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'antd';

const { TextArea } = Input;

const OutputViewer = ({ output, loading }) => {
    return (
        <Card 
            title="Generated Output" 
            bordered={false}
            extra={
                <CopyToClipboard text={output}>
                    <Button>Copy to Clipboard</Button>
                </CopyToClipboard>
            }
        >
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <TextArea
                    value={output}
                    readOnly
                    autoSize={{ minRows: 15, maxRows: 25 }}
                    style={{ background: '#f5f5f5', border: 'none' }}
                />
            )}
        </Card>
    );
};

export default OutputViewer;
