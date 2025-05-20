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
    origin: '*',
  },
});

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002/api/products';
const MERCH_SERVICE_URL =
  process.env.MERCH_SERVICE_URL || 'http://localhost:5003/api/merch';

if (!process.env.GEMINI_API_KEY) {
  console.error(
    'Error: GEMINI_API_KEY is not set in the environment variables.'
  );
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

let products = [];
let merch = [];

const fetchData = async () => {
  try {
    console.log('Fetching product and merch data...');
    const [productRes, merchRes] = await Promise.all([
      axios.get(PRODUCT_SERVICE_URL),
      axios.get(MERCH_SERVICE_URL),
    ]);

    products = productRes.data || [];
    merch = merchRes.data || [];

    console.log('Products and merch data loaded');
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

fetchData();
setInterval(fetchData, 60 * 60 * 1000);

const conversationHistories = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  conversationHistories[socket.id] = [];

  const initialBotMessage =
    'Hello! I am your sales assistant. How can I help you find the perfect coffee or merch today?';
  conversationHistories[socket.id].push({
    sender: 'bot',
    text: initialBotMessage,
  });
  socket.emit('message', {
    sender: 'bot',
    text: initialBotMessage,
  });

  socket.on('sendMessage', async (message) => {
    console.log('Message from client:', message);
    conversationHistories[socket.id].push({
      sender: 'user',
      text: message.text,
    });
    socket.emit('message', { sender: 'user', text: message.text });

    try {
      const botResponseData = await generateGeminiResponse(
        message.text,
        products,
        merch,
        conversationHistories[socket.id]
      );
      conversationHistories[socket.id].push({
        sender: 'bot',
        text: botResponseData.text,
        recommendations: botResponseData.recommendations,
      });
      socket.emit('message', {
        sender: 'bot',
        text: botResponseData.text,
        recommendations: botResponseData.recommendations,
      });
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage =
        "I'm having a little trouble right now. Please try again later.";
      socket.emit('message', {
        sender: 'bot',
        text: errorMessage,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    delete conversationHistories[socket.id];
  });
});

const generateGeminiResponse = async (
  userMessage,
  productList,
  merchList,
  history
) => {
  const productInfo =
    productList.length > 0
      ? productList
          .map(
            (p) =>
              `- ProductID: ${p._id}, Name: ${p.name}, Image: ${p.imageDisplay}, Description: ${p.description} (Price: $${p.price})`
          )
          .join('\\n')
      : 'No products currently listed.';
  const merchInfo =
    merchList.length > 0
      ? merchList
          .map(
            (m) =>
              `- ProductID: ${m._id}, Name: ${m.name}, Image: ${m.imageDisplay}, Description: ${m.description} (Price: $${m.price})`
          )
          .join('\\n')
      : 'No merchandise currently listed.';

  const formattedHistory = history
    .map(
      (msg) =>
        `${msg.sender === 'user' ? 'User' : 'Sales Assistant'}: ${msg.text}`
    )
    .join('\\\\n');

  const prompt = `You are a friendly and helpful sales assistant for "Ok But First Coffee", a shop that sells coffee and merchandise.
Your goal is to assist customers, answer their questions about products, and help them with the buying process in a natural conversational tone.
Do not make up products or information not present in the lists below.
If a user asks a question that is not related to coffee, merchandise, or the shop, politely state that you can only help with shop-related inquiries.
Please respond in the same language as the user's message.

When you suggest specific products from the lists, you MUST also append a special JSON block at the VERY END of your response. This JSON block must start with ###PRODUCT_JSON_START### and end with ###PRODUCT_JSON_END###. The content between these delimiters must be a valid JSON array of objects. Each object in the array should represent a suggested product and include ONLY the fields: "id" (the ProductID from the provided list), "name", "image", type (type of product 'merch' or 'product') and "price". Your main conversational response should be natural and friendly, and should not explicitly mention this JSON block or the delimiters.
Example of how to format when suggesting products:
"I recommend our Ethiopian Yirgacheffe for a bright, citrusy coffee. We also have some lovely branded mugs that would go perfectly with it!
###PRODUCT_JSON_START###
[{"id": "67ffdb8f565c1bcb0b6f02a1", "type": "merch", "image": "nzumgnvrkyseanxhub7k", "name": "Ethiopian Yirgacheffe", "price": 15.99}, {"productId": "merch_002", "name": "Branded Coffee Mug", "price": 12.00}]
###PRODUCT_JSON_END###"
If no specific products are suggested, or if the query is off-topic, DO NOT include the JSON block or delimiters. Only include it when making concrete product suggestions from the lists.

Conversation History:
${formattedHistory}

Available Products:
${productInfo}

Available Merchandise:
${merchInfo}

Based on this information and the user's message, provide a helpful and relevant response.
User message: "${userMessage}"
Sales Assistant:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let rawText = response.text();
    let recommendations = null;

    const jsonStartDelimiter = '###PRODUCT_JSON_START###';
    const jsonEndDelimiter = '###PRODUCT_JSON_END###';

    const startIndex = rawText.indexOf(jsonStartDelimiter);
    const endIndex = rawText.indexOf(jsonEndDelimiter);

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      const jsonString = rawText
        .substring(startIndex + jsonStartDelimiter.length, endIndex)
        .trim();
      try {
        recommendations = JSON.parse(jsonString);
        rawText = rawText.substring(0, startIndex).trim();
      } catch (e) {
        console.error('Error parsing product JSON from AI response:', e);
      }
    }
    return { text: rawText, recommendations };
  } catch (error) {
    console.error('Error generating response from Gemini:', error.message);
    if (error.message && error.message.includes('API key not valid')) {
      return {
        text: 'There seems to be an issue with my connection to the knowledge base. Please tell the site administrator to check the API key.',
      };
    }
    return {
      text: "I'm currently experiencing a high volume of requests or a technical difficulty. Please try again in a moment.",
    };
  }
};

const PORT = process.env.CHATBOT_SERVICE_PORT || 5006;
server.listen(PORT, () => {
  console.log(`Chatbot service running on port ${PORT}`);
});
