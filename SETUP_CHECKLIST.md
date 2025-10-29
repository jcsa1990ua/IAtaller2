# Setup Checklist - MongoDB Atlas Integration

Follow this checklist to set up MongoDB persistence for your Data Privacy Vault.

## 📋 Pre-Setup Checklist

- [ ] Node.js is installed (v14 or higher)
- [ ] npm is installed
- [ ] MongoDB Atlas connection string is available
- [ ] Text editor or IDE is ready

## 🚀 Setup Steps

### Step 1: Install Dependencies ⏱️ (~2 minutes)

```bash
npm install
```

**Expected output:**
```
added 50+ packages
```

**Verify:**
- [ ] `node_modules/` folder created
- [ ] `mongoose` installed
- [ ] `dotenv` installed

---

### Step 2: Create Environment File ⏱️ (~1 minute)

Create a file named `.env` in the project root:

```bash
MONGODB_URI=mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
NODE_ENV=development
```

**Verify:**
- [ ] `.env` file exists in project root
- [ ] MongoDB URI is correct
- [ ] No extra spaces or line breaks

---

### Step 3: Start the Server ⏱️ (~10 seconds)

```bash
npm start
```

**Expected output:**
```
✅ MongoDB Connected: cluster0-shard-00-00.t92aben.mongodb.net
📁 Database: data-privacy-vault
Mongoose connected to MongoDB Atlas
🚀 Data Privacy Vault server running on port 3001
📊 Health check available at: http://localhost:3001/health
🔒 Anonymization endpoint: http://localhost:3001/anonymize
🔓 Deanonymization endpoint: http://localhost:3001/deanonymize
💾 Using MongoDB Atlas for persistent storage
```

**Verify:**
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Database name shows as `data-privacy-vault`

---

### Step 4: Test Health Endpoint ⏱️ (~5 seconds)

```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{
  "status": "OK",
  "service": "Data Privacy Vault",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Verify:**
- [ ] `status` is `"OK"`
- [ ] `database` is `"connected"`
- [ ] Response received successfully

---

### Step 5: Test Anonymization ⏱️ (~5 seconds)

```bash
curl -X POST http://localhost:3001/anonymize \
  -H "Content-Type: application/json" \
  -d '{"message":"oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"}'
```

**Expected response:**
```json
{
  "anonymizedMessage": "oferta de trabajo para NAME_c1b4ed05 NAME_41ef81fe con email EMAIL_8004719c y teléfono PHONE_40e83067"
}
```

**Verify:**
- [ ] Response contains `anonymizedMessage`
- [ ] Names replaced with `NAME_` tokens
- [ ] Email replaced with `EMAIL_` token
- [ ] Phone replaced with `PHONE_` token

---

### Step 6: Test Deanonymization ⏱️ (~5 seconds)

Use the anonymized message from Step 5:

```bash
curl -X POST http://localhost:3001/deanonymize \
  -H "Content-Type: application/json" \
  -d '{"anonymizedMessage":"oferta de trabajo para NAME_c1b4ed05 NAME_41ef81fe con email EMAIL_8004719c y teléfono PHONE_40e83067"}'
```

**Expected response:**
```json
{
  "message": "oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"
}
```

**Verify:**
- [ ] Original message restored correctly
- [ ] Names restored
- [ ] Email restored
- [ ] Phone number restored

---

### Step 7: Test MongoDB Persistence ⏱️ (~30 seconds)

```bash
node test-mongodb.js
```

**Expected output:**
```
🧪 Testing MongoDB Persistence

📡 Connecting to MongoDB...
✅ MongoDB Connected: ...
...
✅ All tests completed successfully!
```

**Verify:**
- [ ] All tests pass
- [ ] Anonymization works
- [ ] Deanonymization works
- [ ] Persistence works after "restart"

---

### Step 8: Verify Data in MongoDB Atlas ⏱️ (~2 minutes)

1. Go to https://cloud.mongodb.com/
2. Sign in with your credentials
3. Click on your cluster
4. Click "Browse Collections"
5. Select `data-privacy-vault` database
6. Click on `tokenmappings` collection

**Verify:**
- [ ] Database `data-privacy-vault` exists
- [ ] Collection `tokenmappings` exists
- [ ] Documents are visible
- [ ] Token mappings are stored

---

## ✅ Final Verification

Run through this final checklist:

- [ ] Server starts without errors
- [ ] MongoDB connection is successful
- [ ] Health endpoint returns `"database": "connected"`
- [ ] Anonymization creates tokens
- [ ] Deanonymization restores original text
- [ ] Token mappings visible in MongoDB Atlas
- [ ] test-mongodb.js passes all tests
- [ ] Data persists after server restart

---

## 🎉 Success Criteria

Your setup is successful when **ALL** of these are true:

1. ✅ Server starts with MongoDB connection message
2. ✅ Health check shows database connected
3. ✅ Anonymization works (returns tokens)
4. ✅ Deanonymization works (restores original)
5. ✅ Data visible in MongoDB Atlas
6. ✅ Test script passes all tests
7. ✅ Data persists after restart

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'mongoose'"
**Solution:** Run `npm install`

### Issue: "MongoDB connection error"
**Solution:** 
- Check internet connection
- Verify `.env` file exists
- Check MongoDB URI is correct
- Ensure cluster is running in Atlas

### Issue: "database: disconnected"
**Solution:**
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
- Verify username/password in connection string
- Check cluster is not paused

### Issue: "Cannot connect to localhost:27017"
**Solution:**
- You're using wrong connection string
- Check `.env` has Atlas URI (starts with `mongodb+srv://`)

### Issue: curl not recognized (Windows)
**Solution:** Use PowerShell commands from QUICK_START_MONGODB.md

---

## 📚 Documentation Reference

- Quick Start: [QUICK_START_MONGODB.md](QUICK_START_MONGODB.md)
- Detailed Setup: [MONGODB_SETUP.md](MONGODB_SETUP.md)
- Migration Info: [MONGODB_MIGRATION_SUMMARY.md](MONGODB_MIGRATION_SUMMARY.md)
- Main Docs: [README.md](README.md)

---

## 🆘 Need Help?

If you're stuck:

1. Read the error message carefully
2. Check the troubleshooting section above
3. Review [MONGODB_SETUP.md](MONGODB_SETUP.md)
4. Verify all checkboxes are completed
5. Check MongoDB Atlas cluster status

---

## ⏱️ Total Setup Time

- **Experienced User:** ~5 minutes
- **First Time Setup:** ~15 minutes
- **With MongoDB Atlas Setup:** ~30 minutes

---

**You're ready to go!** 🚀




