# Layout Agent — Compra Assignment

A chat-based layout agent. You describe what you want to change in plain English, and the design layout JSON updates automatically.

---

## What it does

- Loads a design layout (Instagram Post sofa ad) from a JSON file
- You type instructions in the chat: "Convert to 9:16", "Move the headline to the top", etc.
- The layout JSON updates instantly
- A wireframe preview reflects every change in real time

---

## Setup

### You need
- Node.js v18 or newer — https://nodejs.org
- A Gemini API key (free) — https://aistudio.google.com/app/apikey

### Step 1 — Backend

Open a terminal inside the project folder:

```bash
cd server
npm install
```

Create a file called `.env` inside the `server/` folder and add:

```
GEMINI_API_KEY=your_key_here
PORT=3001
```

Then start the server:

```bash
npm run dev
```

You should see: `✅ Server running at http://localhost:3001`

### Step 2 — Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open your browser at **http://localhost:5173**

---

## Example instructions to try

- Convert to 9:16
- Move headline to top
- Make headline smaller
- Make discount badge bigger
- Change headline color to red
- Center the product image
- Move offer badge higher
- Keep the product large

---

## How it works

All the core layout commands (move, resize, recolor, aspect ratio) are handled by pure JavaScript math — no AI needed for those. This makes them fast and reliable.

Gemini (free AI) is used as a fallback for any custom instruction that doesn't match a known pattern.

---

## Project structure

```
layout-agent/
├── client/                         React frontend
│   └── src/
│       ├── App.jsx                 Main layout
│       ├── components/
│       │   ├── ChatWindow.jsx      Chat messages
│       │   ├── ChatInput.jsx       Text input + quick buttons
│       │   ├── WireframePreview.jsx  Visual canvas preview
│       │   └── JsonViewer.jsx      Live JSON display
│       ├── hooks/
│       │   └── useLayoutAgent.js   All state management
│       └── data/
│           └── initialLayout.json  The provided design JSON
│
└── server/                         Node.js backend
    ├── index.js                    Express server
    ├── routes/chat.js              POST /api/chat
    ├── services/
    │   ├── llmService.js           Gemini API integration
    │   └── layoutTransforms.js     Math helpers (resize, move, color)
    ├── prompts/systemPrompt.js     AI instructions
    └── utils/jsonValidator.js      Validate AI output
```

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI | Gemini 1.5 Flash (free) |
| State | React hooks |
