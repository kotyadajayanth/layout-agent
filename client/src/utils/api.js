import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 60000, // LLM calls can be slow
});

export async function sendChatMessage(message, layout, history) {
  const response = await api.post('/api/chat', { message, layout, history });
  return response.data;
}
