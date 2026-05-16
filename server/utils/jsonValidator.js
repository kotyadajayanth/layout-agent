export function validateLayout(layout) {
  if (!layout) throw new Error('Layout is null or undefined');
  if (!Array.isArray(layout.rootNodes)) throw new Error('layout.rootNodes must be an array');
  if (typeof layout.nodes !== 'object') throw new Error('layout.nodes must be an object');

  for (const id of layout.rootNodes) {
    if (!layout.nodes[id]) {
      throw new Error(`Root node "${id}" is missing from nodes`);
    }
  }

  // Check every node has the basic required fields
  for (const [id, node] of Object.entries(layout.nodes)) {
    if (typeof node.x === 'undefined') throw new Error(`Node "${id}" is missing x`);
    if (typeof node.y === 'undefined') throw new Error(`Node "${id}" is missing y`);
    if (!node.type) throw new Error(`Node "${id}" is missing type`);
  }

  return true;
}
