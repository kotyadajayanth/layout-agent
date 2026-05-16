import { useLayoutAgent } from './hooks/useLayoutAgent.js';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import WireframePreview from './components/WireframePreview.jsx';
import JsonViewer from './components/JsonViewer.jsx';

export default function App() {
  const { layout, messages, loading, sendMessage, resetLayout } = useLayoutAgent();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0f1117',
      color: '#e8e8e8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 52,
        borderBottom: '1px solid #1e2130',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Layout Agent</span>
          <span style={{
            fontSize: 11, color: '#555', background: '#1a1d27',
            padding: '2px 8px', borderRadius: 10, border: '1px solid #2a2d3e',
          }}>Compra Assignment</span>
        </div>
        <button
          onClick={resetLayout}
          style={{
            fontSize: 12, padding: '5px 14px', background: 'transparent',
            border: '1px solid #2a2d3e', borderRadius: 6, color: '#777', cursor: 'pointer',
          }}
        >
          Reset Layout
        </button>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — Chat panel */}
        <div style={{
          width: 400,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #1e2130',
          background: '#0f1117',
        }}>
          <ChatWindow messages={messages} loading={loading} />
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>

        {/* RIGHT — Preview and JSON */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 20,
          background: '#0b0d14',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <div>
            <div style={labelStyle}>Wireframe Preview</div>
            <WireframePreview layout={layout} />
          </div>

          <div>
            <div style={labelStyle}>Live JSON</div>
            <JsonViewer layout={layout} />
          </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 10,
  fontWeight: 600,
  color: '#444',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: 8,
};
