/**
 * Data Privacy Vault - PII Anonymization Service with MongoDB Persistence
 * 
 * This service provides an endpoint to anonymize Personally Identifiable Information (PII)
 * in text messages by replacing names, emails, and phone numbers with alphanumeric tokens.
 * All mappings are stored in MongoDB Atlas for persistence.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, OPENAI_API_KEY } = require('./config/database');
const anonymizer = require('./src/anonymizer-db');
const OpenAIService = require('./services/OpenAIService');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI service
let openaiService = null;
if (OPENAI_API_KEY) {
  openaiService = new OpenAIService(OPENAI_API_KEY);
  console.log('✅ OpenAI service initialized');
} else {
  console.warn('⚠️  OpenAI API key not found. OpenAI features will be disabled.');
}

// Middleware setup
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'OK',
    service: 'Data Privacy Vault',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /anonymize endpoint
 * 
 * Receives a message containing PII and returns an anonymized version
 * 
 * @param {Object} req.body - Request body containing the message
 * @param {string} req.body.message - The message to anonymize
 * @returns {Object} Response with anonymized message
 */
app.post('/anonymize', async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body.message !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must contain a "message" field with a string value'
      });
    }

    const { message } = req.body;

    // Validate message is not empty
    if (!message.trim()) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Message cannot be empty'
      });
    }

    // Anonymize the message (now async)
    const anonymizedMessage = await anonymizer.anonymizeMessage(message);

    // Return the anonymized message
    res.status(200).json({
      anonymizedMessage: anonymizedMessage
    });

  } catch (error) {
    console.error('Error in /anonymize endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing the request'
    });
  }
});

/**
 * POST /deanonymize endpoint
 * 
 * Receives an anonymized message and returns the original message with PII restored
 * 
 * @param {Object} req.body - Request body containing the anonymized message
 * @param {string} req.body.anonymizedMessage - The anonymized message to restore
 * @returns {Object} Response with original message
 */
app.post('/deanonymize', async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body.anonymizedMessage !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must contain an "anonymizedMessage" field with a string value'
      });
    }

    const { anonymizedMessage } = req.body;

    // Validate message is not empty
    if (!anonymizedMessage.trim()) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Anonymized message cannot be empty'
      });
    }

    // Deanonymize the message (now async)
    const originalMessage = await anonymizer.deanonymizeMessage(anonymizedMessage);

    // Return the original message
    res.status(200).json({
      message: originalMessage
    });

  } catch (error) {
    console.error('Error in /deanonymize endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing the request'
    });
  }
});

/**
 * POST /complete endpoint
 * 
 * Generates a text completion using OpenAI
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.prompt - The prompt for completion
 * @param {string} req.body.model - Model to use (optional, default: gpt-3.5-turbo)
 * @param {number} req.body.maxTokens - Max tokens in response (optional)
 * @param {number} req.body.temperature - Temperature (optional)
 * @param {string} req.body.systemMessage - System message (optional)
 * @returns {Object} Response with completion text
 */
app.post('/complete', async (req, res) => {
  try {
    // Check if OpenAI service is available
    if (!openaiService) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'OpenAI service is not configured. Please set OPENAI_API_KEY environment variable.'
      });
    }

    // Validate request body
    if (!req.body || typeof req.body.prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must contain a "prompt" field with a string value'
      });
    }

    const { prompt, model, maxTokens, temperature, systemMessage } = req.body;

    // Validate prompt is not empty
    if (!prompt.trim()) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt cannot be empty'
      });
    }

    // Generate completion
    const completion = await openaiService.generateCompletion(prompt, {
      model,
      maxTokens,
      temperature,
      systemMessage
    });

    // Return the completion
    res.status(200).json({
      completion: completion.text,
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.finishReason
    });

  } catch (error) {
    console.error('Error in /complete endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while generating completion'
    });
  }
});

/**
 * POST /complete-anonymized endpoint
 * 
 * Anonymizes PII in prompt, sends to OpenAI, then deanonymizes the response
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.prompt - The prompt with PII
 * @param {string} req.body.model - Model to use (optional)
 * @param {number} req.body.maxTokens - Max tokens (optional)
 * @param {number} req.body.temperature - Temperature (optional)
 * @param {string} req.body.systemMessage - System message (optional)
 * @returns {Object} Response with completion and anonymization info
 */
app.post('/complete-anonymized', async (req, res) => {
  try {
    // Check if OpenAI service is available
    if (!openaiService) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'OpenAI service is not configured'
      });
    }

    // Validate request body
    if (!req.body || typeof req.body.prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must contain a "prompt" field'
      });
    }

    const { prompt, model, maxTokens, temperature, systemMessage } = req.body;

    // Step 1: Anonymize the prompt
    const anonymizedPrompt = await anonymizer.anonymizeMessage(prompt);

    // Step 2: Send anonymized prompt to OpenAI
    const completion = await openaiService.generateCompletion(anonymizedPrompt, {
      model,
      maxTokens,
      temperature,
      systemMessage
    });

    // Step 3: Deanonymize the response
    const deanonymizedCompletion = await anonymizer.deanonymizeMessage(completion.text);

    // Return both versions
    res.status(200).json({
      originalPrompt: prompt,
      anonymizedPrompt: anonymizedPrompt,
      anonymizedCompletion: completion.text,
      completion: deanonymizedCompletion,
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.finishReason
    });

  } catch (error) {
    console.error('Error in /complete-anonymized endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing the request'
    });
  }
});

/**
 * POST /secureChatGPT endpoint
 * 
 * Secure ChatGPT endpoint with automatic PII protection
 * Receives a prompt with private information (names, emails, phone numbers),
 * anonymizes it, sends to ChatGPT, and returns the deanonymized response
 * 
 * @param {Object} req.body - Request body
 * @param {string} req.body.prompt - The prompt with PII (required)
 * @param {string} req.body.model - Model to use (optional, default: gpt-3.5-turbo)
 * @param {number} req.body.maxTokens - Max tokens in response (optional, default: 500)
 * @param {number} req.body.temperature - Temperature 0-1 (optional, default: 0.7)
 * @param {string} req.body.systemMessage - System message (optional)
 * @returns {Object} Response with the deanonymized completion
 */
app.post('/secureChatGPT', async (req, res) => {
  try {
    // Check if OpenAI service is available
    if (!openaiService) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'OpenAI service is not configured. Please set OPENAI_API_KEY environment variable.'
      });
    }

    // Validate request body
    if (!req.body || typeof req.body.prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must contain a "prompt" field with a string value'
      });
    }

    const { prompt, model, maxTokens, temperature, systemMessage } = req.body;

    // Validate prompt is not empty
    if (!prompt.trim()) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt cannot be empty'
      });
    }

    console.log(`📝 Received secureChatGPT request with prompt length: ${prompt.length}`);

    // Step 1: Anonymize PII in the prompt
    console.log('🔒 Step 1: Anonymizing PII in prompt...');
    const anonymizedPrompt = await anonymizer.anonymizeMessage(prompt);
    console.log(`✅ Anonymized ${anonymizedPrompt.match(/NAME_|EMAIL_|PHONE_/g)?.length || 0} PII items`);

    // Step 2: Send anonymized prompt to ChatGPT
    console.log('🤖 Step 2: Sending to ChatGPT...');
    const completion = await openaiService.generateCompletion(anonymizedPrompt, {
      model: model || 'gpt-3.5-turbo',
      maxTokens: maxTokens || 500,
      temperature: temperature !== undefined ? temperature : 0.7,
      systemMessage: systemMessage || 'You are a helpful assistant.'
    });
    console.log(`✅ Received response (${completion.usage.totalTokens} tokens)`);

    // Step 3: Deanonymize the response
    console.log('🔓 Step 3: Deanonymizing response...');
    const deanonymizedResponse = await anonymizer.deanonymizeMessage(completion.text);
    console.log('✅ Response deanonymized successfully');

    // Return the final response
    res.status(200).json({
      response: deanonymizedResponse,
      model: completion.model,
      tokensUsed: completion.usage.totalTokens,
      finishReason: completion.finishReason
    });

  } catch (error) {
    console.error('❌ Error in /secureChatGPT endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing the request',
      details: error.message
    });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Initialize MongoDB connection and start the server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Data Privacy Vault server running on port ${PORT}`);
      console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
      console.log(`🔒 Anonymization endpoint: http://localhost:${PORT}/anonymize`);
      console.log(`🔓 Deanonymization endpoint: http://localhost:${PORT}/deanonymize`);
      console.log(`💾 Using MongoDB Atlas for persistent storage`);
      if (openaiService) {
        console.log(`🤖 OpenAI completion endpoint: http://localhost:${PORT}/complete`);
        console.log(`🔐 OpenAI + anonymization endpoint: http://localhost:${PORT}/complete-anonymized`);
        console.log(`🛡️  Secure ChatGPT endpoint: http://localhost:${PORT}/secureChatGPT`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
