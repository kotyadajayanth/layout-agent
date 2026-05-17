import axios from 'axios';

const api = axios.create({
  baseURL: 'https://layout-agent-2mz8.onrender.com',
  timeout: 60000, // LLM calls can be slow
});

export async function sendChatMessage(message, layout, history) {
  const response = await api.post('/api/chat', { message, layout, history });
  return response.data;
}
