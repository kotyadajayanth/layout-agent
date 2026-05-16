// Pure math functions — no AI, just calculations

function deepCopy(layout) {
  return JSON.parse(JSON.stringify(layout));
}

function getArtboard(layout) {
  const rootId = layout.rootNodes[0];
  return layout.nodes[rootId];
}

// Convert to a new canvas size using normalized coordinates
export function resizeArtboard(layout, newWidth, newHeight) {
  const updated = deepCopy(layout);
  const artboard = getArtboard(updated);

  artboard.width = newWidth;
  artboard.height = newHeight;

  for (const childId of artboard.children || []) {
    const node = updated.nodes[childId];
    if (!node) continue;

    node.x = node.nx * newWidth;
    node.y = node.ny * newHeight;
    node.width = node.nw * newWidth;
    node.height = node.nh * newHeight;

    // Scale font size proportionally for text nodes
    if (node.type === 'text' && node.fontSizeRatio) {
      node.style.visual.fontSize = Math.round(node.fontSizeRatio * newWidth);
    }
  }

  return updated;
}

// Move a node to a position: top, bottom, center, left, right, higher, lower
export function moveNode(layout, nodeId, direction) {
  const updated = deepCopy(layout);
  const artboard = getArtboard(updated);
  const node = updated.nodes[nodeId];
  if (!node) return updated;

  const W = artboard.width;
  const H = artboard.height;

  if (direction === 'top') {
    node.y = 20;
  } else if (direction === 'bottom') {
    node.y = H - node.height - 20;
  } else if (direction === 'higher') {
    node.y = Math.max(10, node.y - 80);
  } else if (direction === 'lower') {
    node.y = Math.min(H - node.height - 10, node.y + 80);
  } else if (direction === 'center') {
    node.x = (W - node.width) / 2;
    node.nx = node.x / W;
    node.y = (H - node.height) / 2;
  } else if (direction === 'left') {
    node.x = 20;
    node.nx = 20 / W;
  } else if (direction === 'right') {
    node.x = W - node.width - 20;
    node.nx = node.x / W;
  }

  // Always sync normalized values after moving
  node.ny = node.y / H;
  if (direction !== 'higher' && direction !== 'lower' && direction !== 'top' && direction !== 'bottom') {
    node.nx = node.x / W;
  }

  return updated;
}

// Scale a node bigger or smaller
export function resizeNode(layout, nodeId, scale) {
  const updated = deepCopy(layout);
  const artboard = getArtboard(updated);
  const node = updated.nodes[nodeId];
  if (!node) return updated;

  node.width = node.width * scale;
  node.height = node.height * scale;
  node.nw = node.width / artboard.width;
  node.nh = node.height / artboard.height;

  if (node.type === 'text' && node.style?.visual?.fontSize) {
    node.style.visual.fontSize = Math.round(node.style.visual.fontSize * scale);
  }

  return updated;
}

// Change text color of a node
export function changeColor(layout, nodeId, hexColor) {
  const updated = deepCopy(layout);
  const node = updated.nodes[nodeId];
  if (!node) return updated;

  node.style.visual.color = { type: 'solid', value: hexColor };
  return updated;
}
