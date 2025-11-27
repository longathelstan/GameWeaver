const fs = require('fs');
const path = require('path');

async function verify() {
    const fetch = (await import('node-fetch')).default;
    const FormData = (await import('formdata-node')).FormData;
    const { fileFromPath } = await import('formdata-node/file-from-path');

    const baseUrl = 'http://localhost:3001/api';

    console.log('1. Testing Ingestion...');
    if (process.argv.includes('--skip-ingest')) {
        console.log('Skipping ingestion...');
    } else {
        const form = new FormData();
        form.append('file', await fileFromPath(path.resolve('test_data.json')));

        try {
            const ingestRes = await fetch(`${baseUrl}/ingest-data`, {
                method: 'POST',
                body: form
            });
            const ingestData = await ingestRes.json();
            console.log('Ingest Response:', ingestData);
        } catch (e) {
            console.error('Ingest failed:', e);
        }
    }

    console.log('\n2. Testing Retrieval...');
    try {
        const genRes = await fetch(`${baseUrl}/generate-questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topics: ['Văn Lang'], quantity: 1 })
        });
        const genData = await genRes.json();
        console.log('Generate Response:', JSON.stringify(genData, null, 2));

        if (genData.questions && genData.questions.length > 0) {
            console.log('SUCCESS: Questions generated.');
        } else {
            console.error('FAILURE: No questions generated.');
        }
    } catch (e) {
        console.error('Generate failed:', e);
    }
}

verify();
