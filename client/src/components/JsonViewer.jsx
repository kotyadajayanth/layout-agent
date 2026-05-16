import { useState } from 'react';

export default function JsonViewer({ layout }) {
  const [open, setOpen] = useState(true);
  const json = JSON.stringify(layout, null, 2);

  return (
    <div style={{
      border: '1px solid #1e2130',
      borderRadius: 8,
      overflow: 'hidden',
      background: '#0d0f18',
    }}>
      {/* Header row */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 14px', background: '#141720',
          cursor: 'pointer', userSelect: 'none',
          borderBottom: open ? '1px solid #1e2130' : 'none',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#bbb' }}>Layout JSON</span>
        <span style={{ fontSize: 11, color: '#444' }}>{open ? '▼ hide' : '▶ show'}</span>
      </div>

      {/* JSON content */}
      {open && (
        <pre style={{
          maxHeight: 320,
          overflowY: 'auto',
          margin: 0,
          padding: '12px 14px',
          fontSize: 11,
          lineHeight: 1.6,
          color: '#6dbde3',
          fontFamily: '"Courier New", monospace',
          whiteSpace: 'pre',
        }}>
          {json}
        </pre>
      )}
    </div>
  );
}
