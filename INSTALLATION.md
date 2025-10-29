# Installation Guide for Data Privacy Vault

## Prerequisites

Before running the Data Privacy Vault, you need to install Node.js and npm.

### Installing Node.js

1. **Download Node.js:**
   - Go to https://nodejs.org/
   - Download the LTS version (recommended)
   - Choose the Windows Installer (.msi) for your system

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard
   - Make sure to check "Add to PATH" during installation

3. **Verify Installation:**
   Open PowerShell or Command Prompt and run:
   ```bash
   node --version
   npm --version
   ```

## Project Setup

Once Node.js is installed, follow these steps:

1. **Navigate to the project directory:**
   ```bash
   cd "C:\Users\julio\Documents\MAESTRIA\Coursera\7. IA para negocios digitales\Modulo 4\Desarrollo Taller 2"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Test the implementation:**
   ```bash
   node test.js
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   Or for development mode with auto-restart:
   ```bash
   npm run dev
   ```

5. **Test the API endpoints:**
   
   **Test Anonymization:**
   ```bash
   curl -X POST http://localhost:3001/anonymize -H "Content-Type: application/json" -d '{\"message\":\"oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157\"}'
   ```
   
   **Test Deanonymization:**
   ```bash
   curl -X POST http://localhost:3001/deanonymize -H "Content-Type: application/json" -d '{\"anonymizedMessage\":\"oferta de trabajo para NAME_e1be92e2b3a5 con email EMAIL_8004719c6ea5 y teléfono PHONE_40e83067b9cb\"}'
   ```

## Alternative Testing Methods

If curl is not available, you can test using:

### PowerShell with Invoke-RestMethod:
```powershell
$body = @{
    message = "oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/anonymize" -Method POST -Body $body -ContentType "application/json"
```

### Using Postman or any REST client:
- URL: `http://localhost:3001/anonymize`
- Method: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "message": "oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"
}
```

## Expected Responses

**Anonymization Response:**
```json
{
  "anonymizedMessage": "oferta de trabajo para NAME_e1be92e2b3a5 con email EMAIL_8004719c6ea5 y teléfono PHONE_40e83067b9cb"
}
```

**Deanonymization Response:**
```json
{
  "message": "oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"
}
```

Note: The exact tokens may vary as they are generated based on the input content, but they will always follow the format `TYPE_8characterhash`.
