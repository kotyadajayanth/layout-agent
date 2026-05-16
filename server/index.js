import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRoute from './routes/chat.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/chat', chatRoute);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.log(`⚠️  Warning: GEMINI_API_KEY is not set in server/.env`);
  } else {
    console.log(`✅ Gemini API key loaded\n`);
  }
});
