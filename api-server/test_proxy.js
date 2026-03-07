const OpenAI = require('openai').default;
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.CLIPROXY_API_KEY,
    baseURL: process.env.CLIPROXY_BASE_URL,
});

async function test() {
    console.log('Testing CLIProxyAPI connection...');
    console.log(`Base URL: ${process.env.CLIPROXY_BASE_URL}`);
    console.log(`API Key: ${process.env.CLIPROXY_API_KEY?.substring(0, 8)}...`);

    try {
        console.log('\n--- Test 1: gemini-2.5-flash ---');
        const r1 = await openai.chat.completions.create({
            model: 'gemini-2.5-flash',
            messages: [{ role: 'user', content: 'Say "Hello from CLIProxyAPI!" in one line.' }],
        });
        console.log('✅ Response:', r1.choices[0].message.content);

        console.log('\n--- Test 2: gemini-3.1-pro-low ---');
        const r2 = await openai.chat.completions.create({
            model: 'gemini-3.1-pro-low',
            messages: [{ role: 'user', content: 'Say "Pro model works!" in one line.' }],
        });
        console.log('✅ Response:', r2.choices[0].message.content);

        console.log('\n🎉 All tests passed!');
    } catch (e) {
        console.error('❌ Test failed:', e.message);
        if (e.status) console.error('   HTTP Status:', e.status);
    }
}

test();
