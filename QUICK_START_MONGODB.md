# Quick Start Guide - MongoDB Atlas Integration

Your Data Privacy Vault now has MongoDB Atlas persistence! 🎉

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create `.env` File

Create a file named `.env` in the project root with this content:

```
MONGODB_URI=mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
NODE_ENV=development
```

### Step 3: Start the Server

```bash
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.t92aben.mongodb.net
📁 Database: data-privacy-vault
🚀 Data Privacy Vault server running on port 3001
💾 Using MongoDB Atlas for persistent storage
```

## ✅ Test It!

### Test 1: Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "service": "Data Privacy Vault",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Anonymize
```bash
curl -X POST http://localhost:3001/anonymize \
  -H "Content-Type: application/json" \
  -d '{"message":"oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"}'
```

### Test 3: Deanonymize
```bash
curl -X POST http://localhost:3001/deanonymize \
  -H "Content-Type: application/json" \
  -d '{"anonymizedMessage":"oferta de trabajo para NAME_c1b4ed05 NAME_41ef81fe con email EMAIL_8004719c y teléfono PHONE_40e83067"}'
```

### Test 4: MongoDB Persistence Test
```bash
node test-mongodb.js
```

## 🎯 What's New?

### ✅ Persistent Storage
- Token mappings are now stored in MongoDB Atlas
- Data survives server restarts
- Automatic backups in the cloud

### ✅ New Files Created
- `config/database.js` - MongoDB connection
- `models/TokenMapping.js` - Mongoose schema
- `src/anonymizer-db.js` - MongoDB-backed anonymizer
- `test-mongodb.js` - MongoDB tests
- `MONGODB_SETUP.md` - Detailed setup guide

### ✅ Updated Files
- `package.json` - Added mongoose & dotenv
- `server.js` - Uses MongoDB connection
- `README.md` - Updated with MongoDB info

## 🔧 PowerShell Testing (Windows)

If `curl` doesn't work, use PowerShell:

### Anonymize:
```powershell
$body = @{
    message = "oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/anonymize" -Method POST -Body $body -ContentType "application/json"
```

### Deanonymize:
```powershell
$body = @{
    anonymizedMessage = "oferta de trabajo para NAME_c1b4ed05 NAME_41ef81fe con email EMAIL_8004719c y teléfono PHONE_40e83067"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/deanonymize" -Method POST -Body $body -ContentType "application/json"
```

## 📊 View Data in MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Sign in
3. Click on your cluster
4. Click "Browse Collections"
5. Select `data-privacy-vault` database
6. View `tokenmappings` collection

## 🐛 Troubleshooting

### "Cannot find module 'mongoose'"
```bash
npm install
```

### "MongoDB connection error"
- Check internet connection
- Verify `.env` file exists
- Check MongoDB URI is correct

### "ECONNREFUSED 127.0.0.1:27017"
- You're trying to connect to local MongoDB instead of Atlas
- Check your `.env` file has the correct Atlas URI

## 📚 Next Steps

- Read [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed info
- Check out [README.md](README.md) for full documentation
- Explore MongoDB Atlas dashboard for monitoring

## 🎉 You're All Set!

Your Data Privacy Vault is now using MongoDB Atlas for persistent, scalable storage!




