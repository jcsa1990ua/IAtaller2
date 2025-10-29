/**
 * Test OpenAI Integration
 * 
 * This script tests the OpenAI service functionality
 */

require('dotenv').config();
const OpenAIService = require('./services/OpenAIService');

async function testOpenAI() {
  console.log('🧪 Testing OpenAI Integration\n');
  
  try {
    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      console.log('\nPlease add OPENAI_API_KEY to your .env file:');
      console.log('OPENAI_API_KEY=your-openai-api-key-here');
      return;
    }

    // Initialize service
    console.log('📡 Initializing OpenAI service...');
    const openai = new OpenAIService(apiKey);
    
    // Test 1: Validate API key
    console.log('\n🔑 Test 1: Validating API key...');
    const isValid = await openai.validateApiKey();
    console.log(`API key valid: ${isValid ? '✅ YES' : '❌ NO'}`);
    
    if (!isValid) {
      console.error('❌ Invalid API key. Please check your OPENAI_API_KEY in .env file');
      return;
    }

    // Test 2: Simple completion
    console.log('\n💬 Test 2: Simple Text Completion');
    const prompt1 = 'Write a short greeting message.';
    console.log(`Prompt: "${prompt1}"`);
    
    const completion1 = await openai.generateCompletion(prompt1, {
      maxTokens: 100,
      temperature: 0.7
    });
    
    console.log(`\nCompletion: "${completion1.text}"`);
    console.log(`Model: ${completion1.model}`);
    console.log(`Tokens used: ${completion1.usage.totalTokens}`);
    console.log(`Status: ✅ PASS`);

    // Test 3: Completion with system message
    console.log('\n🎯 Test 3: Completion with System Message');
    const prompt2 = 'Explain what a Data Privacy Vault is in one sentence.';
    console.log(`Prompt: "${prompt2}"`);
    
    const completion2 = await openai.generateCompletion(prompt2, {
      maxTokens: 150,
      temperature: 0.5,
      systemMessage: 'You are a cybersecurity expert who explains technical concepts clearly.'
    });
    
    console.log(`\nCompletion: "${completion2.text}"`);
    console.log(`Tokens used: ${completion2.usage.totalTokens}`);
    console.log(`Status: ✅ PASS`);

    // Test 4: Chat completion
    console.log('\n💭 Test 4: Chat Completion with History');
    const messages = [
      { role: 'user', content: 'What is PII?' },
      { role: 'assistant', content: 'PII stands for Personally Identifiable Information.' },
      { role: 'user', content: 'Give me 3 examples.' }
    ];
    
    console.log('Messages:');
    messages.forEach(msg => {
      console.log(`  ${msg.role}: "${msg.content}"`);
    });
    
    const chatCompletion = await openai.generateChatCompletion(messages, {
      maxTokens: 150
    });
    
    console.log(`\nAssistant: "${chatCompletion.text}"`);
    console.log(`Tokens used: ${chatCompletion.usage.totalTokens}`);
    console.log(`Status: ✅ PASS`);

    // Test 5: Token estimation
    console.log('\n📊 Test 5: Token Estimation');
    const testText = 'This is a test message to estimate token count. It contains several words and should give us a reasonable estimation.';
    const estimatedTokens = openai.estimateTokens(testText);
    console.log(`Text: "${testText}"`);
    console.log(`Estimated tokens: ~${estimatedTokens}`);
    console.log(`Status: ✅ PASS`);

    console.log('\n✅ All OpenAI tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run the tests
testOpenAI();




