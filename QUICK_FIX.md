# ⚡ Quick Fix - 500 Error (2 Minutes)

## The Problem
Your tests are failing because the **OpenAI API key is missing**.

## The Solution (3 Commands)

### 1️⃣ Create `.env` File (Copy-Paste This)

**Windows PowerShell** (Run in project folder):
```powershell
@"
MONGODB_URI=mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0
OPENAI_API_KEY=sk-REPLACE-THIS-WITH-YOUR-KEY
PORT=3001
"@ | Out-File -FilePath .env -Encoding UTF8
```

### 2️⃣ Get OpenAI API Key

1. Open: https://platform.openai.com/api-keys
2. Sign in (or create free account)
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Open `.env` file
6. Replace `sk-REPLACE-THIS-WITH-YOUR-KEY` with your key
7. Save the file

### 3️⃣ Restart Server & Test

```bash
# Stop server if running (Ctrl+C)
npm start

# In another terminal, test:
node test-secure-chatgpt-detailed.js
```

---

## ✅ Success Looks Like This:

When you run `npm start`:
```
✅ MongoDB Connected: ac-babhtzc-shard-00-00.t92aben.mongodb.net
✅ OpenAI service initialized
🚀 Data Privacy Vault server running on port 3001
🛡️  Secure ChatGPT endpoint: http://localhost:3001/secureChatGPT
```

When you run tests:
```
📝 Test 1: Simple Prompt with PII
Status: ✅ PASS

📝 Test 2: Multiple PII Items
Status: ✅ PASS

📝 Test 3: Spanish Names
Status: ✅ PASS

📝 Test 4: Customer Service Scenario
Status: ✅ PASS
```

---

## ⚠️ Common Mistakes

### ❌ Wrong:
```
OPENAI_API_KEY="sk-abc123..."
```
(No quotes needed)

### ❌ Wrong:
```
OPENAI_API_KEY = sk-abc123...
```
(No spaces around `=`)

### ✅ Correct:
```
OPENAI_API_KEY=sk-abc123...
```

---

## 🆘 Need Help?

### If you don't have an OpenAI account:
1. Go to: https://platform.openai.com/signup
2. Sign up (it's free)
3. Add payment method (required for API access)
4. Free trial credits: $5 (enough for thousands of requests)

### If you see other errors:
Run for detailed diagnostics:
```bash
node test-secure-chatgpt-detailed.js
```

### For more help:
- 📋 Detailed steps: `FIX_500_ERROR_CHECKLIST.md`
- 🔍 Diagnostics: `DIAGNOSIS_SUMMARY.md`
- 🛠️  Setup wizard: `node setup-wizard.js`

---

## 💡 Why This Happened

The `/secureChatGPT` endpoint needs to:
1. Anonymize your prompt (removes PII)
2. **Send it to OpenAI ChatGPT** ← Needs API key
3. Get response
4. Deanonymize response (restore PII)

Without the API key, step 2 fails → 500 error.

---

## 💰 Cost

GPT-3.5-Turbo is very cheap:
- ~$0.0015 per 1,000 tokens
- Average request: ~100 tokens = $0.00015
- Your 4 test requests: ~$0.0006

New accounts usually get $5 in free credits! 🎉




