# ✅ Fix 500 Error - Quick Checklist

## 🎯 Problem
Your `/secureChatGPT` endpoint is returning **500 Internal Server Error** because the **OpenAI API key is missing**.

## 🔧 Solution (3 Steps)

### Step 1: Create `.env` File

The server needs a `.env` file with your OpenAI API key. Create it in the project root:

**Windows PowerShell:**
```powershell
@"
MONGODB_URI=mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Or manually create `.env` file:**
```
MONGODB_URI=mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
```

### Step 2: Get Your OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Replace `sk-your-openai-api-key-here` in `.env` with your actual key

**Important:** Make sure you have credits or a payment method in your OpenAI account!

### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C if running)
# Start it again
npm start
```

You should see:
```
✅ OpenAI service initialized
✅ MongoDB Connected: ...
🛡️  Secure ChatGPT endpoint: http://localhost:3001/secureChatGPT
```

---

## 🧪 Verify It Works

### Test 1: Check OpenAI Connection
```bash
node test-openai.js
```

Expected: ✅ OpenAI service is working correctly

### Test 2: Test the Endpoint
```bash
node test-secure-chatgpt-detailed.js
```

Expected: All tests should pass ✅

### Test 3: Manual Test
```bash
curl -X POST http://localhost:3001/secureChatGPT -H "Content-Type: application/json" -d "{\"prompt\":\"Say hello to John Doe at john@example.com\"}"
```

Expected: JSON response with `"response"` field

---

## 🆘 Still Not Working?

### Check 1: Is `.env` file created?
```bash
# Windows PowerShell
Test-Path .env
```
Should return: `True`

### Check 2: Does `.env` have the API key?
```bash
# Windows PowerShell
Get-Content .env
```
Should show your API key starting with `sk-`

### Check 3: Is the server showing the OpenAI initialization?
When you run `npm start`, look for:
```
✅ OpenAI service initialized
```

If you see:
```
⚠️  OpenAI API key not found. OpenAI features will be disabled.
```
Then the `.env` file is not being read correctly.

### Check 4: Run detailed tests
```bash
node test-secure-chatgpt-detailed.js
```
This will show you the exact error message.

---

## 📞 Common Issues

| Issue | Solution |
|-------|----------|
| "Module not found: dotenv" | Run `npm install` |
| "OpenAI API key not found" | Create `.env` file with API key |
| "invalid_api_key" | Check your API key is correct |
| "insufficient_quota" | Add payment method to OpenAI account |
| Server not starting | Check MongoDB connection string |

---

## 📚 More Help

- **Setup Wizard:** `node setup-wizard.js`
- **Detailed Troubleshooting:** See `TROUBLESHOOTING_500_ERROR.md`
- **OpenAI Setup Guide:** See `OPENAI_SETUP.md`
- **MongoDB Setup Guide:** See `MONGODB_SETUP.md`




