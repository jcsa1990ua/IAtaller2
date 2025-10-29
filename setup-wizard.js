/**
 * Setup Wizard for Data Privacy Vault
 * 
 * This interactive script helps you set up the environment
 */

const fs = require('fs');
const path = require('path');

console.log('🧙 Data Privacy Vault Setup Wizard\n');
console.log('This wizard will help you set up your environment.\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('⚠️  WARNING: .env file already exists!');
  console.log('📁 Current .env contents:');
  console.log('─────────────────────────────────────');
  const currentEnv = fs.readFileSync(envPath, 'utf8');
  console.log(currentEnv);
  console.log('─────────────────────────────────────\n');
  console.log('💡 If you want to update it, delete the .env file first or edit it manually.\n');
  process.exit(0);
}

// Default values
const defaults = {
  MONGODB_URI: 'mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0',
  OPENAI_API_KEY: '',
  PORT: '3001'
};

console.log('📋 Required Configuration:\n');

// Check what's missing
const missing = [];
if (!defaults.OPENAI_API_KEY) {
  missing.push('OPENAI_API_KEY');
}

if (missing.length > 0) {
  console.log('❌ Missing required values:');
  missing.forEach(key => {
    console.log(`   - ${key}`);
  });
  console.log();
}

// Instructions
console.log('🔑 To get your OpenAI API Key:');
console.log('   1. Go to https://platform.openai.com/api-keys');
console.log('   2. Sign in or create an account');
console.log('   3. Click "Create new secret key"');
console.log('   4. Copy the key (starts with sk-)');
console.log('   5. Make sure you have credits or a payment method set up\n');

console.log('📝 Manual Setup Instructions:\n');
console.log('Create a .env file in the project root with the following content:\n');
console.log('─────────────────────────────────────');
console.log(`MONGODB_URI=${defaults.MONGODB_URI}`);
console.log('OPENAI_API_KEY=sk-your-openai-api-key-here');
console.log(`PORT=${defaults.PORT}`);
console.log('─────────────────────────────────────\n');

console.log('💻 Quick Command (Windows PowerShell):');
console.log('─────────────────────────────────────');
console.log('@"');
console.log(`MONGODB_URI=${defaults.MONGODB_URI}`);
console.log('OPENAI_API_KEY=sk-your-openai-api-key-here');
console.log(`PORT=${defaults.PORT}`);
console.log('"@ | Out-File -FilePath .env -Encoding UTF8');
console.log('─────────────────────────────────────\n');

console.log('💻 Quick Command (Linux/Mac):');
console.log('─────────────────────────────────────');
console.log('cat > .env << EOF');
console.log(`MONGODB_URI=${defaults.MONGODB_URI}`);
console.log('OPENAI_API_KEY=sk-your-openai-api-key-here');
console.log(`PORT=${defaults.PORT}`);
console.log('EOF');
console.log('─────────────────────────────────────\n');

console.log('📚 Additional Resources:');
console.log('   - MongoDB Setup: See MONGODB_SETUP.md');
console.log('   - OpenAI Setup: See OPENAI_SETUP.md');
console.log('   - Troubleshooting: See TROUBLESHOOTING_500_ERROR.md\n');

console.log('✅ Next Steps:');
console.log('   1. Create the .env file using the instructions above');
console.log('   2. Replace "sk-your-openai-api-key-here" with your actual API key');
console.log('   3. Run: npm start');
console.log('   4. Test: node test-openai.js');
console.log('   5. Test endpoint: node test-secure-chatgpt-detailed.js\n');

console.log('🎉 Setup wizard completed!\n');




