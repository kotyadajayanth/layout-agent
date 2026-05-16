export default function WireframePreview({ layout }) {
  const rootId = layout.rootNodes[0];
  const artboard = layout.nodes[rootId];

  if (!artboard) return <div style={{ color: '#666', padding: 20 }}>No artboard found</div>;

  const aspectRatio = artboard.height / artboard.width;

  return (
    <div style={{ width: '100%' }}>
      {/* The canvas — uses padding-bottom trick to maintain aspect ratio */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${aspectRatio * 100}%`,
        background: '#1a1d27',
        border: '1px solid #2a2d3e',
        borderRadius: 6,
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {(artboard.children || []).map((id) => {
            const node = layout.nodes[id];
            if (!node) return null;

            // Get a readable short label for this element
            const label = getLabel(node);
            const bg = getBackground(node);
            const isCircle = node.data?.shapeType === 'circle';

            // How big is this element as % of canvas
            const widthPct = node.nw * 100;
            const heightPct = node.nh * 100;

            // Only show label if element is big enough to fit text
            const showLabel = widthPct > 8 && heightPct > 4;

            return (
              <div
                key={id}
                title={label}
                style={{
                  position: 'absolute',
                  left: `${node.nx * 100}%`,
                  top: `${node.ny * 100}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                  background: bg,
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: isCircle ? '50%' : 3,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {showLabel && (
                  <span style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.85)',
                    textAlign: 'center',
                    padding: '0 3px',
                    lineHeight: 1.2,
                    pointerEvents: 'none',
                    // Clip text so it never overflows the box
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                  }}>
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Canvas size info below the preview */}
      <div style={{ fontSize: 11, color: '#555', textAlign: 'center', marginTop: 6 }}>
        {artboard.width} × {artboard.height} px
      </div>
    </div>
  );
}

function getLabel(node) {
  if (node.data?.content) {
    // Trim whitespace and newlines, cap at 25 chars
    return node.data.content.replace(/\s+/g, ' ').trim().slice(0, 25);
  }
  if (node.name) return node.name.replace('.png', '');
  return node.type;
}

function getBackground(node) {
  if (node.name === 'Background.png') return 'rgba(50, 70, 110, 0.7)';
  if (node.name === 'Product.png') return 'rgba(60, 100, 180, 0.55)';
  if (node.type === 'text') return 'rgba(190, 140, 60, 0.45)';
  if (node.type === 'shape') {
    const fill = node.style?.visual?.fill?.value;
    return fill ? fill + 'CC' : 'rgba(200, 200, 60, 0.5)';
  }
  // Small star icons
  return 'rgba(100, 140, 190, 0.35)';
}
