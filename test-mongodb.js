/**
 * Test MongoDB Persistence
 * 
 * This script tests the MongoDB persistence functionality
 */

require('dotenv').config();
const { connectDB, disconnectDB } = require('./config/database');
const anonymizer = require('./src/anonymizer-db');

async function testMongoDB() {
  console.log('🧪 Testing MongoDB Persistence\n');
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await connectDB();
    
    // Clear existing mappings
    console.log('\n🧹 Clearing existing mappings...');
    await anonymizer.clearMappings();
    
    // Test 1: Anonymization
    console.log('\n🔒 Test 1: Anonymization');
    const testMessage = 'oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157';
    console.log(`Original: ${testMessage}`);
    
    const anonymized = await anonymizer.anonymizeMessage(testMessage);
    console.log(`Anonymized: ${anonymized}`);
    
    // Test 2: Check mappings in database
    console.log('\n📊 Test 2: Checking mappings in database');
    const stats = await anonymizer.getMappingStats();
    console.log(`Total mappings: ${stats.total}`);
    console.log(`By type:`, stats.byType);
    
    const allMappings = await anonymizer.getAllMappings();
    console.log('\nAll mappings:');
    allMappings.forEach(mapping => {
      console.log(`  ${mapping.token} → "${mapping.original}" (${mapping.type})`);
    });
    
    // Test 3: Deanonymization
    console.log('\n🔓 Test 3: Deanonymization');
    const restored = await anonymizer.deanonymizeMessage(anonymized);
    console.log(`Restored: ${restored}`);
    console.log(`Match: ${testMessage === restored ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test 4: Persistence (simulate server restart)
    console.log('\n💾 Test 4: Testing Persistence');
    console.log('Creating a new anonymizer instance to simulate server restart...');
    
    // The data should still be in database
    const stats2 = await anonymizer.getMappingStats();
    console.log(`Mappings after "restart": ${stats2.total}`);
    console.log(`Persistence test: ${stats2.total === stats.total ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test 5: Deanonymization after "restart"
    console.log('\n🔄 Test 5: Deanonymization after simulated restart');
    const restored2 = await anonymizer.deanonymizeMessage(anonymized);
    console.log(`Restored after restart: ${restored2}`);
    console.log(`Match: ${testMessage === restored2 ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    // Disconnect from MongoDB
    console.log('\n📡 Disconnecting from MongoDB...');
    await disconnectDB();
  }
}

// Run the tests
testMongoDB();




