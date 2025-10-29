# MongoDB Atlas Setup Guide

This guide explains how to set up MongoDB persistence for the Data Privacy Vault.

## 🎯 What Changed

The Data Privacy Vault now uses **MongoDB Atlas** for persistent storage instead of in-memory storage. This means:

- ✅ Token mappings survive server restarts
- ✅ Data is stored securely in the cloud
- ✅ Scalable and production-ready
- ✅ Automatic backups and monitoring

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install the new dependencies:
- `mongoose` - MongoDB ODM for Node.js
- `dotenv` - Environment variable management

### 2. Create Environment File

Create a `.env` file in the project root:

```bash
# .env file
MONGODB_URI=mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0

PORT=3001
NODE_ENV=development
```

**Note**: The `.env` file is already in `.gitignore` to keep your credentials secure.

### 3. Start the Server

```bash
npm start
```

You should see output like:
```
✅ MongoDB Connected: cluster0-shard-00-00.t92aben.mongodb.net
📁 Database: data-privacy-vault
🚀 Data Privacy Vault server running on port 3001
💾 Using MongoDB Atlas for persistent storage
```

## 🧪 Testing MongoDB Persistence

Run the MongoDB test script:

```bash
node test-mongodb.js
```

This will test:
1. ✅ Anonymization with database storage
2. ✅ Token mapping retrieval
3. ✅ Deanonymization from database
4. ✅ Persistence across "restarts"

## 📊 MongoDB Collections

The app creates the following collection in MongoDB:

### `tokenmappings` Collection

```javascript
{
  _id: ObjectId,
  token: "EMAIL_8004719c",     // The prefixed token
  original: "user@example.com", // Original PII data
  type: "email",                // Type of PII
  hash: "8004719c",            // 8-character hash
  createdAt: Date,             // Creation timestamp
  lastUsed: Date,              // Last usage timestamp
  usageCount: Number           // Usage counter
}
```

## 🔍 Viewing Data in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in with your credentials
3. Navigate to your cluster
4. Click "Browse Collections"
5. Select the `data-privacy-vault` database
6. View the `tokenmappings` collection

## 🔄 API Changes

The API endpoints remain the same, but now they're asynchronous:

### POST /anonymize
```bash
curl -X POST http://localhost:3001/anonymize \
  -H "Content-Type: application/json" \
  -d '{"message":"oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"}'
```

### POST /deanonymize
```bash
curl -X POST http://localhost:3001/deanonymize \
  -H "Content-Type: application/json" \
  -d '{"anonymizedMessage":"oferta de trabajo para NAME_c1b4ed05 NAME_41ef81fe con email EMAIL_8004719c y teléfono PHONE_40e83067"}'
```

### GET /health
```bash
curl http://localhost:3001/health
```

Response now includes database status:
```json
{
  "status": "OK",
  "service": "Data Privacy Vault",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🛠️ Project Structure

```
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   └── TokenMapping.js      # Mongoose schema for token mappings
├── src/
│   ├── anonymizer.js        # Original in-memory version (kept for reference)
│   └── anonymizer-db.js     # New MongoDB-backed version
├── server.js               # Updated to use MongoDB
├── test-mongodb.js         # MongoDB persistence tests
├── .env                    # Environment variables (not in git)
├── .env.example           # Example environment file
└── package.json           # Updated with mongoose & dotenv
```

## 🔐 Security Considerations

### Production Deployment

For production, you should:

1. **Use Environment Variables**: Never hardcode credentials in code
2. **Rotate Credentials**: Regularly update MongoDB passwords
3. **IP Whitelist**: Configure MongoDB Atlas to only accept connections from your server IPs
4. **Enable Encryption**: Use SSL/TLS for MongoDB connections (already enabled)
5. **Backup Strategy**: Configure automated backups in MongoDB Atlas
6. **Monitoring**: Set up alerts for database issues

### Example Production Setup

```bash
# Production .env
MONGODB_URI=mongodb+srv://prod_user:secure_password@cluster0.xxxxx.mongodb.net/privacy-vault-prod?retryWrites=true&w=majority
PORT=3001
NODE_ENV=production
```

## 📈 Performance Considerations

- **Indexes**: The schema includes indexes on `token`, `type`, and `createdAt` for fast queries
- **Connection Pooling**: Mongoose automatically handles connection pooling
- **Caching**: Consider adding Redis for frequently accessed tokens
- **Sharding**: MongoDB Atlas can scale horizontally as your data grows

## 🐛 Troubleshooting

### Connection Issues

If you see connection errors:

1. Check your internet connection
2. Verify the MongoDB URI in `.env`
3. Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for testing)
4. Ensure your MongoDB Atlas cluster is running

### Database Not Found

The database `data-privacy-vault` will be created automatically on first use.

### Slow Queries

If queries are slow:
- Check MongoDB Atlas metrics
- Ensure indexes are properly created
- Consider upgrading your cluster tier

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)

## ✅ Verification Checklist

- [ ] MongoDB dependencies installed (`npm install`)
- [ ] `.env` file created with correct MongoDB URI
- [ ] Server starts without errors
- [ ] Health check shows `database: "connected"`
- [ ] Anonymization works and stores data in MongoDB
- [ ] Deanonymization retrieves data from MongoDB
- [ ] MongoDB test script passes all tests

## 🎉 Success!

Your Data Privacy Vault now has persistent storage with MongoDB Atlas! Token mappings will survive server restarts and be securely stored in the cloud.




