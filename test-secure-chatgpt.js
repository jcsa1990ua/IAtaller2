/**
 * Test Secure ChatGPT Endpoint
 * 
 * This script tests the /secureChatGPT endpoint with PII protection
 */

require('dotenv').config();
const { connectDB, disconnectDB } = require('./config/database');

async function testSecureChatGPT() {
  console.log('🧪 Testing Secure ChatGPT Endpoint\n');
  
  try {
    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      console.log('\nPlease add OPENAI_API_KEY to your .env file');
      return;
    }

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await connectDB();

    // Test 1: Simple prompt with PII
    console.log('\n📝 Test 1: Simple Prompt with PII');
    const testPrompt1 = 'Write a professional email to John Doe at john.doe@example.com thanking them for their time.';
    console.log(`Prompt: "${testPrompt1}"`);
    
    const response1 = await fetch('http://localhost:3001/secureChatGPT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: testPrompt1 })
    });
    
    if (response1.ok) {
      const data = await response1.json();
      console.log(`\nResponse: "${data.response.substring(0, 150)}..."`);
      console.log(`Model: ${data.model}`);
      console.log(`Tokens used: ${data.tokensUsed}`);
      console.log('Status: ✅ PASS');
    } else {
      console.log(`Status: ❌ FAIL (${response1.status})`);
    }

    // Test 2: Multiple PII items
    console.log('\n📝 Test 2: Multiple PII Items');
    const testPrompt2 = 'Generate a meeting invitation for Sarah Johnson (sarah@company.com) and Bob Wilson (bob@company.com, phone: 555-123-4567).';
    console.log(`Prompt: "${testPrompt2}"`);
    
    const response2 = await fetch('http://localhost:3001/secureChatGPT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: testPrompt2,
        maxTokens: 300
      })
    });
    
    if (response2.ok) {
      const data = await response2.json();
      console.log(`\nResponse: "${data.response.substring(0, 150)}..."`);
      console.log(`Tokens used: ${data.tokensUsed}`);
      console.log('Status: ✅ PASS');
    } else {
      console.log(`Status: ❌ FAIL (${response2.status})`);
    }

    // Test 3: Spanish names
    console.log('\n📝 Test 3: Spanish Names');
    const testPrompt3 = 'Escribe un mensaje de bienvenida para María José González en su correo maria@empresa.com';
    console.log(`Prompt: "${testPrompt3}"`);
    
    const response3 = await fetch('http://localhost:3001/secureChatGPT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: testPrompt3,
        systemMessage: 'Eres un asistente que escribe en español'
      })
    });
    
    if (response3.ok) {
      const data = await response3.json();
      console.log(`\nResponse: "${data.response.substring(0, 150)}..."`);
      console.log(`Tokens used: ${data.tokensUsed}`);
      console.log('Status: ✅ PASS');
    } else {
      console.log(`Status: ❌ FAIL (${response3.status})`);
    }

    // Test 4: Customer service scenario
    console.log('\n📝 Test 4: Customer Service Scenario');
    const testPrompt4 = 'Write a response to customer complaint from Alice Martinez (alice@email.com, 555-987-6543) about delayed order #12345.';
    console.log(`Prompt: "${testPrompt4}"`);
    
    const response4 = await fetch('http://localhost:3001/secureChatGPT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: testPrompt4,
        systemMessage: 'You are a helpful customer service agent',
        temperature: 0.7
      })
    });
    
    if (response4.ok) {
      const data = await response4.json();
      console.log(`\nResponse: "${data.response.substring(0, 150)}..."`);
      console.log(`Tokens used: ${data.tokensUsed}`);
      console.log('Status: ✅ PASS');
    } else {
      console.log(`Status: ❌ FAIL (${response4.status})`);
    }

    console.log('\n✅ All Secure ChatGPT tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    // Disconnect from MongoDB
    console.log('\n📡 Disconnecting from MongoDB...');
    await disconnectDB();
  }
}

// Check if server is running before testing
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      console.log('✅ Server is running\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Server is not running. Please start the server first with: npm start');
    return false;
  }
  return false;
}

// Run the tests
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testSecureChatGPT();
  }
})();




