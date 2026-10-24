
import { useState } from 'react'
import './App.css'

const tools = [
  { id: 'select', label: 'Select', icon: '↖' },
  { id: 'hand', label: 'Move canvas', icon: '✥' },
  { id: 'rectangle', label: 'Rectangle', icon: '▱' },
  { id: 'circle', label: 'Circle', icon: '○' },
  { id: 'arrow', label: 'Arrow', icon: '↗' },
  { id: 'text', label: 'Text', icon: 'T' },
]

function App() {
  const [activeTool, setActiveTool] = useState('select')

  return (
    <main className="workspace">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>Knotspace</span>
          <span className="beta">BETA</span>
        </div>

        <div className="board-name">Untitled board</div>

        <div className="topbar-actions">
          <span className="save-status">● All changes saved</span>
          <button className="share-button" type="button">
            Share
          </button>
        </div>
      </header>

      <section className="editor">
        <aside className="sidebar">
          <p className="panel-label">WORKSPACE</p>
          <button className="board-item" type="button">
            <span>▦</span> My first board
          </button>

          <div className="sidebar-divider" />

          <p className="panel-label">BOARD TOOLS</p>
          <div className="tool-list">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`tool-button ${
                  activeTool === tool.id ? 'active' : ''
                }`}
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span>{tool.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-note">
            <span>✦</span>
            <p>AI design assistant</p>
            <small>Coming in a future milestone</small>
          </div>
        </aside>

        <section className="canvas-area">
          <div className="canvas-toolbar">
            <div>
              <h1>My first board</h1>
              <p>Think together. Connect the dots.</p>
            </div>
            <span className="tool-indicator">
              Active tool: {tools.find((tool) => tool.id === activeTool)?.label}
            </span>
          </div>

          <div className="canvas">
            <div className="empty-state">
              <div className="empty-icon">◇</div>
              <h2>Your ideas start here</h2>
              <p>
                This is your canvas. Soon, you will be able to draw,
                connect ideas, and build system diagrams.
              </p>
              <span className="canvas-hint">
                Choose a tool from the left panel to get started.
              </span>
            </div>
          </div>

          <footer className="canvas-footer">
            <span>Knotspace Canvas</span>
            <span>100% zoom</span>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default App
