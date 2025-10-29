# Troubleshooting 500 Errors in secureChatGPT Endpoint

## 🔍 Problem
All tests to the `/secureChatGPT` endpoint are failing with **500 Internal Server Error**.

## 🎯 Most Common Causes

### 1. **Missing OpenAI API Key** (Most Likely)
The server needs an OpenAI API key to function, but it's not configured.

**Solution:**
```bash
# Create a .env file in the project root
MONGODB_URI=mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
```

**How to get an OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add it to your `.env` file

### 2. **OpenAI Service Not Initialized**
If the API key is missing or invalid, the `openaiService` will be `null`.

**Check server logs:**
When you start the server, you should see:
```
✅ OpenAI service initialized
```

If you see this instead:
```
⚠️  OpenAI API key not found. OpenAI features will be disabled.
```

Then the API key is missing.

### 3. **Invalid or Expired API Key**
The API key might be incorrect or expired.

**Symptoms:**
- Server starts but endpoint returns 500
- Error message mentions "invalid_api_key" or "authentication"

**Solution:**
- Generate a new API key from OpenAI dashboard
- Make sure there are no extra spaces in the .env file
- Format should be: `OPENAI_API_KEY=sk-...` (no quotes, no spaces)

### 4. **OpenAI Account Issues**
Your OpenAI account might have issues.

**Common issues:**
- No payment method configured
- Rate limit exceeded
- Account suspended
- Insufficient credits

**Check:**
- Visit https://platform.openai.com/account/billing
- Ensure you have credits or a valid payment method
- Check usage limits: https://platform.openai.com/account/limits

### 5. **MongoDB Connection Issues**
If MongoDB is not connected, anonymization might fail.

**Check:**
When server starts, you should see:
```
✅ MongoDB Connected: ac-babhtzc-shard-00-00.t92aben.mongodb.net
```

### 6. **Network/Firewall Issues**
Your network might be blocking OpenAI API calls.

**Test:**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 🧪 Diagnostic Steps

### Step 1: Check Environment Variables
```bash
# On Windows PowerShell (in project directory)
Get-Content .env
```

Expected output:
```
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
PORT=3001
```

### Step 2: Check Server Logs
Look at the terminal where you ran `npm start` and check for:
- ✅ OpenAI service initialized
- ✅ MongoDB Connected
- Any error messages

### Step 3: Test with Detailed Error Script
Run the detailed test to see the actual error:
```bash
node test-secure-chatgpt-detailed.js
```

This will show the exact error message from the server.

### Step 4: Check Server Health
```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "OK",
  "service": "Data Privacy Vault",
  "database": "connected",
  "timestamp": "2025-10-28T..."
}
```

### Step 5: Test OpenAI Directly
```bash
node test-openai.js
```

This will test if your OpenAI API key works.

## 🔧 Quick Fixes

### Fix 1: Create .env File
```bash
# Create .env file (Windows PowerShell)
@"
MONGODB_URI=mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0
OPENAI_API_KEY=sk-proj-your-key-here
PORT=3001
"@ | Out-File -FilePath .env -Encoding UTF8
```

### Fix 2: Restart the Server
After creating/updating `.env`:
```bash
# Stop the server (Ctrl+C)
# Start it again
npm start
```

### Fix 3: Verify OpenAI Integration
```bash
# Test OpenAI connection
node test-openai.js
```

### Fix 4: Test Step by Step
```bash
# Test anonymization only (doesn't need OpenAI)
curl -X POST http://localhost:3001/anonymize -H "Content-Type: application/json" -d "{\"message\":\"Test for John Doe\"}"

# Test with OpenAI
curl -X POST http://localhost:3001/secureChatGPT -H "Content-Type: application/json" -d "{\"prompt\":\"Say hello\"}"
```

## 📋 Complete Checklist

- [ ] `.env` file exists in project root
- [ ] `OPENAI_API_KEY` is in `.env` file
- [ ] API key starts with `sk-`
- [ ] No extra spaces in `.env` file
- [ ] Server shows "✅ OpenAI service initialized"
- [ ] Server shows "✅ MongoDB Connected"
- [ ] OpenAI account has credits/payment method
- [ ] `node test-openai.js` passes
- [ ] Health endpoint returns 200 OK

## 🆘 Still Not Working?

### Get Detailed Error Information
1. Make sure server is running (`npm start`)
2. Run: `node test-secure-chatgpt-detailed.js`
3. Look for the "ERROR DETAILS" section
4. Share the error message for more specific help

### Common Error Messages and Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `invalid_api_key` | Wrong API key | Get a new key from OpenAI |
| `insufficient_quota` | No credits | Add payment method to OpenAI account |
| `rate_limit_exceeded` | Too many requests | Wait a few minutes |
| `model_not_found` | Invalid model name | Use `gpt-3.5-turbo` or `gpt-4` |
| `Service unavailable` | OpenAI service not initialized | Check `.env` file and restart server |

## 📞 Need More Help?

If you're still experiencing issues, gather this information:
1. Output of: `node test-secure-chatgpt-detailed.js`
2. Server startup logs
3. Content of `.env` file (hide actual API key)
4. Output of: `node test-openai.js`




