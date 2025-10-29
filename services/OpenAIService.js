/**
 * OpenAI Service
 * 
 * This service handles all interactions with the OpenAI API for text completions
 */

const OpenAI = require('openai');

class OpenAIService {
  /**
   * Initialize the OpenAI service
   * 
   * @param {string} apiKey - OpenAI API key
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: apiKey
    });

    this.defaultModel = 'gpt-3.5-turbo';
    this.defaultMaxTokens = 500;
    this.defaultTemperature = 0.7;
  }

  /**
   * Generate a text completion
   * 
   * @param {string} prompt - The prompt to send to OpenAI
   * @param {Object} options - Additional options for the completion
   * @param {string} options.model - Model to use (default: gpt-3.5-turbo)
   * @param {number} options.maxTokens - Maximum tokens in response (default: 500)
   * @param {number} options.temperature - Temperature for randomness (default: 0.7)
   * @param {string} options.systemMessage - System message to set context
   * @returns {Promise<Object>} Completion response with text and metadata
   */
  async generateCompletion(prompt, options = {}) {
    try {
      const {
        model = this.defaultModel,
        maxTokens = this.defaultMaxTokens,
        temperature = this.defaultTemperature,
        systemMessage = 'You are a helpful assistant.'
      } = options;

      // Validate prompt
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt must be a non-empty string');
      }

      // Build messages array
      const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ];

      // Make API call
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature
      });

      // Extract response
      const response = {
        text: completion.choices[0].message.content,
        model: completion.model,
        usage: {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        },
        finishReason: completion.choices[0].finish_reason
      };

      return response;

    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }

  /**
   * Generate a chat completion with conversation history
   * 
   * @param {Array} messages - Array of message objects [{role: 'user'|'assistant', content: 'text'}]
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Completion response
   */
  async generateChatCompletion(messages, options = {}) {
    try {
      const {
        model = this.defaultModel,
        maxTokens = this.defaultMaxTokens,
        temperature = this.defaultTemperature,
        systemMessage = 'You are a helpful assistant.'
      } = options;

      // Validate messages
      if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('Messages must be a non-empty array');
      }

      // Build messages array with system message
      const fullMessages = [
        { role: 'system', content: systemMessage },
        ...messages
      ];

      // Make API call
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: fullMessages,
        max_tokens: maxTokens,
        temperature: temperature
      });

      // Extract response
      const response = {
        text: completion.choices[0].message.content,
        role: completion.choices[0].message.role,
        model: completion.model,
        usage: {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        },
        finishReason: completion.choices[0].finish_reason
      };

      return response;

    } catch (error) {
      console.error('OpenAI Chat API Error:', error.message);
      throw new Error(`Failed to generate chat completion: ${error.message}`);
    }
  }

  /**
   * Generate a streaming completion
   * 
   * @param {string} prompt - The prompt to send to OpenAI
   * @param {Object} options - Additional options
   * @param {Function} onChunk - Callback for each chunk of text
   * @returns {Promise<Object>} Final completion response
   */
  async generateStreamingCompletion(prompt, options = {}, onChunk) {
    try {
      const {
        model = this.defaultModel,
        maxTokens = this.defaultMaxTokens,
        temperature = this.defaultTemperature,
        systemMessage = 'You are a helpful assistant.'
      } = options;

      // Build messages array
      const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ];

      // Make streaming API call
      const stream = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature,
        stream: true
      });

      let fullText = '';
      
      // Process stream
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullText += content;
          if (onChunk) {
            onChunk(content);
          }
        }
      }

      return {
        text: fullText,
        model: model
      };

    } catch (error) {
      console.error('OpenAI Streaming API Error:', error.message);
      throw new Error(`Failed to generate streaming completion: ${error.message}`);
    }
  }

  /**
   * Count tokens in a text (approximate)
   * 
   * @param {string} text - Text to count tokens for
   * @returns {number} Approximate token count
   */
  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters or 0.75 words
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 0.75);
  }

  /**
   * Check if API key is valid
   * 
   * @returns {Promise<boolean>} True if API key is valid
   */
  async validateApiKey() {
    try {
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error('API Key validation failed:', error.message);
      return false;
    }
  }

  /**
   * List available models
   * 
   * @returns {Promise<Array>} List of available models
   */
  async listModels() {
    try {
      const response = await this.client.models.list();
      return response.data.map(model => ({
        id: model.id,
        created: model.created,
        ownedBy: model.owned_by
      }));
    } catch (error) {
      console.error('Failed to list models:', error.message);
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;




