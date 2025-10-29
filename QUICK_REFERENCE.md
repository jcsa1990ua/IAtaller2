# Quick Reference Card - Secure ChatGPT

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure .env file
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
PORT=3001

# 3. Start server
npm start

# 4. Test endpoint
curl -X POST http://localhost:3001/secureChatGPT \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write to John Doe at john@example.com"}'
```

## 📡 Main Endpoint

### POST `/secureChatGPT` ⭐

**Minimal Request:**
```json
{
  "prompt": "Your text with PII here"
}
```

**Full Request:**
```json
{
  "prompt": "Your text here",
  "model": "gpt-3.5-turbo",
  "maxTokens": 500,
  "temperature": 0.7,
  "systemMessage": "You are a helpful assistant"
}
```

**Response:**
```json
{
  "response": "AI response with PII restored",
  "model": "gpt-3.5-turbo-0125",
  "tokensUsed": 150,
  "finishReason": "stop"
}
```

## 🔄 Workflow

```
Your Prompt → Anonymize → ChatGPT → Deanonymize → Final Response
    ↓             ↓           ↓            ↓             ↓
"Email to     "Email to   AI generates  "Email to    "Email to
John Doe"     NAME_xxx"   response      NAME_xxx"    John Doe"
```

## 📋 All Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/secureChatGPT` | POST | AI with PII protection ⭐ |
| `/anonymize` | POST | Anonymize text |
| `/deanonymize` | POST | Restore original text |
| `/complete` | POST | Direct OpenAI (no protection) |
| `/health` | GET | Server health check |

## 🧪 Testing

```bash
# Run tests (server must be running)
node test-secure-chatgpt.js

# Start server
npm start

# Check health
curl http://localhost:3001/health
```

## 💡 Common Use Cases

**Customer Service:**
```json
{
  "prompt": "Respond to Sarah at sarah@email.com about delay",
  "systemMessage": "You are a customer service agent"
}
```

**Email Generation:**
```json
{
  "prompt": "Write to John Doe at john@company.com about meeting"
}
```

**Spanish Content:**
```json
{
  "prompt": "Escribe a María González en maria@empresa.com",
  "systemMessage": "Eres un asistente en español"
}
```

## ⚙️ Configuration

**Models:**
- `gpt-3.5-turbo` (default, fast, cheap)
- `gpt-4` (slower, expensive, better quality)

**Temperature:**
- `0.0-0.3`: Focused and consistent
- `0.4-0.7`: Balanced (default: 0.7)
- `0.8-1.0`: Creative and varied

**Max Tokens:**
- `100-200`: Short responses
- `300-500`: Medium responses (default: 500)
- `500-1000`: Long responses

## 💰 Costs

| Model | Per Request | Per 1K Requests |
|-------|-------------|-----------------|
| GPT-3.5 | ~$0.001 | ~$1.00 |
| GPT-4 | ~$0.03 | ~$30.00 |

## 🐛 Troubleshooting

**503 Error:**
- Missing OPENAI_API_KEY in .env

**400 Error:**
- Missing or empty `prompt` field

**500 Error:**
- Check server logs
- Verify MongoDB connection
- Verify OpenAI API key

**Slow responses:**
- Normal (1-3 seconds for AI)
- Reduce `maxTokens` for faster responses

## 📚 Documentation

- `README.md` - Complete guide
- `SECURE_CHATGPT_SUMMARY.md` - Implementation details
- `OPENAI_SETUP.md` - OpenAI setup
- `MONGODB_SETUP.md` - MongoDB setup

## 🔐 Security Notes

- ✅ PII never sent to OpenAI
- ✅ Tokens stored in MongoDB
- ✅ Automatic anonymization/deanonymization
- ✅ All credentials in .env (not in code)

## ✅ Health Check

```bash
curl http://localhost:3001/health
```

Expected:
```json
{
  "status": "OK",
  "database": "connected"
}
```

## 🎯 Status Codes

- `200`: Success
- `400`: Bad request (check prompt)
- `500`: Server error (check logs)
- `503`: Service unavailable (check API key)

---

**Need Help?** Check README.md or SECURE_CHATGPT_SUMMARY.md




