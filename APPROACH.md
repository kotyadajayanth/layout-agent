# My Approach

## How I structured the LLM prompt

The system prompt teaches the AI three things:

1. What each field in the JSON means — especially the normalized coordinates (nx, ny, nw, nh). These are 0-to-1 values representing position as a percentage of the canvas. Without understanding these, the AI would treat coordinates as meaningless numbers.

2. How to identify elements by role — the JSON uses random IDs like `text_1778486306230_8`. The prompt maps readable roles: a node containing "Luxury Comfort, Surprisingly Attainable" is the headline, a node named "Product.png" is the main product image, etc.

3. The exact JSON format to return — `{ "explanation": "...", "updatedLayout": {...} }`. Strict output format prevents parsing errors.

## How I handle JSON transformations safely

I split the work between code and AI:

**Code handles:** aspect ratio conversion, moving elements (top/center/higher), resizing elements, changing colors. These are pure math — multiply nx by new canvas width, etc. Code is always reliable.

**AI handles:** any freeform instruction that doesn't match the known patterns. The AI output is always validated before it reaches the frontend. If validation fails, a friendly error is shown instead of crashing.

## How I maintain conversation context

Every request sends the last 6 chat messages as history. This lets the AI understand follow-up instructions like "make it even smaller" or "now move it to the left" — it knows what "it" refers to from the previous message.

## Trade-offs

- Most commands are handled by code rather than AI. This makes the app faster, cheaper, and more reliable — but it means truly custom freeform instructions might not work as well.
- The wireframe is approximate (colored boxes) not pixel-perfect. The goal is to show structure and confirm changes are working, not to render the final design.
- With more time I would add: undo/redo history, clicking elements in the preview to select them, and streaming AI responses for a faster feel.
