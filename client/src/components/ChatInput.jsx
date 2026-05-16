import { useState } from 'react';

const QUICK_PROMPTS = [
  'Convert to 9:16',
  'Move headline to top',
  'Make headline smaller',
  'Make discount badge bigger',
  'Change headline color to red',
  'Center the product image',
  'Move offer badge higher',
];

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div style={{ padding: '10px 14px', borderTop: '1px solid #1e2130' }}>

      {/* Quick prompt buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            disabled={loading}
            onClick={() => onSend(p)}
            style={{
              fontSize: 11, padding: '3px 9px',
              background: 'transparent', border: '1px solid #252836',
              borderRadius: 20, color: '#666', cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#3a3f55'; e.target.style.color = '#aaa'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#252836'; e.target.style.color = '#666'; }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Text input row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type any instruction... (Enter to send)"
          rows={2}
          disabled={loading}
          style={{
            flex: 1, background: '#141720', border: '1px solid #252836',
            borderRadius: 8, color: '#e0e0e0', fontSize: 13,
            padding: '8px 11px', resize: 'none', fontFamily: 'inherit',
            lineHeight: 1.5, outline: 'none',
          }}
        />
        <button
          onClick={submit}
          disabled={loading || !text.trim()}
          style={{
            padding: '8px 18px', background: '#2563eb', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !text.trim() ? 0.45 : 1,
            transition: 'opacity 0.15s',
            alignSelf: 'flex-end',
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
