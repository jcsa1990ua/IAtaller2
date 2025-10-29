# OpenAI Integration - Quick Start

Get started with OpenAI text completions in 4 easy steps!

## 🚀 Quick Setup

### Step 1: Get OpenAI API Key

1. Visit [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

### Step 2: Add to Environment

Update your `.env` file:

```bash
# Add this line to your existing .env file
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Install & Start

```bash
npm install
npm start
```

### Step 4: Test It!

**Simple Completion:**
```bash
curl -X POST http://localhost:3001/complete \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Say hello!"}'
```

**With PII Protection:**
```bash
curl -X POST http://localhost:3001/complete-anonymized \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write an email to John Doe at john@example.com"}'
```

## 📊 Two Endpoints

### 1. `/complete` - Direct OpenAI

Use when your prompt has **no PII**:
```json
{
  "prompt": "Explain quantum computing in simple terms",
  "maxTokens": 200
}
```

### 2. `/complete-anonymized` - PII Protected

Use when your prompt **contains PII**:
```json
{
  "prompt": "Draft an email to Sarah Johnson at sarah@company.com about the meeting"
}
```

**What happens:**
1. ✅ Names & emails anonymized before sending to OpenAI
2. ✅ AI generates response with tokens  
3. ✅ Response automatically deanonymized
4. ✅ You get back text with actual names/emails

## 🧪 Test Script

```bash
node test-openai.js
```

Expected output:
```
🧪 Testing OpenAI Integration
📡 Initializing OpenAI service...
🔑 Test 1: Validating API key...
API key valid: ✅ YES
...
✅ All OpenAI tests completed successfully!
```

## 💡 Example Use Cases

### Customer Service
```bash
curl -X POST http://localhost:3001/complete-anonymized \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate a response to customer Mary Smith at mary@email.com regarding order #12345",
    "systemMessage": "You are a helpful customer service agent"
  }'
```

### Email Generation
```bash
curl -X POST http://localhost:3001/complete-anonymized \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a professional follow-up email to Bob Wilson at bob@company.com",
    "maxTokens": 300,
    "temperature": 0.7
  }'
```

### Content Summarization
```bash
curl -X POST http://localhost:3001/complete \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Summarize this text: [your text here]",
    "maxTokens": 150
  }'
```

## 🔐 Privacy Flow

```
Your Prompt → Anonymize PII → OpenAI → Deanonymize → Final Response
   ↓                ↓             ↓           ↓              ↓
"Email to        "Email to    AI generates  "Email to    "Email to
John Doe at      NAME_xxx at  response with  NAME_xxx at  John Doe at
john@email.com"  EMAIL_yyy"   tokens        EMAIL_yyy"   john@email.com"
```

## 💰 Cost Estimate

**GPT-3.5-Turbo** (Recommended):
- ~$0.001 per request (typical)
- 1000 requests ≈ $1.00

**GPT-4** (Premium):
- ~$0.03 per request (typical)
- 100 requests ≈ $3.00

## ⚙️ Configuration Options

```json
{
  "prompt": "Your prompt here",
  "model": "gpt-3.5-turbo",      // or "gpt-4"
  "maxTokens": 500,               // 1-4096
  "temperature": 0.7,             // 0-1 (creativity)
  "systemMessage": "You are..."   // Set AI behavior
}
```

## 🐛 Troubleshooting

### No OpenAI endpoints showing?
**Check**: Do you have `OPENAI_API_KEY` in `.env`?

### "OpenAI service is not configured"
**Fix**: Add `OPENAI_API_KEY=sk-...` to `.env` and restart server

### "Invalid API key"
**Fix**: 
- Check key format (starts with `sk-`)
- Verify in OpenAI dashboard
- Check for spaces in `.env`

### High costs?
**Tips**:
- Use `gpt-3.5-turbo` instead of `gpt-4`
- Set lower `maxTokens` (e.g., 200 instead of 1000)
- Monitor usage in OpenAI dashboard

## 📚 Full Documentation

For detailed information, see:
- [OPENAI_SETUP.md](OPENAI_SETUP.md) - Complete setup guide
- [README.md](README.md) - Full project documentation

## ✅ Checklist

- [ ] OpenAI API key obtained
- [ ] Added to `.env` file
- [ ] Ran `npm install`
- [ ] Server started successfully
- [ ] Tested `/complete` endpoint
- [ ] Tested `/complete-anonymized` endpoint
- [ ] `node test-openai.js` passes

## 🎉 You're Ready!

Start building AI-powered applications with built-in PII protection! 🚀




