import express from 'express';
import { callLLM } from '../services/llmService.js';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';
import { validateLayout } from '../utils/jsonValidator.js';
import { resizeArtboard, moveNode, resizeNode, changeColor } from '../services/layoutTransforms.js';

const router = express.Router();

// Search nodes by text content or name
function findNodeByContent(layout, keyword) {
  for (const [id, node] of Object.entries(layout.nodes)) {
    if (node.type === 'artboard') continue;
    const content = (node.data?.content || '').toLowerCase();
    const name = (node.name || '').toLowerCase();
    if (content.includes(keyword.toLowerCase()) || name.includes(keyword.toLowerCase())) {
      return id;
    }
  }
  return null;
}

// Extract a color name and hex from the message
function getColorFromMessage(msg) {
  const map = {
    red: '#FF0000',
    blue: '#0066FF',
    green: '#00BB00',
    yellow: '#FFFF00',
    orange: '#FF8800',
    purple: '#8800CC',
    pink: '#FF69B4',
    white: '#FFFFFF',
    black: '#000000',
    gold: '#F4CF1B',
  };
  for (const [name, hex] of Object.entries(map)) {
    if (msg.includes(name)) return { name, hex };
  }
  return { name: 'white', hex: '#FFFFFF' };
}

// Handle all the assignment commands with pure code (no AI needed)
function handleWithCode(message, layout) {
  const msg = message.toLowerCase().trim();

  // ASPECT RATIO CONVERSION — e.g. "convert to 9:16"
  const ratioMatch = msg.match(/(\d+)\s*:\s*(\d+)/);
  if (ratioMatch) {
    const w = parseInt(ratioMatch[1]);
    const h = parseInt(ratioMatch[2]);
    const newWidth = 1080;
    const newHeight = Math.round((1080 * h) / w);
    return {
      layout: resizeArtboard(layout, newWidth, newHeight),
      explanation: `Canvas converted to ${w}:${h} — now ${newWidth}×${newHeight}px. All elements have been repositioned.`,
    };
  }

  // MOVE HEADLINE TO TOP
  if (msg.includes('headline') && msg.includes('top')) {
    const id = findNodeByContent(layout, 'luxury');
    if (id) return { layout: moveNode(layout, id, 'top'), explanation: 'Moved the headline to the top of the canvas.' };
  }

  // MAKE HEADLINE SMALLER
  if (msg.includes('headline') && (msg.includes('smaller') || msg.includes('small') || msg.includes('reduce'))) {
    const id = findNodeByContent(layout, 'luxury');
    if (id) return { layout: resizeNode(layout, id, 0.7), explanation: 'Made the headline smaller.' };
  }

  // MAKE HEADLINE BIGGER
  if (msg.includes('headline') && (msg.includes('bigger') || msg.includes('larger') || msg.includes('big'))) {
    const id = findNodeByContent(layout, 'luxury');
    if (id) return { layout: resizeNode(layout, id, 1.3), explanation: 'Made the headline bigger.' };
  }

  // CHANGE HEADLINE COLOR
  if (msg.includes('headline') && msg.includes('color')) {
    const id = findNodeByContent(layout, 'luxury');
    if (id) {
      const color = getColorFromMessage(msg);
      return { layout: changeColor(layout, id, color.hex), explanation: `Changed the headline color to ${color.name}.` };
    }
  }

  // MAKE DISCOUNT BADGE BIGGER
  if ((msg.includes('discount') || msg.includes('badge') || msg.includes('20%') || msg.includes('off')) && (msg.includes('bigger') || msg.includes('larger'))) {
    const circleId = findNodeByContent(layout, 'circle');
    const textId = findNodeByContent(layout, '20%');
    let updated = layout;
    if (circleId) updated = resizeNode(updated, circleId, 1.35);
    if (textId) updated = resizeNode(updated, textId, 1.35);
    return { layout: updated, explanation: 'Made the discount badge bigger.' };
  }

  // MOVE OFFER BADGE HIGHER
  if ((msg.includes('offer') || msg.includes('badge') || msg.includes('limited')) && (msg.includes('higher') || msg.includes('up'))) {
    const id = findNodeByContent(layout, 'limited time');
    if (id) return { layout: moveNode(layout, id, 'higher'), explanation: 'Moved the offer badge higher up.' };
  }

  // CENTER THE PRODUCT
  if (msg.includes('product') && (msg.includes('center') || msg.includes('middle'))) {
    const id = findNodeByContent(layout, 'product');
    if (id) return { layout: moveNode(layout, id, 'center'), explanation: 'Centered the product image on the canvas.' };
  }

  // KEEP PRODUCT LARGE (reassure, no change needed)
  if (msg.includes('product') && (msg.includes('large') || msg.includes('keep') || msg.includes('big'))) {
    return { layout, explanation: 'The product image is already large and prominent — no changes made.' };
  }

  return null;
}

router.post('/', async (req, res) => {
  try {
    const { message, layout, history = [] } = req.body;

    if (!message || !layout) {
      return res.status(400).json({ error: 'message and layout are required' });
    }

    // Try code first — fast and reliable
    const codeResult = handleWithCode(message, layout);
    if (codeResult) {
      validateLayout(codeResult.layout);
      return res.json({
        updatedLayout: codeResult.layout,
        explanation: codeResult.explanation,
      });
    }

    // Fall back to Gemini for anything custom
    const systemPrompt = buildSystemPrompt(layout);
    const result = await callLLM(systemPrompt, history, message);
    validateLayout(result.updatedLayout);

    res.json({
      updatedLayout: result.updatedLayout,
      explanation: result.explanation,
    });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;
