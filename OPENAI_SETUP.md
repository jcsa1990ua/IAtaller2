# OpenAI Integration Setup Guide

This guide explains how to set up and use the OpenAI integration for text completions in the Data Privacy Vault.

## 🎯 Overview

The Data Privacy Vault now includes OpenAI integration for AI-powered text completions with two main features:

1. **Direct Completions** - Send prompts directly to OpenAI
2. **Privacy-Preserving Completions** - Automatically anonymize PII before sending to OpenAI

## 🔧 Setup

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### Step 2: Add API Key to Environment

Update your `.env` file:

```bash
# Existing variables
MONGODB_URI=mongodb+srv://...
PORT=3001
NODE_ENV=development

# Add OpenAI API Key
OPENAI_API_KEY=sk-your-api-key-here
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs the `openai` package.

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
✅ OpenAI service initialized
🤖 OpenAI completion endpoint: http://localhost:3001/complete
🔐 OpenAI + anonymization endpoint: http://localhost:3001/complete-anonymized
```

## 🚀 API Endpoints

### 1. POST /complete

Generate a text completion using OpenAI directly.

**Request:**
```bash
curl -X POST http://localhost:3001/complete \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a professional email greeting.",
    "model": "gpt-3.5-turbo",
    "maxTokens": 150,
    "temperature": 0.7
  }'
```

**Response:**
```json
{
  "completion": "Dear [Recipient],\n\nI hope this message finds you well...",
  "model": "gpt-3.5-turbo-0125",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 45,
    "totalTokens": 55
  },
  "finishReason": "stop"
}
```

**Parameters:**
- `prompt` (required): The text prompt for completion
- `model` (optional): Model to use (default: `gpt-3.5-turbo`)
- `maxTokens` (optional): Maximum tokens in response (default: 500)
- `temperature` (optional): Creativity level 0-1 (default: 0.7)
- `systemMessage` (optional): System message to set context

### 2. POST /complete-anonymized

Generate a completion with automatic PII anonymization.

**How it works:**
1. Anonymizes PII in your prompt
2. Sends anonymized prompt to OpenAI
3. Receives completion
4. Deanonymizes the completion
5. Returns both versions

**Request:**
```bash
curl -X POST http://localhost:3001/complete-anonymized \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a follow-up email to John Doe at john@example.com about the project proposal.",
    "maxTokens": 200
  }'
```

**Response:**
```json
{
  "originalPrompt": "Write a follow-up email to John Doe at john@example.com...",
  "anonymizedPrompt": "Write a follow-up email to NAME_xxx NAME_yyy at EMAIL_zzz...",
  "anonymizedCompletion": "Dear NAME_xxx NAME_yyy...",
  "completion": "Dear John Doe...",
  "model": "gpt-3.5-turbo-0125",
  "usage": {
    "promptTokens": 25,
    "completionTokens": 120,
    "totalTokens": 145
  },
  "finishReason": "stop"
}
```

**Benefits:**
- ✅ Protects PII from being sent to OpenAI
- ✅ Maintains context with tokens
- ✅ Automatic restoration of PII in response
- ✅ Complete audit trail

## 📊 OpenAI Service Class

### Basic Usage

```javascript
const OpenAIService = require('./services/OpenAIService');

// Initialize
const openai = new OpenAIService(process.env.OPENAI_API_KEY);

// Simple completion
const result = await openai.generateCompletion('Hello, how are you?');
console.log(result.text);

// With options
const result2 = await openai.generateCompletion('Explain AI', {
  model: 'gpt-4',
  maxTokens: 300,
  temperature: 0.5,
  systemMessage: 'You are a helpful AI tutor.'
});
```

### Available Methods

#### `generateCompletion(prompt, options)`
Generate a single completion.

#### `generateChatCompletion(messages, options)`
Generate a completion with conversation history.

```javascript
const messages = [
  { role: 'user', content: 'What is AI?' },
  { role: 'assistant', content: 'AI stands for...' },
  { role: 'user', content: 'Tell me more.' }
];

const result = await openai.generateChatCompletion(messages);
```

#### `generateStreamingCompletion(prompt, options, onChunk)`
Generate a streaming completion (for real-time responses).

```javascript
await openai.generateStreamingCompletion(
  'Write a story',
  {},
  (chunk) => {
    process.stdout.write(chunk);
  }
);
```

#### `validateApiKey()`
Check if API key is valid.

```javascript
const isValid = await openai.validateApiKey();
```

#### `listModels()`
Get available models.

```javascript
const models = await openai.listModels();
```

#### `estimateTokens(text)`
Estimate token count.

```javascript
const tokens = openai.estimateTokens('Some text here');
```

## 🧪 Testing

### Test OpenAI Service

```bash
node test-openai.js
```

This runs comprehensive tests:
- ✅ API key validation
- ✅ Simple completion
- ✅ Completion with system message
- ✅ Chat completion
- ✅ Token estimation

### Test via API

**PowerShell:**
```powershell
$body = @{
    prompt = "Write a haiku about data privacy"
    maxTokens = 100
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/complete" -Method POST -Body $body -ContentType "application/json"
```

## 💰 Cost Considerations

### Pricing (as of 2024)

**GPT-3.5-Turbo:**
- Input: $0.50 / 1M tokens
- Output: $1.50 / 1M tokens

**GPT-4:**
- Input: $30.00 / 1M tokens
- Output: $60.00 / 1M tokens

### Token Usage Tips

1. **Use token limits**: Set `maxTokens` to control costs
2. **Choose appropriate model**: Use gpt-3.5-turbo for most tasks
3. **Monitor usage**: Check `usage` in responses
4. **Estimate before calling**: Use `estimateTokens()` method

## 🔒 Security Best Practices

### 1. API Key Security

- ✅ Store in `.env` file (never in code)
- ✅ Add `.env` to `.gitignore`
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly
- ✅ Set usage limits in OpenAI dashboard

### 2. PII Protection

Use `/complete-anonymized` endpoint when:
- Prompt contains names, emails, phone numbers
- Handling user-generated content
- Dealing with sensitive information
- Compliance requirements (GDPR, CCPA)

### 3. Rate Limiting

Implement rate limiting to prevent abuse:
```javascript
// Example: Add rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/complete', limiter);
```

## 📈 Production Deployment

### Environment Variables

```bash
# Production .env
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-prod-key-here
PORT=3001
NODE_ENV=production
```

### Monitoring

Monitor these metrics:
- API response times
- Token usage per request
- Error rates
- Cost per day/month

### Error Handling

The service includes comprehensive error handling:
- Invalid API key → 503 Service Unavailable
- Empty prompt → 400 Bad Request
- OpenAI API errors → 500 Internal Server Error
- Rate limits → 429 Too Many Requests (from OpenAI)

## 🔄 Integration Workflow

### Privacy-Preserving AI Workflow

```
1. User Input (with PII)
   ↓
2. Anonymize PII → MongoDB
   ↓
3. Send Anonymized Prompt → OpenAI
   ↓
4. Receive Completion
   ↓
5. Deanonymize Response ← MongoDB
   ↓
6. Return to User (with PII restored)
```

### Example Use Cases

1. **Customer Service**: Anonymize customer names/emails in support tickets
2. **Document Processing**: Redact PII before analysis
3. **Email Generation**: Protect recipient information
4. **Report Summarization**: Remove sensitive data before summarization

## 🆘 Troubleshooting

### "OpenAI service is not configured"
**Solution**: Add `OPENAI_API_KEY` to `.env` file

### "Invalid API key"
**Solution**:
- Check key format (starts with `sk-`)
- Verify key is active in OpenAI dashboard
- Check for extra spaces in `.env`

### "Rate limit exceeded"
**Solution**:
- Wait before retrying
- Implement exponential backoff
- Upgrade OpenAI plan

### High costs
**Solution**:
- Reduce `maxTokens`
- Use gpt-3.5-turbo instead of gpt-4
- Implement request caching
- Set daily/monthly limits

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)

## ✅ Setup Checklist

- [ ] OpenAI account created
- [ ] API key generated
- [ ] `OPENAI_API_KEY` added to `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Server started successfully
- [ ] `test-openai.js` passes all tests
- [ ] `/complete` endpoint tested
- [ ] `/complete-anonymized` endpoint tested

## 🎉 You're Ready!

Your Data Privacy Vault now has AI-powered text completions with built-in PII protection! 🚀




