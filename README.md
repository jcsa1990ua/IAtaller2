# Data Privacy Vault with Secure ChatGPT Integration

> A Node.js service that anonymizes Personally Identifiable Information (PII) in text messages and provides secure AI-powered text completions with built-in privacy protection.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5/4-blue.svg)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Overview

The Data Privacy Vault is an enterprise-grade solution that protects sensitive personal information (names, emails, phone numbers) while enabling AI-powered text processing. It automatically anonymizes PII before sending data to external services like ChatGPT and restores the original information in the response.

### Key Benefits

- **🔒 Privacy-First**: No PII ever leaves your control
- **🤖 AI-Powered**: Leverage ChatGPT without exposing sensitive data
- **💾 Persistent**: MongoDB Atlas storage for token mappings
- **🚀 Production-Ready**: Built with security and scalability in mind
- **📝 Well-Documented**: Comprehensive guides and examples

## ✨ Features

### Core Functionality
- 🔒 **PII Detection**: Automatically detects names, emails, and phone numbers
- 🎯 **Anonymization**: Replaces PII with deterministic alphanumeric tokens
- 🔓 **Deanonymization**: Restores original PII from anonymized tokens
- 💾 **MongoDB Persistence**: Token mappings stored in MongoDB Atlas

### AI Integration
- 🤖 **Secure ChatGPT**: Privacy-preserving ChatGPT integration
- 🛡️ **Automatic PII Protection**: Anonymize → Process → Deanonymize workflow
- 🌐 **Multiple Models**: Support for GPT-3.5-Turbo and GPT-4
- ⚙️ **Configurable**: Temperature, max tokens, system messages

### Technical Features
- 🌐 **REST API**: Simple HTTP endpoints for easy integration
- 🛡️ **Security**: Built with Helmet, CORS, and best practices
- 📊 **Usage Tracking**: Token usage and mapping statistics
- 🔄 **Bidirectional**: Complete anonymize/deanonymize workflow

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Usage Examples](#-usage-examples)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Architecture](#-architecture)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

### Prerequisites

- Node.js v14 or higher
- npm or yarn
- MongoDB Atlas account
- OpenAI API account

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd data-privacy-vault
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `openai` - OpenAI API client
- `dotenv` - Environment variables
- `cors`, `helmet` - Security middleware

### Step 3: Set Up MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Whitelist your IP address (or use `0.0.0.0/0` for testing)

### Step 4: Get OpenAI API Key

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create a new secret key
4. Copy the key (starts with `sk-`)

### Step 5: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/data-privacy-vault?retryWrites=true&w=majority

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Step 6: Start the Server

```bash
npm start
```

Expected output:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📁 Database: data-privacy-vault
✅ OpenAI service initialized
🚀 Data Privacy Vault server running on port 3001
💾 Using MongoDB Atlas for persistent storage
🛡️  Secure ChatGPT endpoint: http://localhost:3001/secureChatGPT
```

## 🎬 Quick Start

### Test the Secure ChatGPT Endpoint

```bash
curl -X POST http://localhost:3001/secureChatGPT \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a professional email to John Doe at john@example.com thanking them for the meeting"
  }'
```

### Response

```json
{
  "response": "Dear John Doe,\n\nThank you for taking the time to meet with me...",
  "model": "gpt-3.5-turbo-0125",
  "tokensUsed": 85,
  "finishReason": "stop"
}
```

### What Happened Behind the Scenes

1. ✅ **Detected PII**: "John Doe" and "john@example.com"
2. ✅ **Anonymized**: Replaced with tokens (e.g., `NAME_xxx`, `EMAIL_yyy`)
3. ✅ **Sent to ChatGPT**: Only anonymized version sent
4. ✅ **Received Response**: ChatGPT response with tokens
5. ✅ **Deanonymized**: Tokens replaced with original PII
6. ✅ **Returned**: Final response with real names and emails

## 📡 API Endpoints

### 1. POST `/secureChatGPT` ⭐ **Recommended**

The main endpoint for privacy-preserving AI completions.

**Request:**
```json
{
  "prompt": "Your prompt with PII here",
  "model": "gpt-3.5-turbo",
  "maxTokens": 500,
  "temperature": 0.7,
  "systemMessage": "You are a helpful assistant"
}
```

**Parameters:**
- `prompt` (required): Text with potential PII
- `model` (optional): `gpt-3.5-turbo` or `gpt-4` (default: `gpt-3.5-turbo`)
- `maxTokens` (optional): Maximum tokens in response (default: 500)
- `temperature` (optional): 0-1, creativity level (default: 0.7)
- `systemMessage` (optional): Set AI behavior (default: "You are a helpful assistant")

**Response:**
```json
{
  "response": "AI generated text with PII restored",
  "model": "gpt-3.5-turbo-0125",
  "tokensUsed": 150,
  "finishReason": "stop"
}
```

### 2. POST `/anonymize`

Anonymize a message containing PII.

**Request:**
```json
{
  "message": "Contact John Doe at john@example.com"
}
```

**Response:**
```json
{
  "anonymizedMessage": "Contact NAME_c1b4ed05 NAME_41ef81fe at EMAIL_8004719c"
}
```

### 3. POST `/deanonymize`

Restore original PII from an anonymized message.

**Request:**
```json
{
  "anonymizedMessage": "Contact NAME_c1b4ed05 NAME_41ef81fe at EMAIL_8004719c"
}
```

**Response:**
```json
{
  "message": "Contact John Doe at john@example.com"
}
```

### 4. POST `/complete`

Direct OpenAI completion (no PII protection).

**Request:**
```json
{
  "prompt": "Explain quantum computing in simple terms",
  "maxTokens": 200
}
```

**Response:**
```json
{
  "completion": "Quantum computing is...",
  "model": "gpt-3.5-turbo-0125",
  "usage": { "totalTokens": 125 },
  "finishReason": "stop"
}
```

### 5. GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "service": "Data Privacy Vault",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 💡 Usage Examples

### Example 1: Customer Service Email

```bash
curl -X POST http://localhost:3001/secureChatGPT \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a response to customer Sarah Johnson (sarah@email.com) regarding her order #12345 delay",
    "systemMessage": "You are a helpful customer service agent",
    "temperature": 0.7
  }'
```

### Example 2: Meeting Invitation

```bash
curl -X POST http://localhost:3001/secureChatGPT \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a meeting invitation for Bob Wilson at bob@company.com and Alice Martinez at alice@company.com for next Tuesday at 2pm",
    "maxTokens": 300
  }'
```

### Example 3: Spanish Content

```bash
curl -X POST http://localhost:3001/secureChatGPT \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Escribe un correo profesional para María José González en maria@empresa.com sobre la reunión",
    "systemMessage": "Eres un asistente profesional que escribe en español"
  }'
```

### Example 4: Using with Node.js

```javascript
const axios = require('axios');

async function secureChatGPT(prompt) {
  try {
    const response = await axios.post('http://localhost:3001/secureChatGPT', {
      prompt: prompt,
      maxTokens: 500,
      temperature: 0.7
    });
    
    return response.data.response;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Usage
const result = await secureChatGPT(
  'Write to John Doe at john@example.com about the project'
);
console.log(result);
```

### Example 5: Using with Python

```python
import requests

def secure_chatgpt(prompt):
    url = 'http://localhost:3001/secureChatGPT'
    payload = {
        'prompt': prompt,
        'maxTokens': 500,
        'temperature': 0.7
    }
    
    response = requests.post(url, json=payload)
    return response.json()['response']

# Usage
result = secure_chatgpt('Write to John Doe at john@example.com')
print(result)
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment (development/production) | No | development |

### OpenAI Models

| Model | Cost (per 1M tokens) | Speed | Quality |
|-------|---------------------|-------|---------|
| `gpt-3.5-turbo` | $0.50-$1.50 | Fast | Good |
| `gpt-4` | $30-$60 | Slower | Excellent |

**Recommendation**: Use `gpt-3.5-turbo` for most use cases.

### Temperature Settings

- **0.0-0.3**: Focused and deterministic (good for technical content)
- **0.4-0.7**: Balanced creativity (default)
- **0.8-1.0**: More creative and varied responses

## 🧪 Testing

### Run All Tests

```bash
# Test MongoDB connection and persistence
node test-mongodb.js

# Test OpenAI integration
node test-openai.js

# Test secure ChatGPT endpoint (requires server running)
node test-secure-chatgpt.js

# Test individual features
node demo.js
```

### Test Secure ChatGPT

```bash
# Start the server in one terminal
npm start

# In another terminal, run the test
node test-secure-chatgpt.js
```

Expected output:
```
🧪 Testing Secure ChatGPT Endpoint
✅ Server is running
📡 Connecting to MongoDB...
✅ MongoDB Connected

📝 Test 1: Simple Prompt with PII
Status: ✅ PASS
...
✅ All Secure ChatGPT tests completed!
```

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐
│  Client Request │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Express.js REST API        │
│  /secureChatGPT endpoint    │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Step 1: Anonymize PII      │
│  (anonymizer-db.js)         │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  MongoDB Atlas              │
│  Store token mappings       │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Step 2: Send to ChatGPT    │
│  (OpenAIService.js)         │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  OpenAI API                 │
│  GPT-3.5 / GPT-4            │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Step 3: Deanonymize        │
│  (anonymizer-db.js)         │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  MongoDB Atlas              │
│  Retrieve mappings          │
└────────┬───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Return Final Response      │
└─────────────────────────────┘
```

### Project Structure

```
data-privacy-vault/
├── config/
│   └── database.js              # MongoDB configuration
├── models/
│   └── TokenMapping.js          # Mongoose schema
├── services/
│   └── OpenAIService.js         # OpenAI API wrapper
├── src/
│   ├── anonymizer.js           # In-memory version
│   └── anonymizer-db.js        # MongoDB version
├── server.js                   # Main Express server
├── test-mongodb.js             # MongoDB tests
├── test-openai.js              # OpenAI tests
├── test-secure-chatgpt.js      # Secure ChatGPT tests
├── package.json                # Dependencies
├── .env                        # Environment variables
└── README.md                   # This file
```

## 🔒 Security

### Built-in Security Features

- ✅ **Helmet.js**: Security HTTP headers
- ✅ **CORS**: Cross-origin resource sharing
- ✅ **Environment Variables**: Credentials in `.env`
- ✅ **Input Validation**: All endpoints validate input
- ✅ **Error Handling**: Secure error messages
- ✅ **MongoDB Encryption**: Data encrypted at rest and in transit

### PII Protection Workflow

1. **Input**: Message with PII
2. **Detection**: Regex patterns identify PII
3. **Anonymization**: PII → Tokens (e.g., `NAME_xxx`)
4. **Storage**: Tokens stored in MongoDB
5. **Processing**: Only anonymized data sent to OpenAI
6. **Restoration**: Tokens → Original PII
7. **Output**: Final response with real data

### Best Practices

- 🔐 Never commit `.env` file to version control
- 🔄 Rotate API keys regularly
- 🚫 Set IP whitelist in MongoDB Atlas (production)
- 📊 Monitor API usage and costs
- 🛡️ Use HTTPS in production
- 📝 Implement rate limiting for production use

## 🐛 Troubleshooting

### Server Won't Start

**Problem**: "Cannot find module"
```bash
npm install
```

**Problem**: "MongoDB connection error"
- Check `MONGODB_URI` in `.env`
- Verify cluster is running
- Check IP whitelist in MongoDB Atlas

**Problem**: "OpenAI service not configured"
- Add `OPENAI_API_KEY` to `.env`
- Restart server

### API Errors

**503 Service Unavailable**
- OpenAI service not configured
- Check `OPENAI_API_KEY` in `.env`

**400 Bad Request**
- Missing required `prompt` field
- Prompt is empty

**500 Internal Server Error**
- Check server logs
- Verify MongoDB connection
- Verify OpenAI API key is valid

### High Costs

**Reduce OpenAI costs:**
- Use `gpt-3.5-turbo` instead of `gpt-4`
- Set lower `maxTokens` (e.g., 200-300)
- Implement caching for common queries
- Set spending limits in OpenAI dashboard

### Performance Issues

**Slow responses:**
- Normal for AI (1-3 seconds)
- Consider upgrading MongoDB cluster
- Use smaller `maxTokens` values
- Implement request queuing

## 💰 Cost Estimation

### Typical Usage Costs

**GPT-3.5-Turbo:**
- Basic query: ~$0.001
- 1,000 requests: ~$1.00
- 10,000 requests: ~$10.00

**GPT-4:**
- Basic query: ~$0.03
- 1,000 requests: ~$30.00
- 10,000 requests: ~$300.00

**MongoDB Atlas:**
- Free tier: M0 (512MB storage)
- Paid: Starting at $9/month (M2, 2GB storage)

**Total Monthly Cost Estimate:**
- Development: $0-$10
- Small production: $50-$200
- Medium production: $200-$1000

## 📚 Additional Documentation

- [MONGODB_SETUP.md](MONGODB_SETUP.md) - MongoDB Atlas setup
- [OPENAI_SETUP.md](OPENAI_SETUP.md) - OpenAI integration details
- [OPENAI_QUICK_START.md](OPENAI_QUICK_START.md) - OpenAI quick start
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Complete setup checklist

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- OpenAI for the GPT API
- MongoDB for Atlas
- Express.js community
- All contributors

## 📞 Support

For support, please:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the documentation

## 🎉 Success!

Your Data Privacy Vault with Secure ChatGPT integration is ready to use! Start building privacy-preserving AI applications today! 🚀

---

Made with ❤️ for privacy and security
