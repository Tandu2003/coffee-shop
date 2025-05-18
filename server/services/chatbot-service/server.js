const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for now, adjust in production
  },
});

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002/api/products'; // Replace with actual URL
const MERCH_SERVICE_URL =
  process.env.MERCH_SERVICE_URL || 'http://localhost:5003/api/merch'; // Replace with actual URL

// Access your API key as an environment variable
if (!process.env.GEMINI_API_KEY) {
  console.error(
    'Error: GEMINI_API_KEY is not set in the environment variables.'
  );
  process.exit(1); // Stop the service if the API key is missing
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let products = [];
let merch = [];

// Fetch initial product and merch data
const fetchData = async () => {
  try {
    console.log('Fetching product and merch data...');
    const [productRes, merchRes] = await Promise.all([
      axios.get('http://localhost:5002/api/products'),
      axios.get('http://localhost:5003/api/merch'),
    ]);

    products = productRes.data || [];
    merch = merchRes.data || [];

    console.log('Products:', products);
    console.log('Merch:', merch);

    console.log('Products and merch data loaded');
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

fetchData(); // Load data on server start
setInterval(fetchData, 60 * 60 * 1000); // Refresh data every hour

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.emit('message', {
    sender: 'bot',
    text: 'Hello! I am your sales assistant. How can I help you find the perfect coffee or merch today?',
  });

  socket.on('sendMessage', async (message) => {
    console.log('Message from client:', message);
    socket.emit('message', { sender: 'user', text: message.text }); // Echo user message

    try {
      // const botResponse = await generateBotResponse(message.text); // Old simple response
      const botResponse = await generateGeminiResponse(
        message.text,
        products,
        merch
      ); // New Gemini response
      socket.emit('message', { sender: 'bot', text: botResponse });
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('message', {
        sender: 'bot',
        text: "I'm having a little trouble right now. Please try again later.",
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Old generateBotResponse function (can be removed or kept for fallback)
/*
const generateBotResponse = async (userMessage) => {
  // ... (previous simple logic)
};
*/

const generateGeminiResponse = async (userMessage, productList, merchList) => {
  const productInfo =
    productList.length > 0
      ? productList
          .map((p) => `- ${p.name}: ${p.description} (Price: $${p.price})`)
          .join('\n')
      : 'No products currently listed.';
  const merchInfo =
    merchList.length > 0
      ? merchList
          .map((m) => `- ${m.name}: ${m.description} (Price: $${m.price})`)
          .join('\n')
      : 'No merchandise currently listed.';

  const prompt = `You are a friendly and helpful sales assistant for "Ok But First Coffee", a shop that sells coffee and merchandise.
Your goal is to assist customers, answer their questions about products, and help them with the buying process in a natural conversational tone.
Do not make up products or information not present in the lists below.
If a user asks a question that is not related to coffee, merchandise, or the shop, politely state that you can only help with shop-related inquiries.

Available Products:
${productInfo}

Available Merchandise:
${merchInfo}

Based on this information and the user's message, provide a helpful and relevant response.
User message: "${userMessage}"
Sales Assistant:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log({ response });
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating response from Gemini:', error.message);
    // Check for specific error types if the SDK provides them, e.g., API key issues, rate limits
    if (error.message && error.message.includes('API key not valid')) {
      return 'There seems to be an issue with my connection to the knowledge base. Please tell the site administrator to check the API key.';
    }
    return "I'm currently experiencing a high volume of requests or a technical difficulty. Please try again in a moment.";
  }
};

const PORT = process.env.CHATBOT_SERVICE_PORT || 5006;
server.listen(PORT, () => {
  console.log(`Chatbot service running on port ${PORT}`);
});
