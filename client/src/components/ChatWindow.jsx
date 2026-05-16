import { useEffect, useRef } from 'react';

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {messages.map((msg, i) => {
        const isUser = msg.role === 'user';
        return (
          <div key={i} style={{
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
          }}>
            <div style={{
              fontSize: 10,
              color: '#555',
              marginBottom: 3,
              textAlign: isUser ? 'right' : 'left',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {isUser ? 'You' : 'Agent'}
            </div>
            <div style={{
              padding: '9px 13px',
              borderRadius: 10,
              background: isUser ? '#1e3a5f' : '#1a1d27',
              border: isUser ? 'none' : '1px solid #2a2d3e',
              fontSize: 13,
              lineHeight: 1.55,
              color: '#e0e0e0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.content}
            </div>
          </div>
        );
      })}

      {loading && (
        <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
          <div style={{ fontSize: 10, color: '#555', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agent</div>
          <div style={{
            padding: '9px 13px', borderRadius: 10,
            background: '#1a1d27', border: '1px solid #2a2d3e',
            fontSize: 13, color: '#555',
          }}>
            Thinking...
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
