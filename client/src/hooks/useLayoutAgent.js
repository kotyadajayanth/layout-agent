import { useState } from 'react';
import initialLayout from '../data/initialLayout.json';
import { sendChatMessage } from '../utils/api.js';

export function useLayoutAgent() {
  const [layout, setLayout] = useState(initialLayout);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your layout agent. Tell me what to change — for example: \"Convert to 9:16\", \"Move the headline to the top\", or \"Make the discount badge bigger\".",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      // Send last 6 messages as history so follow-ups work ("make it bigger" etc.)
      const history = messages.slice(-6);
      const data = await sendChatMessage(text, layout, history);

      setLayout(data.updatedLayout);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.explanation },
      ]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || 'Something went wrong. Is the server running?';
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ ${errorMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetLayout = () => {
    setLayout(initialLayout);
    setMessages([
      {
        role: 'assistant',
        content: 'Layout reset to the original design.',
      },
    ]);
  };

  return { layout, messages, loading, error, sendMessage, resetLayout };
}
