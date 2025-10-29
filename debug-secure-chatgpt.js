/**
 * Debug script for secureChatGPT endpoint
 * Tests the workflow step by step
 */

require('dotenv').config();
const { connectDB, disconnectDB, OPENAI_API_KEY } = require('./config/database');
const anonymizer = require('./src/anonymizer-db');
const OpenAIService = require('./services/OpenAIService');

async function debugSecureChatGPT() {
  console.log('🔍 Debugging Secure ChatGPT Workflow\n');
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await connectDB();
    
    // Check OpenAI API key
    console.log('\n🔑 Checking OpenAI API Key...');
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in environment');
      return;
    }
    console.log('✅ OpenAI API key found');
    
    // Initialize OpenAI service
    console.log('\n🤖 Initializing OpenAI service...');
    const openai = new OpenAIService(OPENAI_API_KEY);
    console.log('✅ OpenAI service initialized');
    
    // Test prompt with PII
    const prompt = 'Write a professional email to John Doe at john.doe@example.com thanking them for their time.';
    console.log(`\n📝 Test Prompt:`);
    console.log(`"${prompt}"`);
    
    // Step 1: Anonymize
    console.log('\n🔒 Step 1: Anonymizing prompt...');
    const anonymizedPrompt = await anonymizer.anonymizeMessage(prompt);
    console.log(`Anonymized: "${anonymizedPrompt}"`);
    
    // Check mappings
    const stats = await anonymizer.getMappingStats();
    console.log(`Mappings created: ${stats.total} (Names: ${stats.byType.name}, Emails: ${stats.byType.email})`);
    
    // Step 2: Send to ChatGPT
    console.log('\n🤖 Step 2: Sending to ChatGPT...');
    const completion = await openai.generateCompletion(anonymizedPrompt, {
      model: 'gpt-3.5-turbo',
      maxTokens: 200,
      temperature: 0.7,
      systemMessage: 'You are a helpful assistant.'
    });
    console.log(`Response received: "${completion.text.substring(0, 100)}..."`);
    console.log(`Tokens used: ${completion.usage.totalTokens}`);
    
    // Step 3: Deanonymize
    console.log('\n🔓 Step 3: Deanonymizing response...');
    const deanonymizedResponse = await anonymizer.deanonymizeMessage(completion.text);
    console.log(`Final response: "${deanonymizedResponse.substring(0, 100)}..."`);
    
    // Verify PII is restored
    console.log('\n✅ Verification:');
    const hasJohnDoe = deanonymizedResponse.includes('John Doe');
    const hasEmail = deanonymizedResponse.includes('john.doe@example.com');
    console.log(`Contains "John Doe": ${hasJohnDoe ? '✅' : '❌'}`);
    console.log(`Contains email: ${hasEmail ? '✅' : '❌'}`);
    
    if (hasJohnDoe && hasEmail) {
      console.log('\n🎉 Workflow completed successfully!');
    } else {
      console.log('\n⚠️  Some PII was not restored properly');
    }
    
  } catch (error) {
    console.error('\n❌ Error during workflow:');
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
  } finally {
    console.log('\n📡 Disconnecting from MongoDB...');
    await disconnectDB();
  }
}

// Run the debug
debugSecureChatGPT();




