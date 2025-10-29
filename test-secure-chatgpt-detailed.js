/**
 * Detailed Test for Secure ChatGPT Endpoint with Error Reporting
 * 
 * This script tests the /secureChatGPT endpoint and shows detailed error information
 */

require('dotenv').config();
const { connectDB, disconnectDB } = require('./config/database');

async function testSecureChatGPT() {
  console.log('🧪 Detailed Testing of Secure ChatGPT Endpoint\n');
  
  try {
    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      console.log('\nPlease add OPENAI_API_KEY to your .env file');
      console.log('Example: OPENAI_API_KEY=sk-your-api-key-here\n');
      return;
    }
    console.log('✅ OPENAI_API_KEY found in environment\n');

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
    
    console.log(`Status Code: ${response1.status}`);
    
    const data1 = await response1.json();
    
    if (response1.ok) {
      console.log(`\nResponse: "${data1.response.substring(0, 150)}..."`);
      console.log(`Model: ${data1.model}`);
      console.log(`Tokens used: ${data1.tokensUsed}`);
      console.log('Status: ✅ PASS');
    } else {
      console.log('\n❌ ERROR DETAILS:');
      console.log(`Error: ${data1.error}`);
      console.log(`Message: ${data1.message}`);
      if (data1.details) {
        console.log(`Details: ${data1.details}`);
      }
      console.log('Status: ❌ FAIL');
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
    
    console.log(`Status Code: ${response2.status}`);
    
    const data2 = await response2.json();
    
    if (response2.ok) {
      console.log(`\nResponse: "${data2.response.substring(0, 150)}..."`);
      console.log(`Tokens used: ${data2.tokensUsed}`);
      console.log('Status: ✅ PASS');
    } else {
      console.log('\n❌ ERROR DETAILS:');
      console.log(`Error: ${data2.error}`);
      console.log(`Message: ${data2.message}`);
      if (data2.details) {
        console.log(`Details: ${data2.details}`);
      }
      console.log('Status: ❌ FAIL');
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
    
    console.log(`Status Code: ${response3.status}`);
    
    const data3 = await response3.json();
    
    if (response3.ok) {
      console.log(`\nResponse: "${data3.response.substring(0, 150)}..."`);
      console.log(`Tokens used: ${data3.tokensUsed}`);
      console.log('Status: ✅ PASS');
    } else {
      console.log('\n❌ ERROR DETAILS:');
      console.log(`Error: ${data3.error}`);
      console.log(`Message: ${data3.message}`);
      if (data3.details) {
        console.log(`Details: ${data3.details}`);
      }
      console.log('Status: ❌ FAIL');
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
    
    console.log(`Status Code: ${response4.status}`);
    
    const data4 = await response4.json();
    
    if (response4.ok) {
      console.log(`\nResponse: "${data4.response.substring(0, 150)}..."`);
      console.log(`Tokens used: ${data4.tokensUsed}`);
      console.log('Status: ✅ PASS');
    } else {
      console.log('\n❌ ERROR DETAILS:');
      console.log(`Error: ${data4.error}`);
      console.log(`Message: ${data4.message}`);
      if (data4.details) {
        console.log(`Details: ${data4.details}`);
      }
      console.log('Status: ❌ FAIL');
    }

    console.log('\n✅ All Secure ChatGPT tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test failed with exception:');
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
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
      const data = await response.json();
      console.log('✅ Server is running');
      console.log(`Database status: ${data.database}`);
      console.log(`Service: ${data.service}\n`);
      return true;
    }
  } catch (error) {
    console.error('❌ Server is not running. Please start the server first with: npm start');
    console.error(`Error: ${error.message}\n`);
    return false;
  }
  return false;
}

// Run the tests
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testSecureChatGPT();
  } else {
    console.log('\n💡 TROUBLESHOOTING TIPS:');
    console.log('1. Make sure you have started the server in another terminal: npm start');
    console.log('2. Check that the server is running on port 3001');
    console.log('3. Ensure you have the .env file with OPENAI_API_KEY');
    console.log('4. Verify MongoDB connection is working\n');
  }
})();




